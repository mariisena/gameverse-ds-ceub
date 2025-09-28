// auth.js

// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('loginBtn');
const loginText = document.getElementById('loginText');
const loginLoading = document.getElementById('loginLoading');

if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;
    
    if (!identifier || !password) {
        showError('Por favor, preencha todos os campos.');
        return;
    }
    
    setLoading(true);
    hideError();
    
    try {
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('gameverse_token', data.token);
            localStorage.setItem('gameverse_user', JSON.stringify({ message: data.message }));
            
            showSuccess('Login realizado com sucesso! Redirecionando...');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } else {
            showError(data.message || 'Erro ao fazer login. Tente novamente.');
        }
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        } else {
            showError('Erro inesperado. Tente novamente.');
        }
    } finally {
        setLoading(false);
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'error-message';
}

function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.className = 'success-message';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    loginText.style.display = isLoading ? 'none' : 'inline';
    loginLoading.style.display = isLoading ? 'inline' : 'none';
}

function isUserLoggedIn() {
    return localStorage.getItem('gameverse_token') !== null;
}

function logout() {
    localStorage.removeItem('gameverse_token');
    localStorage.removeItem('gameverse_user');
    window.location.href = 'login.html';
}

function getAuthToken() {
    return localStorage.getItem('gameverse_token');
}

if (window.location.pathname.includes('login.html') && isUserLoggedIn()) {
    window.location.href = 'dashboard.html';
}
