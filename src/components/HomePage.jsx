import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Función para generar estrellas de rating
const generateStars = (rating) => {
    return Array(rating).fill('⭐').join('');
};

// Componente Modal para el Formulario de Asesoría
const AsesoriaModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);

    // Cerrar modal al hacer click fuera o presionar ESC
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
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        alert('¡Gracias! Hemos recibido tu solicitud de asesoría. Nos contactaremos contigo en breve.');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Solicitar Asesoría 24/7</h2>
                    <p>Completa el formulario y nuestro equipo se contactará contigo inmediatamente</p>
                </div>

                <form className="asesoria-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="nombre">Nombre Completo *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Ingresa tu nombre completo"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="telefono">Teléfono *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                placeholder="Ej: +57 300 123 4567"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="ciudad">Ciudad *</label>
                            <input
                                type="text"
                                id="ciudad"
                                name="ciudad"
                                placeholder="Tu ciudad de residencia"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="servicio">Tipo de Servicio de Interés *</label>
                        <select id="servicio" name="servicio" required>
                            <option value="">Selecciona un servicio</option>
                            <option value="funeral-tradicional">Funeral Tradicional</option>
                            <option value="cremacion">Cremación</option>
                            <option value="plan-funerario">Plan Funerario</option>
                            <option value="urnas">Urnas y Memoriales</option>
                            <option value="asesoria-general">Asesoría General</option>
                            <option value="emergencia">Emergencia 24/7</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="mensaje">Mensaje o Consulta Específica *</label>
                        <textarea
                            id="mensaje"
                            name="mensaje"
                            placeholder="Describe tu situación o consulta específica..."
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-row">
                        <div className="input-group">
                            <label htmlFor="fecha">Fecha del Servicio (si se conoce)</label>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="presupuesto">Presupuesto Aproximado</label>
                            <select id="presupuesto" name="presupuesto">
                                <option value="">Selecciona un rango</option>
                                <option value="1.5-3">S/. 1,501 - 3,000 soles</option>
                                <option value="3-6">S/. 3,001 - 6,000 soles</option>
                                <option value="6-10">S/. 6,001 - 10,000 soles</option>
                                <option value="10-15">S/. 10,001 - 15,000 soles</option>
                                <option value="15+">Más de S/. 15,000 soles</option>
                            </select>
                        </div>
                    </div>

                    <div className="emergency-notice">
                        <span className="emergency-icon">🚨</span>
                        <p>Para <strong>emergencias inmediatas</strong>, también puedes contactarnos al <strong>+51 910-244-112</strong></p>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button">
                            Solicitar Asesoría
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Datos de ejemplo para el Home Page
const homeData = {
    services: [
        { name: "Funeral Tradicional", path: "/servicios/tradicional" },
        { name: "Cremación", path: "/servicios/cremacion" },
        { name: "Plan Funerario", path: "/servicios/plan" },
        { name: "Urnas", path: "/servicios/urnas" }
    ],
    values: [
        { icon: '🤝', title: 'Respeto', text: 'Honrar cada vida con dignidad y reverencia.' },
        { icon: '💖', title: 'Compasión', text: 'Creando un ambiente de paz en tiempos de tristeza.' },
        { icon: '✨', title: 'Celebración', text: 'Recordar y celebrar la vida con un cuidado genuino.' },
        { icon: '🕊️', title: 'Tranquilidad', text: 'Garantizar la paz y tranquilidad de las familias.' },
    ],
    servicesHighlights: [
        {
            icon: '🕯️',
            title: 'Funeral Tradicional',
            description: 'Ceremonias de cuerpo presente con todos los detalles de organización.',
            path: '/servicios/tradicional'
        },
        {
            icon: '🔥',
            title: 'Cremación',
            description: 'Servicios de cremación respetuosos y discretos.',
            path: '/servicios/cremacion'
        },
        {
            icon: '📖',
            title: 'Plan Funerario',
            description: 'Planes de previsión que garantizan la tranquilidad de su familia.',
            path: '/servicios/plan'
        },
    ],
    testimonials: [
        {
            name: "Sergio M.",
            rating: 5,
            text: "La compasión y el cuidado del equipo hicieron que un momento increíblemente difícil fuera más llevadero. Gestionaron cada detalle con gran delicadeza."
        },
        {
            name: "Jose Luis G.",
            rating: 5,
            text: "Profesionales, respetuosos y genuinamente atentos. Nos ayudaron a crear un hermoso homenaje que honró a la perfección la memoria de mi padre."
        },
        {
            name: "Nelson P.",
            rating: 5,
            text: "Desde la primera llamada hasta la despedida final, cada interacción se gestionó con dignidad y comprensión. Un servicio verdaderamente excepcional."
        },
    ]
};

