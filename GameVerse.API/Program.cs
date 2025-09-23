// GameVerse.API/Program.cs

using Microsoft.EntityFrameworkCore;
using GameVerse.Infrastructure;
using GameVerse.Application.Interfaces;
using GameVerse.Application.Services;
using GameVerse.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. Pega a string de conexão do appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Adiciona o DbContext ao contêiner de injeção de dependência
builder.Services.AddDbContext<GameVerseDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)))
);

// Add services to the container.
// Serviços do container
builder.Services.AddScoped<AuthService>();

builder.Services.AddControllers();

builder.Services.AddScoped<IUserRepository, UserRepository>();


builder.Services.AddEndpointsApiExplorer(); // mantém para Swagger/OpenAPI
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuração do pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
