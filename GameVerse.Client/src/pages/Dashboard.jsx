<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GameVerse - Dashboard</title>
    <link rel="stylesheet" href="css/dashboard.css">
</head>

<body>
    <!-- Header com navegação -->
    <header class="header">
        <div class="container">
            <div class="logo">
                <h1>GameVerse</h1>
            </div>
            <nav class="nav">
                <ul>
                    <li><a href="dashboard.html" class="active">Dashboard</a></li>
                    <li><a href="games.html">Meus Jogos</a></li>
                    <li><a href="posts.html">Meus Posts</a></li>
                </ul>
            </nav>
            <div class="user-menu">
                <span id="userName">Carregando...</span>
                <button id="logoutBtn" class="logout-btn">Sair</button>
            </div>
        </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="main-content">
        <div class="container">
            <!-- Boas-vindas -->
            <section class="welcome-section">
                <h2>Bem-vindo ao GameVerse!</h2>
                <p>Gerencie seus jogos e posts de desenvolvimento.</p>
            </section>

            <!-- Cards de resumo -->
            <section class="stats-section">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🎮</div>
                        <div class="stat-info">
                            <h3 id="totalGames">-</h3>
                            <p>Jogos Cadastrados</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-info">
                            <h3 id="totalPosts">-</h3>
                            <p>Posts Publicados</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🚀</div>
                        <div class="stat-info">
                            <h3 id="activeProjects">-</h3>
                            <p>Projetos Ativos</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Ações rápidas -->
            <section class="quick-actions">
                <h3>Ações Rápidas</h3>
                <div class="actions-grid">
                    <div class="action-card">
                        <div class="action-icon">🎮</div>
                        <h4>Novo Jogo</h4>
                        <p>Cadastre um novo projeto de jogo</p>
                        <a href="games.html" class="action-btn">Criar Jogo</a>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">📝</div>
                        <h4>Novo Post</h4>
                        <p>Escreva um devlog ou post</p>
                        <a href="posts.html" class="action-btn">Criar Post</a>
                    </div>

                    <div class="action-card">
                        <div class="action-icon">📊</div>
                        <h4>Ver Relatórios</h4>
                        <p>Analise seu progresso</p>
                        <button class="action-btn" disabled>Em Breve</button>
                    </div>
                </div>
            </section>

            <!-- Últimos jogos/posts -->
            <section class="recent-items">
                <div class="recent-section">
                    <h3>Últimos Jogos</h3>
                    <div id="recentGames" class="recent-list">
                        <div class="loading">Carregando...</div>
                    </div>
                </div>

                <div class="recent-section">
                    <h3>Últimos Posts</h3>
                    <div id="recentPosts" class="recent-list">
                        <div class="loading">Carregando...</div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <!-- Scripts -->
    <script src="js/api-config.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/dashboard.js"></script>
</body>

</html>