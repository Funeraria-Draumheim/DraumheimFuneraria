import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ColeccionUrnas.css';

//servicios del navbar
const homeData = {
  services: [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },
    { name: "Urnas", path: "/servicios/urnas" }
  ],
};

const Navbar = ({ services, usuario, onEditarPerfil, onCerrarSesion }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCerrarSesion = () => {
    onCerrarSesion();
    setIsUserDropdownOpen(false);
  };

  const handleEditarPerfil = () => {
    onEditarPerfil();
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="nav-logo">Draumheim</Link>

        <div className="nav-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/nosotros" className="nav-item">Nosotros</Link>

          <div
            className="nav-item nav-dropdown"
            ref={dropdownRef}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Servicios <span className="dropdown-arrow">▼</span>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {services.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-section">
        <h4>Draumheim</h4>
        <p>Brindando servicios funerarios con compasión y dignidad.</p>
        <p>© 2025 Draumheim. Todos los derechos reservados.</p>
      </div>
      <div className="footer-section">
        <h4>Servicios</h4>
        <Link to="/servicios/tradicional" className="footer-link">Funerales</Link>
        <Link to="/servicios/cremacion" className="footer-link">Cremaciones</Link>
        <Link to="/servicios/urnas" className="footer-link">Urnas</Link>
      </div>
      <div className="footer-section">
        <h4>Soporte</h4>
        <a href="#">Contáctanos</a>
        <a href="#">Preguntas Frecuentes</a>
        <a href="#">Apoyo en la Pérdida</a>
      </div>
      <div className="footer-section footer-contact">
        <h4>Contáctanos</h4>
        <p><span className="icon">📞</span> 833-582-9995</p>
        <p><span className="icon">📧</span> info@draumheim.com</p>
        <p><span className="icon">📍</span> Ubicaciones</p>
      </div>
    </div>
  </footer>
);

//Modal editar perfil
const EditarPerfilModal = ({ isOpen, onClose, usuario, onGuardar }) => {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  //Cargar los datos para el modal edit
  useEffect(() => {
    if (usuario && isOpen) {
      setFormData({
        nombre: usuario.nombre_completo || '',
        email: usuario.email || '',
        telefono: usuario.telefono || '',
        password: ''
      });
      setMensaje('');
    }
  }, [usuario, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      await onGuardar({
        id: usuario.id,
        ...formData
      });
      setMensaje('¡Perfil actualizado correctamente!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      setMensaje('Error al actualizar el perfil');
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <h2>Editar Perfil</h2>
          <p>Actualiza tu información personal</p>
        </div>

        <form className="asesoria-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              type="text"
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Tu número telefónico"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Nueva Contraseña (opcional)</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>

          {mensaje && (
            <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'exito'}`}>
              {mensaje}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ColeccionUrnas = () => {
  const [selectedUrna, setSelectedUrna] = useState(null);

  const [usuario, setUsuario] = useState(null);
  const [isEditarPerfilOpen, setIsEditarPerfilOpen] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado && usuarioGuardado !== 'undefined') {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        localStorage.removeItem('usuario');
      }
    }
  }, []);

  const guardarPerfil = async (datosPerfil) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/editar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosPerfil),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }

      const data = await response.json();

      const nuevoUsuario = { ...usuario, ...data.usuario };
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
      setUsuario(nuevoUsuario);

      return data;
    } catch (error) {
      throw error;
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    window.location.reload();
  };

  const openEditarPerfil = () => setIsEditarPerfilOpen(true);
  const closeEditarPerfil = () => setIsEditarPerfilOpen(false);

  const urnasData = {
    tradicionales: [
      { nombre: "Urna Clásica de Nogal", material: "Madera de nogal", precio: "S/480", descripcion: "Diseño tradicional y elegante con acabados brillantes.", img: "../public/urna-nogal.jpg" },
      { nombre: "Urna Mármol Blanco", material: "Mármol italiano", precio: "S/780", descripcion: "Acabado pulido con grabado artesanal.", img: "../public/urna-marmol.jpg" },
      { nombre: "Urna Clásica de Roble", material: "Roble sólido", precio: "S/550", descripcion: "Urna robusta con barniz satinado.", img: "../public/urna-roble.jpg" },
      { nombre: "Urna Ángeles Dorados", material: "Metal con baño dorado", precio: "S/620", descripcion: "Detalles dorados en relieve con motivos angelicales.", img: "../public/urna-dorada.jpg" },
      { nombre: "Urna Cerámica Floral", material: "Cerámica esmaltada", precio: "S/410", descripcion: "Decorada a mano con flores pintadas.", img: "../public/urna-ceramica.jpg" },
      { nombre: "Urna Piedra Natural", material: "Piedra tallada", precio: "S/670", descripcion: "Tallada a mano con textura rugosa y natural.", img: "../public/urna-piedra.jpg" },
    ],
    modernas: [
      { nombre: "Urna Minimalista Blanca", material: "Resina ecológica", precio: "S/520", descripcion: "Diseño limpio y contemporáneo de líneas suaves.", img: "../public/urna-blanca.jpg" },
      { nombre: "Urna Geométrica Negra", material: "Metal mate", precio: "S/680", descripcion: "Estilo moderno con forma poligonal.", img: "../public/urna-negra.jpg" },
      { nombre: "Urna Cristal Transparente", material: "Vidrio templado", precio: "S/740", descripcion: "Permite ver la delicada urna interna de porcelana.", img: "../public/urna-cristal.jpg" },
      { nombre: "Urna Abstracta Azul", material: "Cerámica artesanal", precio: "S/560", descripcion: "Tonos azules que evocan serenidad y cielo.", img: "../public/urna-azul.jpg" },
      { nombre: "Urna Eco Verde", material: "Fibra biodegradable", precio: "S/490", descripcion: "Urna ecológica que puede plantarse con semillas.", img: "../public/urna-eco.jpg" },
      { nombre: "Urna de Hormigón", material: "Cemento pulido", precio: "S/600", descripcion: "Diseño industrial para espacios contemporáneos.", img: "../public/urna-hormigon.jpg" },
    ],
    joyas: [
      { nombre: "Colgante Corazón Plateado", material: "Plata 925", precio: "S/280", descripcion: "Permite conservar una pequeña porción de cenizas.", img: "../public/joyas.png" },
      { nombre: "Colgante Alas Doradas", material: "Acero con baño dorado", precio: "S/320", descripcion: "Símbolo de libertad y recuerdo eterno.", img: "../public/alas.webp" },
      { nombre: "Anillo Memorial", material: "Acero inoxidable", precio: "S/260", descripcion: "Diseño sobrio con compartimento interno.", img: "../public/anillo.webp" },
      { nombre: "Pulsera Infinito", material: "Cuero y acero", precio: "S/230", descripcion: "Símbolo de unión eterna.", img: "../public/pulsera.jpg" },
      { nombre: "Colgante de Cristal Azul", material: "Cristal templado", precio: "S/310", descripcion: "Transmite paz y serenidad.", img: "../public/colgante.jpg" },
      { nombre: "Medallón Grabado", material: "Plata y vidrio", precio: "S/350", descripcion: "Permite grabar nombre y fecha.", img: "../public/medallon.jpg" },
    ]
  };

  return (
    <div className="urnas-page-container">
      {/* Navbar Agregado */}
      <Navbar
        services={homeData.services}
        usuario={usuario}
        onEditarPerfil={openEditarPerfil}
        onCerrarSesion={cerrarSesion}
      />

      <main className="coleccion-container">
        <section className="categoria">
          <h2>Urnas Tradicionales</h2>
          <div className="grid-urnas">
            {urnasData.tradicionales.map((u, i) => (
              <div key={i} className="urna-card" onClick={() => setSelectedUrna(u)}>
                <div className="urna-card-inner">
                  <div className="urna-card-front">
                    <img src={u.img} alt={u.nombre} />
                    <p>{u.nombre}</p>
                  </div>
                  <div className="urna-card-back">
                    <h4>{u.nombre}</h4>
                    <p>{u.descripcion}</p>
                    <p><strong>Material:</strong> {u.material}</p>
                    <p><strong>Precio:</strong> {u.precio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="categoria">
          <h2>Urnas Modernas</h2>
          <div className="grid-urnas">
            {urnasData.modernas.map((u, i) => (
              <div key={i} className="urna-card" onClick={() => setSelectedUrna(u)}>
                <div className="urna-card-inner">
                  <div className="urna-card-front">
                    <img src={u.img} alt={u.nombre} />
                    <p>{u.nombre}</p>
                  </div>
                  <div className="urna-card-back">
                    <h4>{u.nombre}</h4>
                    <p>{u.descripcion}</p>
                    <p><strong>Material:</strong> {u.material}</p>
                    <p><strong>Precio:</strong> {u.precio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="categoria">
          <h2>Joyas de Cenizas</h2>
          <div className="grid-urnas">
            {urnasData.joyas.map((u, i) => (
              <div key={i} className="urna-card" onClick={() => setSelectedUrna(u)}>
                <div className="urna-card-inner">
                  <div className="urna-card-front">
                    <img src={u.img} alt={u.nombre} />
                    <p>{u.nombre}</p>
                  </div>
                  <div className="urna-card-back">
                    <h4>{u.nombre}</h4>
                    <p>{u.descripcion}</p>
                    <p><strong>Material:</strong> {u.material}</p>
                    <p><strong>Precio:</strong> {u.precio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {selectedUrna && (
        <div className="modal-overlay" onClick={() => setSelectedUrna(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-left">
              <img src={selectedUrna.img} alt={selectedUrna.nombre} />
            </div>
            <div className="modal-right">
              <h3>{selectedUrna.nombre}</h3>
              <p>{selectedUrna.descripcion}</p>
              <p><strong>Material:</strong> {selectedUrna.material}</p>
              <p><strong>Precio:</strong> {selectedUrna.precio}</p>
              <button className="asesoria-btn">Solicitar Asesoría</button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <EditarPerfilModal
        isOpen={isEditarPerfilOpen}
        onClose={closeEditarPerfil}
        usuario={usuario}
        onGuardar={guardarPerfil}
      />

    </div>
  );
};

export default ColeccionUrnas;