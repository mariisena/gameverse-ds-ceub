// ../pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Home.css'


const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🎮 GameVerse</h1>
        <p className="home-subtitle">Seu universo de games favorito!</p>
        
        {user ? (
          <div className="home-buttons">
            <Link to="/dashboard" className="cta-button">Ir para Dashboard</Link>
          </div>
        ) : (
          <div className="home-buttons">
            <Link to="/login" className="cta-button primary">Entrar</Link>
            <Link to="/register" className="cta-button secondary">Cadastrar</Link>
          </div>
        )}
      </header>

      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Descubra Jogos</h3>
          <p>Explore uma vasta coleção de jogos e encontre seus próximos favoritos</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Compartilhe Experiências</h3>
          <p>Crie posts, reviews e interaja com outros gamers</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Comunidade Ativa</h3>
          <p>Conecte-se com outros jogadores e compartilhe dicas</p>
        </div>
      </section>

      <section className="home-about">
        <h2>Sobre o GameVerse</h2>
        <p>
          GameVerse é a plataforma definitiva para gamers que querem descobrir novos jogos, 
          compartilhar experiências e conectar-se com uma comunidade apaixonada.
        </p>
      </section>
    </div>
  );
};

export default Home;