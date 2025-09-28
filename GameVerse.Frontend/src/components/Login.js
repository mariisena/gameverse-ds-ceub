// components/Login.js
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Pode ser email ou username
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const message = location.state?.message;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login no GameVerse</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email ou Nome de Usuário:</label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            placeholder="Email ou nome de usuário"
          />
        </div>
        
        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Sua senha"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      
      <p className="auth-link">
        Não tem conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
};

export default Login;