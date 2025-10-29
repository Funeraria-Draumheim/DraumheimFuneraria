import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import FuneralTradicional from './components/FuneralTradicional';
import Cremacion from './components/Cremacion';
import PlanFunerario from './components/PlanFunerario';
import Urnas from './components/Urnas';
import ColeccionUrnas from './components/ColeccionUrnas';
import AdminPanel from './components/AdminPanel';
import Identificate from './components/identificate'; // Nuevo componente
import './App.css';

// Componente para el Panel Izquierdo (Imagen/Cita)
const LeftPanel = ({ imageUrl, quoteText }) => (
  <div className="left-panel">
    <div className="image-container">
      <img src={imageUrl} alt="Decoración funeraria" />
    </div>
    <div className="separator"></div>
    <p className="quote-container">
      {quoteText}
    </p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* RUTA PRINCIPAL (DEFAULT): CARGA EL IDENTIFICATE */}
      <Route path="/" element={<Identificate />} />

      {/* RUTA DEL HOME PAGE */}
      <Route path="/home" element={<HomePage />} />

      {/* RUTA DE INICIAR SESIÓN: "/login" */}
      <Route
        path="/login"
        element={
          <div className="login-page-container">
            <LeftPanel
              imageUrl="/funeral-flowers.png"
              quoteText="Cada recuerdo merece ser honrado."
            />
            <div className="right-panel">
              <LoginForm />
            </div>
          </div>
        }
      />

      {/* RUTA DE CREAR CUENTA: "/registro" */}
      <Route
        path="/registro"
        element={
          <div className="login-page-container">
            <LeftPanel
              imageUrl="/registro-flores.png"
              quoteText="Bienvenido a Draumheim. Un santuario de recuerdos, donde honramos cada vida con el tiempo."
            />
            <div className="right-panel">
              <RegisterForm />
            </div>
          </div>
        }
      />

      {/* RUTAS DE SERVICIOS ESPECÍFICOS */}
      <Route path="/servicios/tradicional" element={<FuneralTradicional />} />
      <Route path="/servicios/cremacion" element={<Cremacion />} />
      <Route path="/servicios/plan" element={<PlanFunerario />} />
      
      {/* NUEVAS RUTAS PARA URNAS */}
      <Route path="/servicios/urnas" element={<Urnas />} />
      <Route path="/coleccion-urnas" element={<ColeccionUrnas />} />

      {/* RUTA PARA TODOS LOS SERVICIOS (catch-all) */}
      <Route path="/servicios/:serviceName" element={<HomePage />} />

      {/* Otras rutas principales */}
      <Route path="/nosotros" element={<HomePage />} />
      <Route path="/testimonios" element={<HomePage />} />
      <Route path="/contacto" element={<HomePage />} />

      <Route path="/adminpanel" element={<AdminPanel />} />

      {/* RUTA 404 - Página no encontrada */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App;