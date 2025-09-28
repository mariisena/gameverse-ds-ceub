<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameVerse - Login</title>
    <link rel="stylesheet" href="css/login.css">

</head>
<body>
    <div class="container">
        <div class="login-card">
            <h1>GameVerse</h1>
            <h2>Faça seu Login</h2>
            
            <!-- Área para mostrar mensagens de erro -->
            <div id="error-message" class="error-message" style="display: none;"></div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="identifier">Email ou Username:</label>
                    <input type="text" id="identifier" name="identifier" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" id="loginBtn">
                    <span id="loginText">Entrar</span>
                    <span id="loginLoading" style="display: none;">Carregando...</span>
                </button>
            </form>
            
            <div class="links">
                <p>Não tem uma conta? <a href="register.html">Cadastre-se aqui</a></p>
                <p><a href="index.html">← Voltar para o início</a></p>
            </div>
        </div>
    </div>
    
<script src="js/api-config.js"></script>
<script src="js/auth.js"></script>

</body>
</html>