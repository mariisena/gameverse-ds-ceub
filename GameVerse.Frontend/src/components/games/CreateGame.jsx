// components/games/CreateGame.jsx
import React, { useState } from 'react';
import { gamesAPI } from '../../services/api';

const CreateGame = ({ onGameCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    status: 'Em desenvolvimento'
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
      setError('Título do jogo é obrigatório');
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
      await gamesAPI.create(formData);
      
      setFormData({ 
        title: '', 
        description: '', 
        genre: '', 
        status: 'Em desenvolvimento' 
      });
      
      setSuccess('Jogo criado com sucesso!');
      
      // Callback para atualizar a lista
      if (onGameCreated) {
        onGameCreated();
      }
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      setError(
        error.response?.data?.message || 
        'Erro ao criar jogo. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-game">
      <h3>🎮 Adicionar Novo Jogo</h3>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="title"
            placeholder="Título do jogo"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <textarea
            name="description"
            placeholder="Descrição do jogo"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="genre"
            placeholder="Gênero (ex: Ação, RPG, FPS)"
            value={formData.genre}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Em desenvolvimento">🛠️ Em desenvolvimento</option>
            <option value="Lançado">🎉 Lançado</option>
            <option value="Em beta">🔧 Em beta</option>
            <option value="Cancelado">❌ Cancelado</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : '➕ Adicionar Jogo'}
        </button>
      </form>
    </div>
  );
};

export default CreateGame;
