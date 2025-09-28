// components/posts/CreatePost.jsx
import React, { useState } from 'react';
import { postsAPI } from '../../services/api';

const CreatePost = ({ onPostCreated, games = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    bodyContent: '',
    gameId: '',
    postType: 'devlog'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Título do post é obrigatório');
      return false;
    }

    if (!formData.bodyContent.trim()) {
      setError('Conteúdo do post é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await postsAPI.create({
        ...formData,
        gameId: formData.gameId || null
      });
      
      setFormData({ 
        title: '', 
        bodyContent: '', 
        gameId: '', 
        postType: 'devlog' 
      });
      
      setSuccess('Post criado com sucesso!');
      
      // Callback para atualizar a lista
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      setError(
        error.response?.data?.message || 
        'Erro ao criar post. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h3>📝 Criar Novo Post</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Título do post"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <textarea
            name="bodyContent"
            placeholder="Conteúdo do post..."
            value={formData.bodyContent}
            onChange={handleChange}
            rows="4"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <select 
            name="gameId"
            value={formData.gameId}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Selecione um jogo (opcional)</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select 
            name="postType"
            value={formData.postType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="devlog">📝 Devlog</option>
            <option value="review">⭐ Review</option>
            <option value="news">📰 Notícia</option>
            <option value="discussion">💬 Discussão</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Publicando...' : '📤 Publicar Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
