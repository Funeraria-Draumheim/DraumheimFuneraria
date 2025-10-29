import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Urnas.css';

//URL de imagenes
const HEADER_BG = "../public/urnas-velas.png";
const MAIN_URN_IMAGE = "../public/urnas-lirios.png";
const DESIGN_URN_IMAGE = "../public/urna-grabado.png"
const NATURE_URN_IMAGE = "../public/urna-bio.png";
const JEWELRY_IMAGE = "../public/joya-ceniza.jpg";
const CTA_IMAGE = "../public/cta.png";

const PURPLE = '#A855F7';
const LIGHT_PURPLE = '#E9D5FF';
const BEIGE = '#F5F2EF';

//Navbar HomePage
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

//Footer
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
        <a href="#" className="footer-link">Contáctanos</a>
        <a href="#" className="footer-link">Preguntas Frecuentes</a>
        <a href="#" className="footer-link">Apoyo en la Pérdida</a>
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

//Cards de urnas
const OptionCard = ({ icon: Icon, title, description, imageUrl, buttonText, borderColor, secondaryDescription }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/coleccion-urnas');
  };

  return (
    <div className="option-card-urnas" style={{ borderTopColor: borderColor }}>
      <img
        src={imageUrl}
        alt={title}
        className="option-card-image-urnas"
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/CCCCCC/333333?text=Opcion"; }}
      />
      <div className="option-card-icon-container-urnas" style={{ backgroundColor: borderColor }}>
        <Icon className="option-card-icon-urnas" />
      </div>
      <h4 className="option-card-title-urnas">{title}</h4>
      <p className="option-card-description-urnas">{description}</p>
      <p className="option-card-secondary-description-urnas">{secondaryDescription}</p>
      <button onClick={handleButtonClick} className="option-card-button-urnas">
        {buttonText}
      </button>
    </div>
  );
};

const ReasonCard = ({ icon: Icon, title, description }) => (
  <div className="reason-card-urnas">
    <div className="reason-card-icon-container-urnas">
      <Icon className="reason-card-icon-urnas" />
    </div>
    <h4 className="reason-card-title-urnas">{title}</h4>
    <p className="reason-card-description-urnas">{description}</p>
  </div>
);

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

