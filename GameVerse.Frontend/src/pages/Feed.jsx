import React, { useState, useEffect } from 'react';
import { postsAPI, gamesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      setLoading(true);
      const [postsResponse, gamesResponse] = await Promise.all([
        postsAPI.getAll(),
        gamesAPI.getAll()
      ]);
      
      setPosts(postsResponse.data || []);
      setGames(gamesResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      // Simular like - você pode implementar a API depois
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.postType === activeFilter;
  });

  const getGameInfo = (gameId) => {
    return games.find(game => game.id === gameId);
  };

  if (loading) {
    return (
      <div className="feed-loading">
        <div className="loading-spinner"></div>
        <p>Carregando feed...</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h1>📰 Feed da Comunidade</h1>
        <p>Fique por dentro das novidades do GameVerse</p>
      </div>

      <div className="feed-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          🏠 Todos
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'devlog' ? 'active' : ''}`}
          onClick={() => setActiveFilter('devlog')}
        >
          📝 Devlogs
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'review' ? 'active' : ''}`}
          onClick={() => setActiveFilter('review')}
        >
          ⭐ Reviews
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'news' ? 'active' : ''}`}
          onClick={() => setActiveFilter('news')}
        >
          📰 Notícias
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'discussion' ? 'active' : ''}`}
          onClick={() => setActiveFilter('discussion')}
        >
          💬 Discussões
        </button>
      </div>

      <div className="feed-content">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            <h3>Nenhum post encontrado</h3>
            <p>Seja o primeiro a compartilhar no feed! 🚀</p>
          </div>
        ) : (
          <div className="posts-timeline">
            {filteredPosts.map(post => {
              const gameInfo = post.gameId ? getGameInfo(post.gameId) : null;
              
              return (
                <article key={post.id} className="post-card feed-post">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="author-info">
                        <strong>{post.author?.username || 'Usuário'}</strong>
                        <span className="post-date">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                        </span>
                      </div>
                    </div>
                    <span className={`post-type-badge ${post.postType}`}>
                      {post.postType === 'devlog' && '📝 Devlog'}
                      {post.postType === 'review' && '⭐ Review'}
                      {post.postType === 'news' && '📰 Notícia'}
                      {post.postType === 'discussion' && '💬 Discussão'}
                    </span>
                  </div>

                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-body">{post.bodyContent}</p>
                    
                    {gameInfo && (
                      <div className="post-game">
                        <span>🎮 Relacionado a:</span>
                        <Link to={`/games/${gameInfo.id}`} className="game-link">
                          {gameInfo.title}
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="post-actions">
                    <button 
                      className={`like-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
                      onClick={() => handleLike(post.id)}
                    >
                      {likedPosts.has(post.id) ? '❤️' : '🤍'} 
                      Curtir
                    </button>
                    <button className="comment-btn">
                      💬 Comentar
                    </button>
                    <button className="share-btn">
                      🔗 Compartilhar
                    </button>
                  </div>

                  <div className="post-stats">
                    <span>{likedPosts.has(post.id) ? '1 curtida' : '0 curtidas'}</span>
                    <span>•</span>
                    <span>0 comentários</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;