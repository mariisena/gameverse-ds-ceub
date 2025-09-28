// Configuração da API
const API_BASE_URL = 'https://localhost:7296'; // 🔧 AJUSTE AQUI SUA URL DO BACKEND

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('loginBtn');
const loginText = document.getElementById('loginText');
const loginLoading = document.getElementById('loginLoading');

// Event listener para o formulário de login
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

/**
 * Função principal para lidar com o login
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Pega os valores dos campos
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;
    
    // Validação básica no frontend
    if (!identifier || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }
    
    // Mostra loading
    setLoading(true);
    hideError();
    
    try {
        // Chama a API de login
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: identifier,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login bem-sucedido!
            console.log('Login realizado com sucesso:', data);
            
            // Salva o token no localStorage
            localStorage.setItem('gameverse_token', data.token);
            localStorage.setItem('gameverse_user', JSON.stringify({
                message: data.message
            }));
            
            // Redireciona para o dashboard (vamos criar depois)
            showSuccess('Login realizado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            // Erro da API
            showError(data.message || 'Erro ao fazer login. Tente novamente.');
        }
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        
        // Verifica se é erro de conexão
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        } else {
            showError('Erro inesperado. Tente novamente.');
        }
    } finally {
        setLoading(false);
    }
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'error-message';
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'success-message';
}

/**
 * Esconde mensagens
 */
function hideError() {
    errorMessage.style.display = 'none';
}

/**
 * Controla o estado de loading do botão
 */
function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    
    if (isLoading) {
        loginText.style.display = 'none';
        loginLoading.style.display = 'inline';
    } else {
        loginText.style.display = 'inline';
        loginLoading.style.display = 'none';
    }
}

/**
 * Função para verificar se o usuário já está logado
 */
function isUserLoggedIn() {
    const token = localStorage.getItem('gameverse_token');
    return token !== null;
}

/**
 * Função para fazer logout
 */
function logout() {
    localStorage.removeItem('gameverse_token');
    localStorage.removeItem('gameverse_user');
    window.location.href = 'login.html';
}

/**
 * Função para pegar o token do usuário logado
 */
function getAuthToken() {
    return localStorage.getItem('gameverse_token');
}

// Se já estiver logado, redireciona para dashboard
if (window.location.pathname.includes('login.html') && isUserLoggedIn()) {
    window.location.href = 'dashboard.html';
}