//Diseño de la pagina
const Urnas = () => {
  const navigate = useNavigate();

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

  const options = [
    {
      icon: Heart,
      title: "Urnas Clásicas",
      description: "Diseños tradicionales elaborados en madera, mármol o metal. Elegantes y atemporales, ideales para quienes desean honrar a sus seres queridos con un homenaje solemne.",
      secondaryDescription: "Las urnas clásicas reflejan tradición y respeto. Con acabados refinados y materiales duraderos, brindan un recuerdo eterno y digno.",
      imageUrl: DESIGN_URN_IMAGE,
      buttonText: "Ver Clásicos",
      borderColor: '#F59E0B'
    },
    {
      icon: Sun,
      title: "Urnas Modernas",
      description: "Diseños contemporáneos y artísticos con opciones minimalistas, ecológicas o biodegradables. Perfectos para quienes buscan algo personal y sostenible.",
      secondaryDescription: "Las urnas modernas encarnan la creatividad y la conexión con la naturaleza. Cada diseño ofrece un homenaje único, ya sea artístico, ecológico o contemporáneo.",
      imageUrl: NATURE_URN_IMAGE,
      buttonText: "Ver Modernas",
      borderColor: '#10B981'
    },
    {
      icon: Gem,
      title: "Joyas de Cenizas",
      description: "Joyería conmemorativa diseñada para conservar cerca una pequeña porción de las cenizas, ofreciendo intimidad y recuerdo a través de colgantes, anillos y pulseras.",
      secondaryDescription: "La joyería conmemorativa es una forma discreta y elegante de preservar la memoria. Cada pieza permite a las familias llevar una parte de su ser querido cerca del corazón.",
      imageUrl: JEWELRY_IMAGE,
      buttonText: "Ver Joyas",
      borderColor: PURPLE
    }
  ];

  const reasons = [
    {
      icon: Clock,
      title: "Materiales de alta calidad",
      description: "Mármol, madera, metal y materiales ecológicos de primera calidad, elaborados con meticulosa atención al detalle."
    },
    {
      icon: Anchor,
      title: "Diseños Exclusivos",
      description: "Diseños clásicos, modernos y artísticos que reflejan la personalidad y el espíritu únicos de tu ser querido."
    },
    {
      icon: Feather,
      title: "Personalización",
      description: "Grabados, colores personalizados y modelos únicos para crear un homenaje conmemorativo verdaderamente personal."
    }
  ];

  const handleExploreCollection = () => {
    navigate('/coleccion-urnas');
  };

  // Servicios del navbar
  const servicesData = [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },
    { name: "Urnas", path: "/servicios/urnas" }
  ];

  return (
    <div className="urnas-page-container">

      <Navbar
        services={servicesData}
        usuario={usuario}
        onEditarPerfil={openEditarPerfil}
        onCerrarSesion={cerrarSesion}
      />

      {/*Sección de Encabezado */}
      <div
        className="hero-section-urnas"
        style={{
          backgroundImage: `url(${HEADER_BG}), linear-gradient(to top, #333333, #555555)`,
        }}
      >
        <div className="hero-content-urnas">
          <h1 className="hero-title-urnas">
            Urnas para un homenaje eterno
          </h1>
          <p className="hero-subtitle-urnas">
            Cada urna es una guardiana del amor, la esperanza y la memoria.
          </p>
          <button onClick={handleExploreCollection} className="hero-button-urnas">
            Explorar colección
          </button>
        </div>
        <div className="hero-overlay-urnas"></div>
      </div>

      {/*Introducción */}
      <div className="intro-section-urnas">

        <div className="intro-container-urnas">

          {/* Texto de introducción */}
          <div className="intro-text-urnas">
            <p className="intro-quote-urnas">
              Muchas veces, el ritual del recuerdo.
            </p>
            <p className="intro-description-urnas">
              Las urnas son más que un receptáculo; son un <strong>espacio sagrado</strong> para guardar el recuerdo de quien se amó. Cada diseño encierra una historia, un tributo y la promesa de un reencuentro.
            </p>
            <p className="intro-description-urnas">
              Cada urna, cuidadosamente elaborada, sirve como un punto de anclaje para el proceso de <strong>sanación</strong> y el recuerdo del impacto duradero de una vida plena.
            </p>
          </div>

          <div className="intro-image-urnas">
            <img
              src={MAIN_URN_IMAGE}
              alt="Urna de Madera con Lirios"
              className="main-urn-image-urnas"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/F0E4D6/555555?text=Urna+Principal"; }}
            />
          </div>
        </div>
      </div>

      {/*Opciones destacadas*/}
      <div id="options" className="options-section-urnas">
        <div className="options-container-urnas">
          <h2 className="options-title-urnas">
            Nuestras Colecciones Sagradas
          </h2>
          <p className="options-subtitle-urnas">
            Descubre el homenaje perfecto para tu ser querido.
          </p>

          {/*Cards de Opciones*/}
          <div className="options-grid-urnas">
            {options.map(option => (
              <OptionCard
                key={option.title}
                icon={option.icon}
                title={option.title}
                description={option.description}
                secondaryDescription={option.secondaryDescription}
                imageUrl={option.imageUrl}
                buttonText={option.buttonText}
                borderColor={option.borderColor}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="quote-section-urnas">
        <div className="quote-container-urnas">
          <h3 className="quote-text-urnas">
            "Cada urna es un tributo eterno que lleva recuerdos, amor y conexión".
          </h3>
        </div>
      </div>

      <div className="reasons-section-urnas">
        <div className="reasons-container-urnas">
          <h2 className="reasons-title-urnas">
            ¿Por qué elegir nuestras urnas?
          </h2>

          <div className="reasons-grid-urnas">
            {reasons.map(reason => (
              <ReasonCard
                key={reason.title}
                icon={reason.icon}
                title={reason.title}
                description={reason.description}
              />
            ))}
          </div>
        </div>
      </div>

      <div id="contact-cta" className="cta-section-urnas">
        <div className="cta-container-urnas">
          <div className="cta-image-urnas">
            <img
              src={CTA_IMAGE}
              alt="Detalle de urna y flores"
              className="cta-img-urnas"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/D0C0D8/555555?text=CTA+Imagen"; }}
            />
          </div>
          <div className="cta-content-urnas">
            <h3 className="cta-title-urnas">
              Encuentra la urna que mejor refleje el amor y el recuerdo de tu ser querido
            </h3>
            <p className="cta-description-urnas">
              Explora nuestra colección completa y descubre el tributo perfecto que honra su legado eterno.
            </p>
            <button onClick={handleExploreCollection} className="cta-button-urnas">
              Explorar la colección completa
            </button>
          </div>
        </div>
      </div>

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

const Heart = ({ className }) => <div className={className}>❤️</div>;
const Sun = ({ className }) => <div className={className}>☀️</div>;
const Gem = ({ className }) => <div className={className}>💎</div>;
const Clock = ({ className }) => <div className={className}>⏰</div>;
const Anchor = ({ className }) => <div className={className}>⚓</div>;
const Feather = ({ className }) => <div className={className}>🪶</div>;

export default Urnas;