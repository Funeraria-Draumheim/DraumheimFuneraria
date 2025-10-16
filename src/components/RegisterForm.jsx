import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    tel: '',
    ter: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.username.trim()) {
      setError('El nombre completo es requerido');
      return;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!formData.ter) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          tel: formData.tel,
          ter: formData.ter,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar');
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);
      // Redirigir al login después del registro exitoso
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al conectar con el servidor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-card-container">
      <div className="register-card">
        <h2 className="card-title">
          <span className="emoji-icon">💖</span> Crear una cuenta
        </h2>
        <p className="card-subtitle">
          Únete a Dreamheim para personalizar tus servicios y homenajes.
        </p>

        {error && <div className="error-message">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Nombre Completo"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Ingresar Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              name="tel"
              placeholder="Número Telefónico"
              value={formData.tel}
              onChange={handleChange}
            />
          </div>

          <div className="terms-checkbox-group">
            <input
              type="checkbox"
              id="terms"
              name="ter"
              checked={formData.ter}
              onChange={handleChange}
              required
            />
            <label htmlFor="terms">
              Acepto los <a href="#">Términos</a> y la <a href="#">Política de Privacidad</a>
            </label>
          </div>

          <button type="submit" className="main-button" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="form-separator">
          <span className="emoji-icon">🌸</span>
        </div>

        <div className="login-link">
          <p>¿Ya tienes una cuenta?</p>
          <br />
          <Link to="/login" className="secondary-button">
            Iniciar Sesión
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