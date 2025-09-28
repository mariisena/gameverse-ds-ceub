// ../pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gamesAPI, postsAPI } from '../services/api';
import CreatePost from '../components/posts/CreatePost';
import CreateGame from '../components/games/CreateGame';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Buscar dados da API
      const gamesResponse = await gamesAPI.getAll();
      const postsResponse = await postsAPI.getAll();
      
      setGames(gamesResponse.data || []);
      setPosts(postsResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handlePostCreated = () => {
    setShowCreateForm(false);
    fetchDashboardData(); // Recarregar posts
  };

  const handleGameCreated = () => {
    setShowCreateForm(false);
    fetchDashboardData(); // Recarregar games
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-welcome">
          <h1>Olá, {user?.username || 'Gamer'}! 👋</h1>
          <p>Bem-vindo ao seu dashboard</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total de Jogos</h3>
          <p className="stat-number">{games.length}</p>
        </div>
        <div className="stat-card">
          <h3>Posts na Comunidade</h3>
          <p className="stat-number">{posts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Seu Nível</h3>
          <p className="stat-number">🎮 Iniciante</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs-header">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'games' ? 'active' : ''}`}
              onClick={() => setActiveTab('games')}
            >
              🎮 Jogos ({games.length})
            </button>
            <button 
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              💬 Posts ({posts.length})
            </button>
          </div>
          
          <button 
            className="create-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '❌ Cancelar' : '➕ Criar Novo'}
          </button>
        </div>

        {/* Formulário de Criação */}
        {showCreateForm && (
          <div className="create-form-section">
            {activeTab === 'posts' ? (
              <CreatePost 
                onPostCreated={handlePostCreated}
                games={games}
              />
            ) : (
              <CreateGame onGameCreated={handleGameCreated} />
            )}
          </div>
        )}

        <div className="tab-content">
          {activeTab === 'games' && (
            <div className="games-section">
              <h2>🎮 Jogos da Comunidade</h2>
              {games.length === 0 ? (
                <div className="no-data">
                  <p>Nenhum jogo cadastrado ainda.</p>
                  <p>Seja o primeiro a adicionar um jogo! 🚀</p>
                </div>
              ) : (
                <div className="games-grid">
                  {games.map(game => (
                    <div key={game.id} className="game-card">
                      <h3>{game.title}</h3>
                      <p>{game.description || 'Sem descrição'}</p>
                      <div className="game-meta">
                        {game.genre && <span>🎨 {game.genre}</span>}
                        {game.status && (
                          <span className={`status ${game.status.toLowerCase().replace(' ', '-')}`}>
                            {game.status}
                          </span>
                        )}
                      </div>
                      {game.owner && (
                        <div className="game-author">
                          Por: {game.owner.username || 'Usuário'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              <h2>💬 Posts da Comunidade</h2>
              {posts.length === 0 ? (
                <div className="no-data">
                  <p>Nenhum post ainda.</p>
                  <p>Seja o primeiro a compartilhar! ✨</p>
                </div>
              ) : (
                <div className="posts-list">
                  {posts.map(post => (
                    <div key={post.id} className="post-card">
                      <div className="post-header">
                        <h3>{post.title}</h3>
                        {post.postType && (
                          <span className={`post-type ${post.postType}`}>
                            {post.postType}
                          </span>
                        )}
                      </div>
                      <p className="post-content">{post.bodyContent}</p>
                      <div className="post-meta">
                        {post.author && (
                          <span>👤 Por: {post.author.username || 'Anônimo'}</span>
                        )}
                        {post.game && (
                          <span>🎮 {post.game.title}</span>
                        )}
                        {post.createdAt && (
                          <span>📅 {new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;