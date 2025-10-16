import React from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  return (
    <div className="login-card-container">
      <div className="login-card">
        <h2 className="card-title">Iniciar Sesión</h2>
        <p className="card-subtitle">Bienvenido de nuevo a nuestra plataforma</p>

        <form className="login-form">
          {/* Campo de Correo Electrónico */}
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="nombre@ejemplo.com"
              required 
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="••••••••"
              required 
            />
          </div>
          
          {/* Enlace de 'Olvidé mi contraseña' */}
          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón de Inicio de Sesión */}
          <button type="submit" className="login-button">
            INICIAR SESIÓN
          </button>
        </form>

        {/* Pie de página del formulario (registro) */}
        <div className="register-link">
            <p>
                ¿No tienes una cuenta? { " " }
                <Link to="/registro">
                    Regístrate aquí
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;