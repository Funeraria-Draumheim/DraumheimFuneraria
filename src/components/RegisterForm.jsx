import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterForm.css';
// Importaremos los estilos específicos en el siguiente paso

function RegisterForm() {
  return (
    <div className="register-card-container">
      <div className="register-card">
        
        {/* Cabecera y Subtítulo */}
        <h2 className="card-title">
          <span className="emoji-icon">💖</span> Crear una cuenta
        </h2>
        <p className="card-subtitle">
          Únete a Dreamheim para personalizar tus servicios y homenajes.
        </p>

        <form className="register-form">
          {/* Campo: Nombre Completo */}
          <div className="input-group">
            <input type="text" placeholder="Nombre Completo" required />
          </div>

          {/* Campo: Ingresar Email */}
          <div className="input-group">
            <input type="email" placeholder="Ingresar Email" required />
          </div>

          {/* Campo: Contraseña (Confirmar) */}
          <div className="input-group">
            <input type="password" placeholder="Confirmar" required />
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className="input-group">
            <input type="password" placeholder="Confirmar contraseña" required />
          </div>

          {/* Campo: Número Telefónico */}
          <div className="input-group">
            <input type="tel" placeholder="Número Telefónico" />
          </div>
          
          {/* Casilla de Términos y Política */}
          <div className="terms-checkbox-group">
            <input type="checkbox" id="terms" name="terms" required />
            <label htmlFor="terms">
              Acepto los <a href="#">Términos</a> y la <a href="#">Política de Privacidad</a>
            </label>
          </div>

          {/* Botón Principal: Crear Cuenta */}
          <button type="submit" className="main-button">
            Crear Cuenta
          </button>
        </form>
        
        {/* Separador */}
        <div className="form-separator">
          <span className="emoji-icon">🌸</span>
        </div>

        {/* Enlace de Inicio de Sesión */}

        
        <div className="login-link">
          <p>
            ¿Ya tienes una cuenta?
          </p>
          <br />
          <Link to="/login" className="secondary-button">
            Iniciar Sesion
          </Link>
        </div>

        <p className="footer-quote">
          "Juntos, honramos cada recuerdo con amor y dignidad"
        </p>

        <div className="footer-emojis">
          <span className="emoji-icon">🌷</span>
          <span className="emoji-icon">🎀</span>
          <span className="emoji-icon">🌷</span>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;