// Componente Navbar con Dropdown MEJORADO
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

// Componente Principal de la Página de Inicio
function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="home-page-container">
            <Navbar services={homeData.services} />

            <main className="main-content">
                {/* 1. SECCIÓN HERO */}
                <header className="hero-section">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="animate-fadeInDown">En cada despedida buscamos transformar el duelo en un homenaje lleno de amor.</h1>
                        <p className="animate-fadeInUp">Apoyar a las familias con calidez humana y brindar un servicio digno que honre la memoria de quienes se van, fabricando huellas inolvidables en nuestros corazones.</p>
                        {/* Botón modificado para abrir el modal */}
                        <button onClick={openModal} className="cta-button animate-bounceIn">
                            Solicitar Asesoría 24/7
                        </button>
                    </div>
                </header>

                {/* 2. SECCIÓN SOBRE NOSOTROS */}
                <section className="about-section">
                    <div className="about-text">
                        <h3>Sobre Draumheim: Más de tres décadas de compasión</h3>
                        <p>Durante más de tres décadas, Draumheim ha sido un ejemplo de compasión y dignidad en nuestra comunidad. Entendemos que despedirse nunca es fácil, por eso nos dedicamos a crear homenajes significativos que celebran vidas y brindan consuelo en momentos difíciles.</p>
                        <p>Nuestra misión va más allá de los servicios; es acompañar, respetar y preservar el legado de cada ser querido.</p>
                        <Link to="/nosotros" className="learn-more-link">Leer más sobre nuestra historia →</Link>
                    </div>
                    <div className="about-image">
                        <img src="/Iniciar Sesion.jpg" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/D0C1FF/3B207D?text=Momento+de+Paz"; }} alt="Arreglo floral dentro de una iglesia" />
                    </div>
                </section>

                {/* 3. SECCIÓN VALORES */}
                <section className="values-section">
                    <h2>Nuestros Valores</h2>
                    <p className="section-subtitle">
                        Los principios que nos guían al servir a las familias con compasión y dignidad.
                    </p>
                    <div className="values-grid">
                        {homeData.values.map((value, index) => (
                            <div key={index} className="value-card">
                                <span className="icon">{value.icon}</span>
                                <h4>{value.title}</h4>
                                <p>{value.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. SECCIÓN SERVICIOS */}
                <section className="services-section">
                    <h2>Servicios Integrales</h2>
                    <p className="section-subtitle">
                        Servicios funerarios integrales diseñados para honrar la memoria de su ser querido.
                    </p>
                    <div className="services-grid">
                        {homeData.servicesHighlights.map((service, index) => (
                            <div key={index} className="service-card">
                                <span className="icon">{service.icon}</span>
                                <h4>{service.title}</h4>
                                <p>{service.description}</p>
                                {/* CORREGIDO: Usar la ruta específica en lugar de generar una */}
                                <Link to={service.path} className="service-link">Ver detalles</Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. SECCIÓN TESTIMONIOS */}
                <section className="testimonials-section">
                    <h2>Lo que dicen las familias</h2>
                    <p className="section-subtitle">
                        Testimonios de familias a las que hemos tenido el honor de servir.
                    </p>
                    <div className="testimonials-grid">
                        {homeData.testimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-card">
                                <div className="rating">
                                    {generateStars(testimonial.rating)}
                                </div>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <p className="testimonial-author">- {testimonial.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        {/* CORREGIDO: Cambiado a Draumheim */}
                        <h4>Draumheim</h4>
                        <p>Brindando servicios funerarios con compasión y dignidad.</p>
                        <p>© 2025 Draumheim. Todos los derechos reservados.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Servicios</h4>
                        {/* CORREGIDO: Enlaces actualizados */}
                        <Link to="/servicios/plan" className="footer-link">Plan Funerario</Link>
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
                        {/* CORREGIDO: Cambiado a Draumheim */}
                        <p><span className="icon">📧</span> info@draumheim.com</p>
                        <p><span className="icon">📍</span> Ubicaciones</p>
                    </div>
                </div>
            </footer>

            {/* Modal de Asesoría */}
            <AsesoriaModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default HomePage;