// Configuração da API (mesma do auth.js)
const API_BASE_URL = window.API_CONFIG.BASE_URL; // Ajuste conforme sua configuração

// Elementos do DOM
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const totalGames = document.getElementById('totalGames');
const totalPosts = document.getElementById('totalPosts');
const activeProjects = document.getElementById('activeProjects');
const recentGames = document.getElementById('recentGames');
const recentPosts = document.getElementById('recentPosts');

// Verificar se usuário está logado
document.addEventListener('DOMContentLoaded', function() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Inicializar dashboard
    initDashboard();
});

// Event listener para logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

/**
 * Inicializa o dashboard carregando todos os dados
 */
async function initDashboard() {
    try {
        // Carregar dados do usuário
        await loadUserInfo();
        
        // Carregar estatísticas
        await loadDashboardStats();
        
        // Carregar itens recentes
        await loadRecentItems();
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        showError('Erro ao carregar dados do dashboard.');
    }
}

/**
 * Carrega informações do usuário logado
 */
async function loadUserInfo() {
    try {
        const token = getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            userName.textContent = userData.username || userData.email || 'Usuário';
        } else if (response.status === 401) {
            // Token inválido - fazer logout
            logout();
        } else {
            userName.textContent = 'Usuário';
        }
    } catch (error) {
        console.error('Erro ao carregar info do usuário:', error);
        userName.textContent = 'Usuário';
    }
}

/**
 * Carrega estatísticas para o dashboard
 */
async function loadDashboardStats() {
    const token = getAuthToken();
    
    try {
        // Carregar jogos
        const gamesResponse = await fetch(`${API_BASE_URL}/api/games`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (gamesResponse.ok) {
            const games = await gamesResponse.json();
            totalGames.textContent = games.length || 0;
            
            // Contar projetos ativos (status diferente de 'completed' ou 'cancelled')
            const activeCount = games.filter(game => 
                game.status && 
                game.status.toLowerCase() !== 'completed' && 
                game.status.toLowerCase() !== 'cancelled'
            ).length;
            activeProjects.textContent = activeCount;
        } else {
            totalGames.textContent = '0';
            activeProjects.textContent = '0';
        }

        // Carregar posts
        const postsResponse = await fetch(`${API_BASE_URL}/api/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (postsResponse.ok) {
            const posts = await postsResponse.json();
            totalPosts.textContent = posts.length || 0;
        } else {
            totalPosts.textContent = '0';
        }

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        totalGames.textContent = '-';
        totalPosts.textContent = '-';
        activeProjects.textContent = '-';
    }
}

/**
 * Carrega itens recentes (últimos jogos e posts)
 */
async function loadRecentItems() {
    const token = getAuthToken();
    
    // Carregar jogos recentes
    try {
        const gamesResponse = await fetch(`${API_BASE_URL}/api/games`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (gamesResponse.ok) {
            const games = await gamesResponse.json();
            displayRecentGames(games.slice(0, 3)); // Últimos 3 jogos
        } else {
            recentGames.innerHTML = '<div class="loading">Nenhum jogo encontrado.</div>';
        }
    } catch (error) {
        console.error('Erro ao carregar jogos recentes:', error);
        recentGames.innerHTML = '<div class="loading">Erro ao carregar jogos.</div>';
    }

    // Carregar posts recentes
    try {
        const postsResponse = await fetch(`${API_BASE_URL}/api/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (postsResponse.ok) {
            const posts = await postsResponse.json();
            displayRecentPosts(posts.slice(0, 3)); // Últimos 3 posts
        } else {
            recentPosts.innerHTML = '<div class="loading">Nenhum post encontrado.</div>';
        }
    } catch (error) {
        console.error('Erro ao carregar posts recentes:', error);
        recentPosts.innerHTML = '<div class="loading">Erro ao carregar posts.</div>';
    }
}

/**
 * Exibe jogos recentes na interface
 */
function displayRecentGames(games) {
    if (games.length === 0) {
        recentGames.innerHTML = '<div class="loading">Nenhum jogo cadastrado ainda.</div>';
        return;
    }

    const gamesHTML = games.map(game => `
        <div class="recent-item">
            <h4>${escapeHtml(game.title || 'Sem título')}</h4>
            <p><strong>Gênero:</strong> ${escapeHtml(game.genre || 'Não especificado')}</p>
            <p><strong>Status:</strong> ${escapeHtml(game.status || 'Em desenvolvimento')}</p>
        </div>
    `).join('');

    recentGames.innerHTML = gamesHTML;
}

/**
 * Exibe posts recentes na interface
 */
function displayRecentPosts(posts) {
    if (posts.length === 0) {
        recentPosts.innerHTML = '<div class="loading">Nenhum post publicado ainda.</div>';
        return;
    }

    const postsHTML = posts.map(post => `
        <div class="recent-item">
            <h4>${escapeHtml(post.title || 'Sem título')}</h4>
            <p><strong>Tipo:</strong> ${escapeHtml(post.postType || 'Post')}</p>
            <p>${truncateText(escapeHtml(post.bodyContent || 'Sem conteúdo'), 100)}</p>
        </div>
    `).join('');

    recentPosts.innerHTML = postsHTML;
}

/**
 * Função utilitária para escapar HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Função utilitária para truncar texto
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Exibe mensagem de erro
 */
function showError(message) {
    // Criar elemento de erro se não existir
    let errorDiv = document.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        document.querySelector('.main-content').prepend(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Remover após 5 segundos
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

/**
 * Recarregar dados do dashboard
 */
function refreshDashboard() {
    // Resetar conteúdo
    totalGames.textContent = '-';
    totalPosts.textContent = '-';
    activeProjects.textContent = '-';
    recentGames.innerHTML = '<div class="loading">Carregando...</div>';
    recentPosts.innerHTML = '<div class="loading">Carregando...</div>';
    
    // Recarregar
    initDashboard();
}

// Atualizar dados a cada 30 segundos (opcional)
setInterval(refreshDashboard, 30000);