import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cremacion.css';

// Assets
const FIRE_IMAGE_1 = "https://placehold.co/400x300/F0D0B0/555555?text=Sala+de+Despedida+con+Velas";
const FIRE_IMAGE_2 = "https://placehold.co/200x150/F0D0B0/555555?text=Urnas+Elegantes";
const WATER_IMAGE_1 = "https://placehold.co/400x300/A0C0E0/555555?text=Ceremonia+Acuática";
const WATER_IMAGE_2 = "https://placehold.co/200x150/A0C0E0/555555?text=Flor+en+Agua";

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

// COMPONENTE MODAL ASESORÍA
const AsesoriaPrivadaModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        tipoServicio: '',
        fechaPreferida: '',
        horarioPreferido: '',
        tipoCremacion: '',
        ubicacion: '',
        mensaje: ''
    });

    const modalRef = useRef(null);

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Gracias! Hemos recibido tu solicitud de asesoría privada. Nos contactaremos contigo en breve para coordinar la cita.');
        onClose();
        setFormData({
            nombre: '',
            telefono: '',
            email: '',
            tipoServicio: '',
            fechaPreferida: '',
            horarioPreferido: '',
            tipoCremacion: '',
            ubicacion: '',
            mensaje: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Coordinar Asesoría Privada</h2>
                    <p>Programa una consulta personalizada con nuestros especialistas en cremación</p>
                </div>

                <form className="asesoria-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="section-title">Información Personal</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="nombre">Nombre Completo *</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    value={formData.nombre}
                                    onChange={handleChange}
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
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="Ej: +51 999 888 777"
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="email">Correo Electrónico *</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="ubicacion">Ubicación *</label>
                                <input 
                                    type="text" 
                                    id="ubicacion" 
                                    name="ubicacion" 
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    placeholder="Tu ciudad de residencia"
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Preferencias de Servicio</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="tipoCremacion">Tipo de Cremación de Interés *</label>
                                <select 
                                    id="tipoCremacion" 
                                    name="tipoCremacion" 
                                    value={formData.tipoCremacion}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="fuego">Cremación con Fuego (Tradicional)</option>
                                    <option value="agua">Cremación con Agua (Acuamación)</option>
                                    <option value="no-se">Aún no estoy seguro/a</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="tipoServicio">Tipo de Asesoría *</label>
                                <select 
                                    id="tipoServicio" 
                                    name="tipoServicio" 
                                    value={formData.tipoServicio}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="presencial">Asesoría Presencial</option>
                                    <option value="virtual">Asesoría Virtual (Video llamada)</option>
                                    <option value="telefonica">Asesoría Telefónica</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">Preferencias de Horario</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="fechaPreferida">Fecha Preferida *</label>
                                <input 
                                    type="date" 
                                    id="fechaPreferida" 
                                    name="fechaPreferida" 
                                    value={formData.fechaPreferida}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="horarioPreferido">Horario Preferido *</label>
                                <select 
                                    id="horarioPreferido" 
                                    name="horarioPreferido" 
                                    value={formData.horarioPreferido}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un horario</option>
                                    <option value="manana">Mañana (9:00 AM - 12:00 PM)</option>
                                    <option value="tarde">Tarde (2:00 PM - 5:00 PM)</option>
                                    <option value="noche">Noche (6:00 PM - 8:00 PM)</option>
                                    <option value="flexible">Horario Flexible</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="input-group">
                            <label htmlFor="mensaje">Información Adicional o Preguntas Específicas</label>
                            <textarea 
                                id="mensaje" 
                                name="mensaje" 
                                value={formData.mensaje}
                                onChange={handleChange}
                                placeholder="Comparte cualquier información adicional, preguntas específicas sobre cremación, o detalles que debamos conocer..."
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    <div className="benefits-notice">
                        <h4>🎯 ¿Qué incluye tu asesoría privada?</h4>
                        <ul>
                            <li>✅ Explicación detallada de ambos tipos de cremación</li>
                            <li>✅ Análisis de costos y opciones de pago</li>
                            <li>✅ Orientación sobre trámites legales y documentación</li>
                            <li>✅ Asesoría en selección de urnas y opciones de disposición</li>
                            <li>✅ Respuestas a todas tus preguntas personalmente</li>
                        </ul>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button">
                            Solicitar Asesoría Privada
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// COMPONENTES REUTILIZABLES
const BulletPoint = ({ children, color = 'text-gray-700' }) => (
    <li className={`bullet-point ${color}`}>
        <span className="bullet-icon">✓</span>
        <span>{children}</span>
    </li>
);

const InfoBox = ({ emoji, title, description, bgClass, textClass, iconClass }) => (
    <div className={`info-box ${bgClass}`}>
        <span className={`info-box-emoji ${iconClass}`}>{emoji}</span>
        <h4 className={`info-box-title ${textClass}`}>{title}</h4>
        <p className={`info-box-description ${textClass}`}>{description}</p>
    </div>
);

const UrnBox = ({ title, emoji, description, bgColor, borderColor }) => (
    <div className={`urn-box ${bgColor} ${borderColor}`}>
        <div className="urn-icon-container">
            <span className="urn-emoji">{emoji}</span>
        </div>
        <h3 className="urn-title">{title}</h3>
        <p className="urn-description">{description}</p>
    </div>
);

// COMPONENTE PRINCIPAL
const Cremacion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="cremacion-page">
            
            {/* SECCIÓN NAVBAR */}
            <Navbar services={servicesData} />
            
            {/* SECCIÓN HERO */}
            <div className="hero-section-cremacion">
                <div className="hero-content-cremacion">
                    <h1 className="hero-title-cremacion">
                        Servicio de cremación
                    </h1>
                    <p className="hero-subtitle-cremacion">
                        Ofreciendo diversas formas para honrar la memoria de tu ser querido.
                    </p>
                    <div className="hero-navigation">
                        <a href="#fire" className="nav-link-internal">Cremación con Fuego</a>
                        <span className="nav-separator">|</span>
                        <a href="#water" className="nav-link-internal">Cremación con Agua</a>
                        <span className="nav-separator">|</span>
                        <a href="#options" className="nav-link-internal">Disposición de Cenizas</a>
                    </div>
                </div>
            </div>

            {/* SECCIÓN CREMACIÓN CON FUEGO */}
            <div id="fire" className="fire-section">
                <div className="section-container">
                    <div className="section-content">
                        <h2 className="section-title">
                            <span className="section-icon">☀️</span>
                            Cremación con fuego
                        </h2>
                        <p className="section-description">
                            La cremación con fuego es la opción tradicional y una de las más elegidas. Garantiza un proceso digno y respetuoso, ofreciendo a las familias flexibilidad para realizar servicios conmemorativos.
                        </p>
                        
                        <div className="details-box">
                            <h3 className="details-title">Detalles del proceso:</h3>
                            <ul className="details-list">
                                <BulletPoint>Servicio de despedida privada y ceremonial (si se desea).</BulletPoint>
                                <BulletPoint>Traslado y documentación legal gestionada.</BulletPoint>
                                <BulletPoint>Opción de urna conmemorativa.</BulletPoint>
                                <BulletPoint>Certificación legal del proceso y cenizas.</BulletPoint>
                            </ul>
                        </div>
                        
                        <div className="floating-question">
                            <p className="question-text">¿Por qué las familias eligen la cremación?</p>
                            <div className="question-options">
                                <p>Flexibilidad Ceremonial</p>
                                <p>Menor Costo</p>
                                <p>Simple y Digno</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="section-images">
                        <div className="images-container">
                            <img 
                                src={FIRE_IMAGE_1} 
                                alt="Sala de Despedida" 
                                className="main-image"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/F0D0B0/555555?text=Sala+de+Despedida"; }}
                            />
                            <div className="side-images">
                                <img 
                                    src={FIRE_IMAGE_2} 
                                    alt="Urnas de Cerámica" 
                                    className="side-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/F0D0B0/555555?text=Urnas"; }}
                                />
                                <img 
                                    src={FIRE_IMAGE_2} 
                                    alt="Detalle de Arreglo Floral" 
                                    className="side-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/F0D0B0/555555?text=Flores"; }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN CREMACIÓN CON AGUA */}
            <div id="water" className="water-section">
                <div className="section-container reverse">
                    <div className="section-content">
                        <h2 className="section-title water-title">
                            <span className="section-icon">💧</span>
                            Cremación con agua (Acuamación)
                        </h2>
                        <p className="section-description water-description">
                            La acuamación es una alternativa moderna y eco-amigable. Este proceso utiliza agua y alcalinidad para acelerar la descomposición natural, resultando en cenizas puras y una menor huella de carbono.
                        </p>
                        
                        <div className="details-box water-details">
                            <h3 className="details-title water-details-title">Beneficios ecológicos:</h3>
                            <ul className="details-list">
                                <BulletPoint color="text-white">Menor consumo de energía comparado con el fuego.</BulletPoint>
                                <BulletPoint color="text-white">Las cenizas finales son de color más claro y uniforme.</BulletPoint>
                                <BulletPoint color="text-white">Proceso suave y silencioso, elegido por su respeto a la naturaleza.</BulletPoint>
                            </ul>
                        </div>
                        
                        <div className="floating-question water-question">
                            <p className="question-text water-question-text">¿Por qué las familias eligen la acuamación?</p>
                            <div className="question-options water-options">
                                <p className="option-item"><span className="option-icon">💚</span> Ecológica</p>
                                <p className="option-item"><span className="option-icon">🕊️</span> Suave</p>
                                <p className="option-item"><span className="option-icon">🌿</span> Natural</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="section-images">
                        <div className="images-container">
                            <img 
                                src={WATER_IMAGE_1} 
                                alt="Sala de Ceremonia Acuática" 
                                className="main-image"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/A0C0E0/555555?text=Ceremonia+Acuática"; }}
                            />
                            <div className="side-images">
                                <img 
                                    src={WATER_IMAGE_2} 
                                    alt="Urnas Ecológicas" 
                                    className="side-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/A0C0E0/555555?text=Urnas+Ecológicas"; }}
                                />
                                <img 
                                    src={WATER_IMAGE_2} 
                                    alt="Detalle en Agua" 
                                    className="side-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x150/A0C0E0/555555?text=Símbolo+de+Paz"; }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* SECCIÓN OPCIONES DE DISPOSICIÓN */}
            <div id="options" className="options-section">
                <div className="options-container">
                    <h2 className="options-title">Disposición de cenizas y urnas</h2>
                    
                    <div className="options-grid">
                        <div className="option-box fire-option">
                            <h3 className="option-box-title">Urnas de cremación (fuego)</h3>
                            <ul className="option-list">
                                <BulletPoint>Cerámica, metal y madera fina.</BulletPoint>
                                <BulletPoint>Diseños tradicionales y modernos.</BulletPoint>
                                <BulletPoint>Servicio de grabado y personalización.</BulletPoint>
                            </ul>
                        </div>

                        <div className="option-box water-option">
                            <h3 className="option-box-title">Urnas de acuamación (agua)</h3>
                            <ul className="option-list">
                                <BulletPoint>Urnas biodegradables para esparcimiento acuático.</BulletPoint>
                                <BulletPoint>Opciones de cristal y materiales ecológicos.</BulletPoint>
                                <BulletPoint>Cápsulas de vida (plantación de árboles).</BulletPoint>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN TESTIMONIOS */}
            <div id="testimonials" className="testimonials-section">
                <h2 className="testimonials-title">Lo que dicen las familias</h2>
                <p className="testimonials-subtitle">Testimonios de familias a las que hemos tenido el honor de servir</p>
                
                <div className="testimonials-grid">
                    <InfoBox
                        emoji="💖"
                        title="Sergio"
                        description="La compasión y el cuidado del equipo de Draumheim hicieron que un momento increíblemente difícil fuera más llevadero. Gestionaron cada detalle con gran delicadeza."
                        bgClass="testimonial-box"
                        textClass="testimonial-text"
                        iconClass="testimonial-icon"
                    />
                    <InfoBox
                        emoji="💖"
                        title="José Luis"
                        description="Profesionales, respetuosos y genuinamente atentos. Nos ayudaron a crear un hermoso homenaje que honró a la perfección la memoria de mi padre."
                        bgClass="testimonial-box"
                        textClass="testimonial-text"
                        iconClass="testimonial-icon"
                    />
                    <InfoBox
                        emoji="💖"
                        title="Nelson"
                        description="Desde la primera llamada hasta la despedida final, cada interacción se gestionó con dignidad y comprensión. Un servicio verdaderamente excepcional."
                        bgClass="testimonial-box"
                        textClass="testimonial-text"
                        iconClass="testimonial-icon"
                    />
                </div>
            </div>

            {/* SECCIÓN LLAMADA A LA ACCIÓN */}
            <div id="contact-cta" className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">
                        <span className="cta-icon">👥</span>
                        Solicitar asesoría
                    </h2>
                    <p className="cta-description">
                        Elija la opción de cremación que más se ajuste a sus deseos. Estamos disponibles 24 horas al día para guiarle.
                    </p>
                    <div className="cta-buttons">
                        <button className="cta-button primary">
                            Llamar ahora (24/7)
                        </button>
                        <button className="cta-button secondary" onClick={openModal}>
                            Coordinar Asesoría Privada
                        </button>
                    </div>
                </div>
            </div>
            
            {/* SECCIÓN FOOTER */}
            <Footer />

            {/* MODAL ASESORÍA */}
            <AsesoriaPrivadaModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default Cremacion;