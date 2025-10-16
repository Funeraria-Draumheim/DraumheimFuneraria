import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Urnas.css';

// --- Assets (URLs de Imágenes simuladas) ---
const HEADER_BG = "https://placehold.co/1920x600/594848/FAD0A8?text=Urna+y+Velas+en+Fondo+Oscuro";
const MAIN_URN_IMAGE = "https://placehold.co/400x300/F0E4D6/555555?text=Urna+de+Madera+con+Lirios";
const DESIGN_URN_IMAGE = "https://placehold.co/300x200/E8D9C8/333333?text=Urna+con+Grabado";
const NATURE_URN_IMAGE = "https://placehold.co/300x200/D0E0D0/333333?text=Urna+Biodegradable+de+Madera";
const JEWELRY_IMAGE = "https://placehold.co/300x200/E5DDF5/333333?text=Colgante+de+Cenizas";
const CTA_IMAGE = "https://placehold.co/300x300/D0C0D8/555555?text=Detalle+de+Urna+y+Flores";

const PURPLE = '#A855F7';
const LIGHT_PURPLE = '#E9D5FF';
const BEIGE = '#F5F2EF';

// Navbar del HomePage (Copiado directamente)
const Navbar = ({ services }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
  };

  // Servicios para el dropdown (los mismos que en HomePage)
  const servicesData = [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },
    { name: "Plan Funerario", path: "/servicios/plan" },
    { name: "Urnas", path: "/servicios/urnas" }
  ];

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
            onClick={handleDropdownToggle}
          >
            Servicios <span className="dropdown-arrow">▼</span>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {servicesData.map((service) => (
                  <Link
                    key={service.path}
                    to={service.path}
                    className="dropdown-item"
                    onClick={handleDropdownItemClick}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/testimonios" className="nav-item">Testimonios</Link>
          <Link to="/contacto" className="nav-item">Contacto</Link>
        </div>

        <Link to="/login">
          <button className="nav-login-button">
            Iniciar Sesión
          </button>
        </Link>
      </div>
    </nav>
  );
};

// Footer del HomePage (Copiado directamente)
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
        <Link to="/servicios/plan" className="footer-link">Plan Funerario</Link>
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

// Card para las opciones de urnas
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
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200/CCCCCC/333333?text=Opcion"; }}
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

// Card de las 3 razones por las que elegir Draumheim
const ReasonCard = ({ icon: Icon, title, description }) => (
    <div className="reason-card-urnas">
        <div className="reason-card-icon-container-urnas">
            <Icon className="reason-card-icon-urnas" />
        </div>
        <h4 className="reason-card-title-urnas">{title}</h4>
        <p className="reason-card-description-urnas">{description}</p>
    </div>
);

// Componente Principal de la Página: Urnas y Joyas
const Urnas = () => {
  const navigate = useNavigate();
    
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

  // Servicios para el navbar (los mismos que en HomePage)
  const servicesData = [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },
    { name: "Plan Funerario", path: "/servicios/plan" },
    { name: "Urnas", path: "/servicios/urnas" },
    { name: "Página para Mascotas", path: "/servicios/mascotas" }
  ];

  return (
    <div className="urnas-page-container">
      
      <Navbar services={servicesData} />
      
      {/* 1. Sección de Encabezado/Héroe */}
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

      {/* 2. Introducción y Selección Principal */}
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
            
            {/* Imagen lateral */}
            <div className="intro-image-urnas">
                <img 
                    src={MAIN_URN_IMAGE} 
                    alt="Urna de Madera con Lirios" 
                    className="main-urn-image-urnas"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/F0E4D6/555555?text=Urna+Principal"; }}
                />
            </div>
        </div>
      </div>

      {/* 3. Sección de Opciones destacadas */}
      <div id="options" className="options-section-urnas">
        <div className="options-container-urnas">
             <h2 className="options-title-urnas">
                Nuestras Colecciones Sagradas
            </h2>
            <p className="options-subtitle-urnas">
                Descubre el homenaje perfecto para tu ser querido.
            </p>
            
            {/* Cards de Opciones */}
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
      
      {/* 4. Frase Central */}
      <div className="quote-section-urnas">
        <div className="quote-container-urnas">
            <h3 className="quote-text-urnas">
                "Cada urna es un tributo eterno que lleva recuerdos, amor y conexión".
            </h3>
        </div>
      </div>

      {/* 5. Por qué elegir Draumheim */}
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
      
      {/* 6. CTA de Contacto Final */}
      <div id="contact-cta" className="cta-section-urnas">
        <div className="cta-container-urnas">
            <div className="cta-image-urnas">
                <img 
                    src={CTA_IMAGE} 
                    alt="Detalle de urna y flores" 
                    className="cta-img-urnas"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x300/D0C0D8/555555?text=CTA+Imagen"; }}
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

    </div>
  );
};

// Importaciones de iconos (agregar al inicio del archivo si es necesario)
const Heart = ({ className }) => <div className={className}>❤️</div>;
const Sun = ({ className }) => <div className={className}>☀️</div>;
const Gem = ({ className }) => <div className={className}>💎</div>;
const Clock = ({ className }) => <div className={className}>⏰</div>;
const Anchor = ({ className }) => <div className={className}>⚓</div>;
const Feather = ({ className }) => <div className={className}>🪶</div>;

export default Urnas;