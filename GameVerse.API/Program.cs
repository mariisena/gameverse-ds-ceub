// GameVerse.API/Program.cs

using Microsoft.EntityFrameworkCore;
using GameVerse.Infrastructure;
using GameVerse.Application.Interfaces;
using GameVerse.Application.Services;
using GameVerse.Infrastructure.Repositories;
using GameVerse.API.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<GameVerseDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)))
);

// 2. Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();      // ✅ Importante para cookies/tokens
        });
});

// 3. Configuração de autenticação JWT
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("A chave secreta do JWT não está configurada no appsettings.json");
}
// ✅ Validação robusta da chave
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Em desenvolvimento, podemos usar false. Em produção, true.
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = false, // Não estamos validando quem emitiu
        ValidateAudience = false, // Não estamos validando para quem se destina
        ClockSkew = TimeSpan.Zero // Remove delay padrão de 5 minutos
    };
});

// 4. Injeção de Dependência
// Serviços do container
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Injeção de Dependência para Games
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<GameService>();

// Injeção de Dependência para Posts
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<PostService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    // ✅ JWT no Swagger
    options.AddSecurityDefinition("Bearer", new()
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new()
    {
        {
            new ()
            {
                Reference = new ()
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseCors("AllowReactApp");

app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GameVerse API V1");
        c.RoutePrefix = string.Empty; // Swagger na raiz
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Log da URL da aplicação
var urls = builder.Configuration["urls"] ?? "http://localhost:5121";
Console.WriteLine($"🚀 GameVerse API rodando em: {urls}");
Console.WriteLine($"📚 Swagger disponível em: {urls}/swagger");
Console.WriteLine($"🔐 Autenticação JWT: {(string.IsNullOrEmpty(jwtKey) ? "❌ Não configurada" : "✅ Configurada")}");
Console.WriteLine($"🌐 CORS: ✅ Configurado para React (portas 3000, 3001)");
Console.WriteLine($"🗄️  Database: {connectionString?.Split(';').FirstOrDefault()?.Replace("Server=", "")}");

app.Run();

