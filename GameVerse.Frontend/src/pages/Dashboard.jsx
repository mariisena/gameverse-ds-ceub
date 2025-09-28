import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gamesAPI, postsAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [games, setGames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');

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
          <p className="stat-number">Iniciante</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Jogos
          </button>
          <button 
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            💬 Posts
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'games' && (
            <div className="games-section">
              <h2>Jogos Disponíveis</h2>
              {games.length === 0 ? (
                <p className="no-data">Nenhum jogo cadastrado ainda.</p>
              ) : (
                <div className="games-grid">
                  {games.map(game => (
                    <div key={game.id} className="game-card">
                      <h3>{game.title}</h3>
                      <p>{game.description}</p>
                      <div className="game-meta">
                        <span>⭐ {game.rating || 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              <h2>Posts da Comunidade</h2>
              {posts.length === 0 ? (
                <p className="no-data">Nenhum post ainda. Seja o primeiro a postar!</p>
              ) : (
                <div className="posts-list">
                  {posts.map(post => (
                    <div key={post.id} className="post-card">
                      <h3>{post.title}</h3>
                      <p>{post.content}</p>
                      <div className="post-meta">
                        <span>Por: {post.author?.username || 'Anônimo'}</span>
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