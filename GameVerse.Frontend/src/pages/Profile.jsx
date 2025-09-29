import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsAPI, gamesAPI } from '../services/api';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userGames, setUserGames] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('games');
  const [loading, setLoading] = useState(true);

  // Por enquanto, vamos mostrar o perfil do usuário logado
  // Depois podemos implementar busca por username
  useEffect(() => {
    fetchProfileData();
  }, [username]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [gamesResponse, postsResponse] = await Promise.all([
        gamesAPI.getAll(),
        postsAPI.getAll()
      ]);

      const games = gamesResponse.data || [];
      const posts = postsResponse.data || [];

      // Filtrar jogos e posts do usuário atual
      // Em uma implementação real, teríamos endpoints específicos
      const userGames = games.filter(game => game.owner?.id === currentUser.id);
      const userPosts = posts.filter(post => post.author?.id === currentUser.id);

      setProfileUser(currentUser);
      setUserGames(userGames);
      setUserPosts(userPosts);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-not-found">
        <h2>Perfil não encontrado</h2>
        <p>O usuário que você está procurando não existe.</p>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === profileUser.id;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileUser.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h1>{profileUser.username}</h1>
          <p className="profile-email">{profileUser.email}</p>
          {profileUser.fullName && (
            <p className="profile-fullname">{profileUser.fullName}</p>
          )}
          <div className="profile-stats">
            <div className="stat">
              <strong>{userGames.length}</strong>
              <span>Jogos</span>
            </div>
            <div className="stat">
              <strong>{userPosts.length}</strong>
              <span>Posts</span>
            </div>
            <div className="stat">
              <strong>0</strong>
              <span>Seguidores</span>
            </div>
            <div className="stat">
              <strong>0</strong>
              <span>Seguindo</span>
            </div>
          </div>
        </div>
        {isOwnProfile && (
          <button className="edit-profile-btn">
            ✏️ Editar Perfil
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Meus Jogos ({userGames.length})
          </button>
          <button 
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            💬 Meus Posts ({userPosts.length})
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            📊 Atividade
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'games' && (
            <div className="games-grid">
              {userGames.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhum jogo criado</h3>
                  <p>Comece adicionando seu primeiro jogo ao GameVerse!</p>
                  <Link to="/dashboard" className="cta-button">
                    🎮 Criar Primeiro Jogo
                  </Link>
                </div>
              ) : (
                userGames.map(game => (
                  <div key={game.id} className="game-card profile-game">
                    <h3>{game.title}</h3>
                    <p className="game-description">
                      {game.description || 'Sem descrição'}
                    </p>
                    <div className="game-meta">
                      {game.genre && <span>🎨 {game.genre}</span>}
                      {game.status && (
                        <span className={`status ${game.status.toLowerCase().replace(' ', '-')}`}>
                          {game.status}
                        </span>
                      )}
                    </div>
                    <div className="game-stats">
                      <span>📊 0 posts</span>
                      <span>👁️ 0 visualizações</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="posts-list">
              {userPosts.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhum post criado</h3>
                  <p>Compartilhe suas experiências com a comunidade!</p>
                </div>
              ) : (
                userPosts.map(post => (
                  <div key={post.id} className="post-card profile-post">
                    <div className="post-header">
                      <span className={`post-type ${post.postType}`}>
                        {post.postType}
                      </span>
                      <span className="post-date">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <h4>{post.title}</h4>
                    <p className="post-preview">
                      {post.bodyContent.length > 150 
                        ? `${post.bodyContent.substring(0, 150)}...` 
                        : post.bodyContent
                      }
                    </p>
                    <div className="post-stats">
                      <span>❤️ 0 curtidas</span>
                      <span>💬 0 comentários</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-timeline">
              <div className="empty-state">
                <h3>Em desenvolvimento</h3>
                <p>Timeline de atividade em breve!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;