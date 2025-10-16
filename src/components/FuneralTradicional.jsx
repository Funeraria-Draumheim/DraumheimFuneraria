import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FuneralTradicional.css';

// Assets
const HEADER_IMAGE = "https://placehold.co/1200x600/D0F0C0/333333?text=Flores+y+Lirios";
const ABOUT_IMAGE = "https://placehold.co/400x300/F0F0F0/333333?text=Interior+de+Capilla+con+Flores";
const OFFERING_IMAGE_1 = "https://placehold.co/300x200/F0F0F0/333333?text=Arreglos+Florales";
const OFFERING_IMAGE_2 = "https://placehold.co/300x200/F0F0F0/333333?text=Velas+Encendidas";
const OFFERING_IMAGE_3 = "https://placehold.co/300x200/F0F0F0/333333?text=Sala+de+Ceremonia";

// Datos para el Navbar
const servicesData = [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },
    { name: "Plan Funerario", path: "/servicios/plan" },
    { name: "Urnas", path: "/servicios/urnas" }
];

// COMPONENTE NAVBAR
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
                                {services.map((service) => (
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

// COMPONENTE FOOTER
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
                <Link to="/contacto" className="footer-link">Contáctanos</Link>
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

// COMPONENTES REUTILIZABLES
const FeatureIcon = ({ emoji, title, description }) => (
    <div className="feature-icon">
        <div className="feature-icon-container">
            <span className="feature-emoji">{emoji}</span>
        </div>
        <h3 className="feature-icon-title">{title}</h3>
        <p className="feature-icon-description">{description}</p>
    </div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="faq-item" onClick={() => setIsOpen(!isOpen)}>
            <div className="faq-question">
                <span>{question}</span>
                <span className={`faq-chevron ${isOpen ? 'open' : ''}`}>▼</span>
            </div>
            {isOpen && (
                <div className="faq-answer">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

// COMPONENTE PRINCIPAL
const FuneralTradicional = () => {
    return (
        <div className="funeral-tradicional-page">
            
            {/* SECCIÓN NAVBAR */}
            <Navbar services={servicesData} />

            {/* SECCIÓN HERO */}
            <div
                id="home"
                className="hero-section"
                style={{
                    backgroundImage: `url(${HEADER_IMAGE})`
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-title">
                        Servicio funerario tradicional
                    </h1>
                    <p className="hero-subtitle">
                        Apoyar a las familias con calidez humana y brindar un servicio digno que honre la memoria de un ser querido.
                    </p>
                    <div className="hero-features">
                        <span className="hero-feature">
                            <span className="feature-bullet">•</span> Atención compasiva
                        </span>
                        <span className="hero-feature">
                            <span className="feature-bullet">•</span> Ceremonias significativas
                        </span>
                        <span className="hero-feature">
                            <span className="feature-bullet">•</span> Recuerdos duraderos
                        </span>
                    </div>
                </div>
            </div>

            {/* SECCIÓN ACERCA DE */}
            <div id="about" className="about-section">
                <h2 className="about-title">Acerca de Draumheim</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p className="about-paragraph">
                            Durante <strong>más de tres décadas</strong>, Draumheim ha sido un ejemplo de compasión y dignidad en nuestra comunidad. Entendemos que despedirse nunca es fácil, por eso nos dedicamos a crear homenajes significativos que celebran la vida y brindan consuelo en momentos difíciles.
                        </p>
                        <p className="about-paragraph">
                            Nuestro compromiso es con la <strong>excelencia y el respeto total</strong> por la voluntad de la familia. Confíe en nosotros para guiarle a través de este proceso con serenidad y profesionalismo.
                        </p>
                        <Link to="/nosotros">
                            <button className="about-button">
                                Saber Más de Nuestra Historia
                            </button>
                        </Link>
                    </div>
                    <div className="about-image-container">
                        <img
                            src={ABOUT_IMAGE}
                            alt="Interior de la capilla de Draumheim"
                            className="about-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/F0F0F0/333333?text=Imagen+de+Capilla"; }}
                        />
                    </div>
                </div>
            </div>

            {/* SECCIÓN PROCESO */}
            <div className="process-section">
                <div className="process-container">
                    <h2 className="process-title">Nuestro proceso de servicio</h2>
                    <p className="process-subtitle">
                        Lo guiamos en cada paso con compasión y cuidado.
                    </p>

                    <div className="features-grid">
                        <FeatureIcon
                            emoji="📍"
                            title="Traslado y Preparación"
                            description="Gestión inmediata del traslado del cuerpo y su preparación con dignidad y respeto."
                        />
                        <FeatureIcon
                            emoji="📋"
                            title="Asesoría Documental"
                            description="Asesoría personalizada y gestión de todos los documentos y permisos necesarios."
                        />
                        <FeatureIcon
                            emoji="🕯️"
                            title="Servicios de Velatorio"
                            description="Disponibilidad de salas y coordinación de servicios para el velatorio."
                        />
                        <FeatureIcon
                            emoji="💖"
                            title="Ceremonia Final"
                            description="Organización de la ceremonia de despedida según la tradición o deseos familiares."
                        />
                    </div>
                </div>
            </div>

            {/* SECCIÓN ELEMENTOS */}
            <div className="elements-section">
                <h2 className="elements-title">Elementos de ceremonia</h2>
                <p className="elements-subtitle">
                    Hermosos elementos que crean momentos significativos.
                </p>

                <div className="elements-grid">
                    <div className="element-card">
                        <img
                            src={OFFERING_IMAGE_1}
                            alt="Arreglos Florales"
                            className="element-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/F0F0F0/333333?text=Flores"; }}
                        />
                        <div className="element-content">
                            <h4 className="element-name">Arreglos Florales</h4>
                        </div>
                    </div>

                    <div className="element-card">
                        <img
                            src={OFFERING_IMAGE_2}
                            alt="Candelabros y Velas"
                            className="element-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/F0F0F0/333333?text=Velas"; }}
                        />
                        <div className="element-content">
                            <h4 className="element-name">Candelabros y Velas</h4>
                        </div>
                    </div>

                    <div className="element-card">
                        <img
                            src={OFFERING_IMAGE_3}
                            alt="Salas de Velatorio"
                            className="element-image"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/F0F0F0/333333?text=Salas"; }}
                        />
                        <div className="element-content">
                            <h4 className="element-name">Salas de Velatorio</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN FAQ */}
            <div id="faq" className="faq-section">
                <div className="faq-container">
                    <h2 className="faq-title">Preguntas frecuentes</h2>
                    <p className="faq-subtitle">
                        Resuelve tus dudas sobre nuestros servicios funerarios tradicionales.
                    </p>

                    <div className="faq-list">
                        <FAQItem
                            question="¿Qué incluye un servicio funerario tradicional?"
                            answer="Generalmente incluye el traslado, la preparación del cuerpo, el uso de nuestra sala de velatorio, el ataúd seleccionado, la gestión documental, y la ceremonia de despedida."
                        />
                        <FAQItem
                            question="¿Cuánto tiempo dura el proceso de planificación?"
                            answer="El proceso de planificación se adapta a las necesidades de la familia. Podemos coordinar los servicios básicos en cuestión de horas tras el contacto inicial y ajustar los detalles de la ceremonia en los días siguientes."
                        />
                        <FAQItem
                            question="¿Podemos personalizar el servicio?"
                            answer="Absolutamente. Ofrecemos una amplia gama de opciones de personalización, incluyendo música, lecturas, selección de flores y decoración, para reflejar fielmente la vida del ser querido."
                        />
                        <FAQItem
                            question="¿Qué opciones de ataúdes tienen disponibles?"
                            answer="Contamos con un catálogo que va desde opciones sencillas hasta diseños de lujo, incluyendo madera y metales, para ajustarnos a diferentes preferencias y presupuestos."
                        />
                    </div>
                </div>
            </div>

            {/* SECCIÓN FOOTER */}
            <Footer />

        </div>
    );
};

export default FuneralTradicional;