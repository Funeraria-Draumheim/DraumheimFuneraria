import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Identificate.css';

const Identificate = () => {
  const navigate = useNavigate();

  // Efecto para aplicar el fondo al body cuando el componente se monta
  useEffect(() => {
    // Añadir clase al body
    document.body.classList.add('identificate-page');
    
    // Limpiar la clase cuando el componente se desmonte
    return () => {
      document.body.classList.remove('identificate-page');
    };
  }, []);

  const handleVisitanteClick = () => {
    navigate('/home');
  };

  const handleAdministradorClick = () => {
    navigate('/login');
  };

  return (
    <div className="identificate-container">
      <div className="identificate-content">
        <div className="welcome-header">
          <h1 className="welcome-title">Bienvenido a Draumheim</h1>
          <p className="welcome-subtitle">Un santuario de recuerdos, donde honramos cada vida con el tiempo</p>
          <div className="divider"></div>
        </div>

        <div className="cards-container">
          {/* Carta Visitante */}
          <div className="identity-card visitante-card" onClick={handleVisitanteClick}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="card-title">Visitante</h3>
            <p className="card-description">
              Explora nuestros servicios y conoce más sobre cómo podemos ayudarte en estos momentos difíciles
            </p>
            <div className="card-features">
              <span className="feature">✓ Ver servicios</span>
              <span className="feature">✓ Explorar opciones</span>
              <span className="feature">✓ Conocer más</span>
            </div>
            <button className="card-button">
              Entrar como Visitante
              <svg className="button-icon" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Carta Administrador */}
          <div className="identity-card administrador-card" onClick={handleAdministradorClick}>
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2.905 20.2491C3.827 18.6531 5.153 17.3271 6.749 16.4051C8.345 15.4831 10.147 15 12 15C13.853 15 15.655 15.4831 17.251 16.4051C18.847 17.3271 20.173 18.6531 21.095 20.2491" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M19 8V6M19 6V4M19 6H21M19 6H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="card-title">Administrador</h3>
            <p className="card-description">
              Accede al panel de administración para gestionar servicios, usuarios y contenido del sistema
            </p>
            <div className="card-features">
              <span className="feature">✓ Gestionar servicios</span>
              <span className="feature">✓ Administrar usuarios</span>
              <span className="feature">✓ Panel de control</span>
            </div>
            <button className="card-button">
              Acceder como Administrador
              <svg className="button-icon" viewBox="0 0 24 24" fill="none">
                <path d="M10 6L16 12L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Identificate;