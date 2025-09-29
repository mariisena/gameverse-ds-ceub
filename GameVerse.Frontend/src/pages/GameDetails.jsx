import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gamesAPI, postsAPI } from '../services/api';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [gamePosts, setGamePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchGameData();
  }, [id]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const [gameResponse, postsResponse] = await Promise.all([
        gamesAPI.getById(id),
        postsAPI.getAll()
      ]);

      setGame(gameResponse.data);
      
      // Filtrar posts relacionados ao jogo
      const posts = postsResponse.data || [];
      const relatedPosts = posts.filter(post => post.gameId === id);
      setGamePosts(relatedPosts);
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="game-details-loading">
        <div className="loading-spinner"></div>
        <p>Carregando jogo...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-not-found">
        <h2>Jogo não encontrado</h2>
        <p>O jogo que você está procurando não existe ou foi removido.</p>
        <Link to="/games" className="cta-button">
          🎮 Ver Todos os Jogos
        </Link>
      </div>
    );
  }

  return (
    <div className="game-details-container">
      <div className="game-hero">
        <div className="game-cover">
          <div className="cover-placeholder">
            🎮
          </div>
        </div>
        <div className="game-info">
          <h1>{game.title}</h1>
          <p className="game-developer">
            Por: <Link to={`/profile/${game.owner?.username}`}>{game.owner?.username || 'Desconhecido'}</Link>
          </p>
          
          <div className="game-meta">
            {game.genre && (
              <div className="meta-item">
                <strong>Gênero:</strong>
                <span>{game.genre}</span>
              </div>
            )}
            {game.status && (
              <div className="meta-item">
                <strong>Status:</strong>
                <span className={`status ${game.status.toLowerCase().replace(' ', '-')}`}>
                  {game.status}
                </span>
              </div>
            )}
            <div className="meta-item">
              <strong>Posts:</strong>
              <span>{gamePosts.length}</span>
            </div>
          </div>

          <div className="game-actions">
            <button className="follow-game-btn">
              👁️ Seguir Jogo
            </button>
            <button className="share-game-btn">
              🔗 Compartilhar
            </button>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="game-tabs">
          <button 
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            📖 Sobre
          </button>
          <button 
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            💬 Posts ({gamePosts.length})
          </button>
          <button 
            className={`tab ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            👥 Comunidade
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'about' && (
            <div className="about-section">
              <h2>Sobre o Jogo</h2>
              <div className="game-description">
                {game.description ? (
                  <p>{game.description}</p>
                ) : (
                  <p className="no-description">
                    Este jogo ainda não tem uma descrição.
                  </p>
                )}
              </div>
              
              <div className="game-stats">
                <h3>Estatísticas</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <strong>{gamePosts.length}</strong>
                    <span>Posts</span>
                  </div>
                  <div className="stat-card">
                    <strong>0</strong>
                    <span>Seguidores</span>
                  </div>
                  <div className="stat-card">
                    <strong>0</strong>
                    <span>Avaliações</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-section">
              <div className="section-header">
                <h2>Posts sobre {game.title}</h2>
                <Link to="/dashboard" className="create-post-btn">
                  ✏️ Criar Post
                </Link>
              </div>
              
              {gamePosts.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhum post ainda</h3>
                  <p>Seja o primeiro a compartilhar sobre este jogo!</p>
                </div>
              ) : (
                <div className="posts-list">
                  {gamePosts.map(post => (
                    <div key={post.id} className="post-card game-post">
                      <div className="post-header">
                        <div className="post-author">
                          <div className="author-avatar">
                            {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="author-info">
                            <strong>{post.author?.username || 'Usuário'}</strong>
                            <span className="post-date">
                              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}
                            </span>
                          </div>
                        </div>
                        <span className={`post-type ${post.postType}`}>
                          {post.postType}
                        </span>
                      </div>
                      
                      <h3>{post.title}</h3>
                      <p className="post-content">
                        {post.bodyContent.length > 200 
                          ? `${post.bodyContent.substring(0, 200)}...` 
                          : post.bodyContent
                        }
                      </p>
                      
                      <div className="post-actions">
                        <button className="read-more-btn">
                          Ler mais
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="community-section">
              <div className="empty-state">
                <h3>Comunidade em desenvolvimento</h3>
                <p>Em breve você poderá ver os fãs deste jogo!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;