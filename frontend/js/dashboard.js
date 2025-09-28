// dashboard.js

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
        await loadUserInfo();
        await loadDashboardStats();
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
        
        const response = await fetch(`${window.API_CONFIG.BASE_URL}/api/auth/me`, {
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
        const gamesResponse = await fetch(`${window.API_CONFIG.BASE_URL}/api/games`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (gamesResponse.ok) {
            const games = await gamesResponse.json();
            totalGames.textContent = games.length || 0;
            
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

        const postsResponse = await fetch(`${window.API_CONFIG.BASE_URL}/api/posts`, {
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
    
    try {
        const gamesResponse = await fetch(`${window.API_CONFIG.BASE_URL}/api/games`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (gamesResponse.ok) {
            const games = await gamesResponse.json();
            displayRecentGames(games.slice(0, 3));
        } else {
            recentGames.innerHTML = '<div class="loading">Nenhum jogo encontrado.</div>';
        }
    } catch (error) {
        console.error('Erro ao carregar jogos recentes:', error);
        recentGames.innerHTML = '<div class="loading">Erro ao carregar jogos.</div>';
    }

    try {
        const postsResponse = await fetch(`${window.API_CONFIG.BASE_URL}/api/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (postsResponse.ok) {
            const posts = await postsResponse.json();
            displayRecentPosts(posts.slice(0, 3));
        } else {
            recentPosts.innerHTML = '<div class="loading">Nenhum post encontrado.</div>';
        }
    } catch (error) {
        console.error('Erro ao carregar posts recentes:', error);
        recentPosts.innerHTML = '<div class="loading">Erro ao carregar posts.</div>';
    }
}
