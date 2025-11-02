import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      console.log('Usuario logueado:', data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

      //Dependiendo del rol
      if (data.user.rol === 'admin' || data.user.rol === 'empleado') {
        navigate('/admin-panel');
      } else {
        navigate('/home');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <h2 className="card-title">Iniciar Sesión</h2>
        <p className="card-subtitle">Bienvenido de nuevo a nuestra plataforma</p>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({
                ...formData,
                email: e.target.value
              })}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'CARGANDO...' : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;