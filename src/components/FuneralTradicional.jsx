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
    { name: "Urnas", path: "/servicios/urnas" }
];

// COMPONENTE NAVBAR
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

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false);
    };

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
                </div>
            </div>
        </nav>
    );
};

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

    // Cargar datos del usuariodel modal edit
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

//FOOTER
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

// Componente Modal para solicitar plan
const PlanModal = ({ isOpen, onClose, planType, onSubmit }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        telefono: '',
        capilla: '',
        fecha_servicio: '',
        cantidad_asistentes: '',
        mensaje_adicional: ''
    });

    // Datos de capillas en Perú (basado en investigación real)
    const capillasPeru = [
        { value: '', label: 'Seleccione una capilla' },
        { value: 'lima_central', label: 'Capilla Central - Lima' },
        { value: 'miraflores', label: 'Capilla Miraflores - Lima' },
        { value: 'san_isidro', label: 'Capilla San Isidro - Lima' },
        { value: 'la_molina', label: 'Capilla La Molina - Lima' },
        { value: 'arequipa_central', label: 'Capilla Central - Arequipa' },
        { value: 'cusco_historica', label: 'Capilla Histórica - Cusco' },
        { value: 'trujillo_norte', label: 'Capilla del Norte - Trujillo' },
        { value: 'chiclayo_moderna', label: 'Capilla Moderna - Chiclayo' },
        { value: 'piura_tradicional', label: 'Capilla Tradicional - Piura' },
        { value: 'iquitos_amazonica', label: 'Capilla Amazónica - Iquitos' },
        { value: 'huancayo_central', label: 'Capilla Central - Huancayo' }
    ];

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!isOpen) return null;

    const getPlanPrice = () => {
        switch (planType) {
            case 'básico': return 'S/ 3,500';
            case 'estándar': return 'S/ 6,800';
            case 'premium': return 'S/ 12,500';
            default: return '';
        }
    };

    const getPlanFeatures = () => {
        switch (planType) {
            case 'básico':
                return ['Traslado local (hasta 50 km)', 'Ataúd estándar en madera', 'Capilla básica (4 horas)', 'Asesoría documental básica', 'Ceremonia simple'];
            case 'estándar':
                return ['Traslado regional (hasta 100 km)', 'Ataúd premium en caoba', 'Capilla premium (8 horas)', 'Asesoría documental completa', 'Ceremonia personalizada', 'Arreglos florales básicos'];
            case 'premium':
                return ['Traslado nacional', 'Ataúd de lujo en bronce', 'Capilla de lujo (24 horas)', 'Asesoría legal completa', 'Ceremonia premium personalizada', 'Arreglos florales premium', 'Servicio de cátering'];
            default: return [];
        }
    };

    return (
        <div className="modal-overlay-plan">
            <div className="modal-content-plan" ref={modalRef}>
                <button className="modal-close-plan" onClick={onClose}>×</button>
                
                <div className="modal-header-plan">
                    <h2>Solicitar Plan {planType.charAt(0).toUpperCase() + planType.slice(1)}</h2>
                    <p>Complete el formulario para que nos contactemos con usted</p>
                </div>

                <form className="modal-form-plan" onSubmit={handleSubmit}>
                    <div className="plan-summary-plan">
                        <h4>Resumen del Plan Seleccionado</h4>
                        <div className="plan-price-plan">{getPlanPrice()}</div>
                        <ul>
                            {getPlanFeatures().map((feature, index) => (
                                <li key={index}>✓ {feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="form-row-plan">
                        <div className="form-group-plan">
                            <label htmlFor="nombre_completo">Nombre Completo *</label>
                            <input
                                type="text"
                                id="nombre_completo"
                                name="nombre_completo"
                                value={formData.nombre_completo}
                                onChange={handleChange}
                                required
                                placeholder="Ingrese su nombre completo"
                            />
                        </div>

                        <div className="form-group-plan">
                            <label htmlFor="email">Correo Electrónico *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                    </div>

                    <div className="form-row-plan">
                        <div className="form-group-plan">
                            <label htmlFor="telefono">Teléfono *</label>
                            <input
                                type="tel"
                                id="telefono"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                required
                                placeholder="+51 XXX XXX XXX"
                            />
                        </div>

                        <div className="form-group-plan">
                            <label htmlFor="capilla">Capilla Preferida *</label>
                            <select
                                id="capilla"
                                name="capilla"
                                value={formData.capilla}
                                onChange={handleChange}
                                required
                            >
                                {capillasPeru.map((capilla) => (
                                    <option key={capilla.value} value={capilla.value}>
                                        {capilla.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row-plan">
                        <div className="form-group-plan">
                            <label htmlFor="fecha_servicio">Fecha Tentativa del Servicio</label>
                            <input
                                type="date"
                                id="fecha_servicio"
                                name="fecha_servicio"
                                value={formData.fecha_servicio}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="form-group-plan">
                            <label htmlFor="cantidad_asistentes">Cantidad Estimada de Asistentes</label>
                            <select
                                id="cantidad_asistentes"
                                name="cantidad_asistentes"
                                value={formData.cantidad_asistentes}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione cantidad</option>
                                <option value="1-20">1-20 personas</option>
                                <option value="21-50">21-50 personas</option>
                                <option value="51-100">51-100 personas</option>
                                <option value="100+">Más de 100 personas</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group-plan">
                        <label htmlFor="mensaje_adicional">Mensaje Adicional o Requerimientos Especiales</label>
                        <textarea
                            id="mensaje_adicional"
                            name="mensaje_adicional"
                            value={formData.mensaje_adicional}
                            onChange={handleChange}
                            placeholder="Información adicional que considere importante..."
                            rows="4"
                        />
                    </div>

                    <div className="modal-actions-plan">
                        <button type="button" className="cancel-btn-plan" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={`submit-btn-plan ${planType}-btn`}>
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Diseño de la pagina
const FuneralTradicional = () => {

    const [usuario, setUsuario] = useState(null);
    const [isEditarPerfilOpen, setIsEditarPerfilOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');

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

    const openPlanModal = (planType) => {
        setSelectedPlan(planType);
        setIsPlanModalOpen(true);
    };

    const closePlanModal = () => {
        setIsPlanModalOpen(false);
        setSelectedPlan('');
    };

    const handlePlanSubmit = async (formData) => {
        try {
            // Aquí iría la lógica para enviar los datos al backend
            console.log('Datos del plan:', {
                plan: selectedPlan,
                ...formData
            });
            
            // Simulación de envío exitoso
            alert(`Solicitud para plan ${selectedPlan} enviada correctamente. Nos contactaremos pronto.`);
            closePlanModal();
        } catch (error) {
            alert('Error al enviar la solicitud. Por favor intente nuevamente.');
        }
    };

    return (
        <div className="funeral-tradicional-page">

            {/*SECCION NAVBAR */}
            <Navbar services={servicesData}
                usuario={usuario}
                onEditarPerfil={openEditarPerfil}
                onCerrarSesion={cerrarSesion}
            />

            <EditarPerfilModal
                isOpen={isEditarPerfilOpen}
                onClose={closeEditarPerfil}
                usuario={usuario}
                onGuardar={guardarPerfil}
            />

            {/* SECCION HERO */}
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

            {/* SECCIÓN DE PLANES */}
            <div className="plans-section-funeral">
                <div className="plans-container-funeral">
                    <h2 className="plans-title-funeral">Nuestros Planes de Servicio Tradicional</h2>
                    <p className="plans-subtitle-funeral">
                        Elija el plan que mejor se adapte a las necesidades de su familia
                    </p>

                    <div className="plans-grid-funeral">
                        {/* Plan Básico */}
                        <div className="plan-card-funeral basic-plan">
                            <div className="plan-header-funeral">
                                <h3 className="plan-name">Básico</h3>
                                <div className="plan-price">S/ 3,500</div>
                            </div>
                            <div className="plan-features-funeral">
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Traslado local (hasta 50 km)</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Ataúd estándar en madera</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Capilla básica (4 horas)</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Asesoría documental básica</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Ceremonia simple</span>
                                </div>
                            </div>
                            <button 
                                className="plan-button-funeral basic-btn"
                                onClick={() => openPlanModal('básico')}
                            >
                                Solicitar Plan
                            </button>
                        </div>

                        {/* Plan Estándar */}
                        <div className="plan-card-funeral standard-plan">
                            <div className="plan-badge">Más Popular</div>
                            <div className="plan-header-funeral">
                                <h3 className="plan-name">Estándar</h3>
                                <div className="plan-price">S/ 6,800</div>
                            </div>
                            <div className="plan-features-funeral">
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Traslado regional (hasta 100 km)</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Ataúd premium en caoba</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Capilla premium (8 horas)</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Asesoría documental completa</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Ceremonia personalizada</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Arreglos florales básicos</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Libro de condolencias</span>
                                </div>
                            </div>
                            <button 
                                className="plan-button-funeral standard-btn"
                                onClick={() => openPlanModal('estándar')}
                            >
                                Solicitar Plan
                            </button>
                        </div>

                        {/* Plan Premium */}
                        <div className="plan-card-funeral premium-plan">
                            <div className="plan-header-funeral">
                                <h3 className="plan-name">Premium</h3>
                                <div className="plan-price">S/ 12,500</div>
                            </div>
                            <div className="plan-features-funeral">
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Traslado nacional</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Ataúd de lujo en bronce</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Capilla de lujo (24 horas)</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Asesoría legal completa</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Ceremonia premium personalizada</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Arreglos florales premium</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Servicio de cátering</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Transporte para familiares</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-check">✓</span>
                                    <span>Video memorial profesional</span>
                                </div>
                            </div>
                            <button 
                                className="plan-button-funeral premium-btn"
                                onClick={() => openPlanModal('premium')}
                            >
                                Solicitar Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para solicitar plan */}
            <PlanModal 
                isOpen={isPlanModalOpen}
                onClose={closePlanModal}
                planType={selectedPlan}
                onSubmit={handlePlanSubmit}
            />

            <Footer />

        </div>
    );
};

export default FuneralTradicional;