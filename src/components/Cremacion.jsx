import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cremacion.css';

const FIRE_IMAGE_1 = "https://storage.googleapis.com/uxpilot-auth.appspot.com/5196be86db-37a0715e47bd281dc9cf.png";
const FIRE_IMAGE_2 = "https://storage.googleapis.com/uxpilot-auth.appspot.com/6be2f0a6b4-70b7da728f458819955c.png";
const FIRE_IMAGE_3 = "https://storage.googleapis.com/uxpilot-auth.appspot.com/88c30f8211-281ccba2c258cef77e70.png";
const WATER_IMAGE_1 = "https://storage.googleapis.com/uxpilot-auth.appspot.com/5bef3bd0d8-e7eeca6e8c717b94ce59.png";
const WATER_IMAGE_2 = "https://storage.googleapis.com/uxpilot-auth.appspot.com/6c96480609-130c5ebda3e218308fed.png";
const WATER_IMAGE_3 = "https://storage.googleapis.com/uxpilot-auth.appspot.com/b674fe8a17-9cba23870b549cfc0be3.png";

const servicesData = [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },

    { name: "Urnas", path: "/servicios/urnas" }
];

//NAVBAR
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

//MODAL DE ASESORIA
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
                        <h4>¿Qué incluye tu asesoría privada?</h4>
                        <ul>
                            <li>Explicación detallada de ambos tipos de cremación</li>
                            <li>Análisis de costos y opciones de pago</li>
                            <li>Orientación sobre trámites legales y documentación</li>
                            <li>Asesoría en selección de urnas y opciones de disposición</li>
                            <li>Respuestas a todas tus preguntas personalmente</li>
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

//Modal de editar cuenta
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

// Componente Modal para solicitar plan de cremación
const CremacionPlanModal = ({ isOpen, onClose, planType, onSubmit }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        telefono: '',
        ubicacion: '',
        tipo_cremacion: '',
        lugar_cremacion: '',
        tipo_urna: '',
        fecha_servicio: '',
        mensaje_adicional: ''
    });

    const [selectedCremationType, setSelectedCremationType] = useState('');
    const [selectedUrna, setSelectedUrna] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    // Datos para opciones de cremación
    const cremationTypes = [
        {
            id: 'fuego',
            title: '🔥 Cremación con Fuego',
            description: 'Proceso tradicional que utiliza altas temperaturas. Opción más común y ampliamente aceptada.',
            icon: '🔥'
        },
        {
            id: 'agua',
            title: '💧 Cremación con Agua (Acuamación)',
            description: 'Proceso ecológico que utiliza agua y soluciones alcalinas. Menor impacto ambiental.',
            icon: '💧'
        }
    ];

    // Datos para ubicaciones de cremación en Perú
    const cremationLocations = [
        { value: 'lima_central', label: 'Capilla Central - Lima', description: 'Instalaciones modernas en el corazón de Lima' },
        { value: 'miraflores', label: 'Centro de Cremación Miraflores', description: 'Ubicación exclusiva con vista al mar' },
        { value: 'san_isidro', label: 'Complejo San Isidro', description: 'Instalaciones premium en zona residencial' },
        { value: 'arequipa', label: 'Centro Arequipa', description: 'Modernas instalaciones en la Ciudad Blanca' },
        { value: 'trujillo', label: 'Complejo Trujillo', description: 'Servicio especializado en el norte del país' }
    ];

    // Datos para tipos de urnas
    const urnaOptions = [
        {
            id: 'tradicional',
            title: 'Urna Tradicional',
            description: 'Diseños clásicos en madera, cerámica o metal. Elegancia atemporal.',
            price: 'Incluida',
            icon: '⚱️'
        },
        {
            id: 'moderna',
            title: 'Urna Moderna',
            description: 'Diseños contemporáneos con materiales innovadores. Estilo vanguardista.',
            price: '+ S/ 200',
            icon: '✨'
        },
        {
            id: 'joyas',
            title: 'Urna Joya',
            description: 'Urnas convertibles en joyas conmemorativas. Para llevar siempre contigo.',
            price: '+ S/ 500',
            icon: '💎'
        }
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
        const finalData = {
            ...formData,
            tipo_cremacion: selectedCremationType,
            tipo_urna: selectedUrna,
            lugar_cremacion: selectedLocation
        };
        onSubmit(finalData);
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
            case 'básico': return 'S/ 2,500';
            case 'estándar': return 'S/ 4,800';
            case 'premium': return 'S/ 8,500';
            default: return '';
        }
    };

    const getPlanFeatures = () => {
        switch (planType) {
            case 'básico':
                return ['Cremación tradicional con fuego', 'Urna estándar de madera', 'Trámites legales básicos', 'Certificado de cremación', 'Traslado local (hasta 30 km)'];
            case 'estándar':
                return ['Elección: Fuego o Agua (Acuamación)', 'Urna premium a elección', 'Ceremonia breve de despedida', 'Trámites legales completos', 'Asesoría personalizada'];
            case 'premium':
                return ['Elección libre: Fuego, Agua o ambas', 'Urna de lujo personalizable', 'Ceremonia completa personalizada', 'Asistencia legal integral', 'Video memorial profesional'];
            default: return [];
        }
    };

    return (
        <div className="modal-overlay-cremacion">
            <div className="modal-content-cremacion" ref={modalRef}>
                <button className="modal-close-cremacion" onClick={onClose}>×</button>
                
                <div className="modal-header-cremacion">
                    <h2>Solicitar Plan {planType.charAt(0).toUpperCase() + planType.slice(1)} de Cremación</h2>
                    <p>Complete el formulario para personalizar su servicio de cremación</p>
                </div>

                <form className="modal-form-cremacion" onSubmit={handleSubmit}>
                    <div className="plan-summary-cremacion">
                        <h4>Resumen del Plan Seleccionado</h4>
                        <div className="plan-price-cremacion-modal">{getPlanPrice()}</div>
                        <ul>
                            {getPlanFeatures().map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="form-row-cremacion">
                        <div className="form-group-cremacion">
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

                        <div className="form-group-cremacion">
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

                    <div className="form-row-cremacion">
                        <div className="form-group-cremacion">
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

                        <div className="form-group-cremacion">
                            <label htmlFor="ubicacion">Ubicación *</label>
                            <input
                                type="text"
                                id="ubicacion"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                required
                                placeholder="Ciudad y distrito de residencia"
                            />
                        </div>
                    </div>

                    {/* Selección de Tipo de Cremación */}
                    <div className="cremation-type-section">
                        <h4>Seleccione el Tipo de Cremación *</h4>
                        <div className="cremation-options">
                            {cremationTypes.map((type) => (
                                <div
                                    key={type.id}
                                    className={`cremation-option ${selectedCremationType === type.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedCremationType(type.id)}
                                >
                                    <div className="cremation-option-header">
                                        <span className="cremation-option-icon">{type.icon}</span>
                                        <h5 className="cremation-option-title">{type.title}</h5>
                                    </div>
                                    <p className="cremation-option-description">{type.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Opciones dinámicas basadas en tipo de cremación seleccionado */}
                    {selectedCremationType && (
                        <div className="cremation-details">
                            <h5>Personalice su servicio de {selectedCremationType === 'fuego' ? 'Cremación con Fuego' : 'Acuamación'}</h5>
                            
                            {/* Selección de Ubicación */}
                            <div className="form-group-cremacion">
                                <label>Lugar de Cremación Preferido *</label>
                                <div className="location-options">
                                    {cremationLocations.map((location) => (
                                        <div
                                            key={location.value}
                                            className={`location-option ${selectedLocation === location.value ? 'selected' : ''}`}
                                            onClick={() => setSelectedLocation(location.value)}
                                        >
                                            <div className="location-option-header">
                                                <h6 className="location-option-title">{location.label}</h6>
                                            </div>
                                            <p className="location-option-description">{location.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selección de Urna */}
                            <div className="form-group-cremacion">
                                <label>Tipo de Urna *</label>
                                <div className="urna-options">
                                    {urnaOptions.map((urna) => (
                                        <div
                                            key={urna.id}
                                            className={`urna-option ${selectedUrna === urna.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedUrna(urna.id)}
                                        >
                                            <div className="urna-option-header">
                                                <span className="urna-option-icon">{urna.icon}</span>
                                                <h6 className="urna-option-title">{urna.title}</h6>
                                            </div>
                                            <p className="urna-option-description">{urna.description}</p>
                                            <div className="urna-option-price">{urna.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-row-cremacion">
                        <div className="form-group-cremacion">
                            <label htmlFor="fecha_servicio">Fecha para el Servicio</label>
                            <input
                                type="date"
                                id="fecha_servicio"
                                name="fecha_servicio"
                                value={formData.fecha_servicio}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="form-group-cremacion">
                        <label htmlFor="mensaje_adicional">Mensaje Adicional o Requerimientos Especiales</label>
                        <textarea
                            id="mensaje_adicional"
                            name="mensaje_adicional"
                            value={formData.mensaje_adicional}
                            onChange={handleChange}
                            placeholder="Información adicional sobre preferencias ceremoniales, necesidades especiales, o cualquier detalle que debamos conocer..."
                            rows="4"
                        />
                    </div>

                    <div className="modal-actions-cremacion">
                        <button type="button" className="cancel-btn-cremacion" onClick={onClose}>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className={`submit-btn-cremacion ${planType}-btn-modal`}
                            disabled={!selectedCremationType || !selectedLocation || !selectedUrna}
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

//Diseño de la pagina
const Cremacion = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

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
            console.log('Datos del plan de cremación:', {
                plan: selectedPlan,
                ...formData
            });
            
            alert(`Solicitud para plan ${selectedPlan} enviada correctamente. Nos contactaremos pronto.`);
            closePlanModal();
        } catch (error) {
            alert('Error al enviar la solicitud. Por favor intente nuevamente.');
        }
    };

    return (
        <div className="cremacion-page">

            {/* SECCION NAVBAR */}
            <Navbar
                services={servicesData}
                usuario={usuario}
                onEditarPerfil={openEditarPerfil}
                onCerrarSesion={cerrarSesion}
            />

            {/* SECCION HERO */}
            <div className="hero-section-cremacion">
                <div className="hero-overlay-cremacion"></div>
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

            {/*SECCION CREMACION CON FUEGO */}
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
                            />
                            <div className="side-images">
                                <img
                                    src={FIRE_IMAGE_2}
                                    alt="Urnas de Cerámica"
                                    className="side-image"
                                />
                                <img
                                    src={FIRE_IMAGE_3}
                                    alt="Detalle de Arreglo Floral"
                                    className="side-image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*SECCION CREMACION CON AGUA */}
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
                            />
                            <div className="side-images">
                                <img
                                    src={WATER_IMAGE_2}
                                    alt="Urnas Ecológicas"
                                    className="side-image"
                                />
                                <img
                                    src={WATER_IMAGE_3}
                                    alt="Detalle en Agua"
                                    className="side-image"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*SECCION DE DISPOSICION */}
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

            {/* SECCION DE TESTIMONIOS */}
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

            {/* SECCIÓN DE PLANES DE CREMACIÓN */}
            <div className="plans-section-cremacion">
                <div className="plans-container-cremacion">
                    <h2 className="plans-title-cremacion">Nuestros Planes de Cremación</h2>
                    <p className="plans-subtitle-cremacion">
                        Elija el plan que mejor se adapte a sus necesidades y preferencias
                    </p>

                    <div className="plans-grid-cremacion">
                        {/* Plan Básico */}
                        <div className="plan-card-cremacion basic-plan-cremacion">
                            <div className="plan-header-cremacion">
                                <h3 className="plan-name-cremacion">Básico</h3>
                                <div className="plan-price-cremacion">S/ 2,500</div>
                            </div>
                            <div className="plan-features-cremacion">
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Cremación tradicional con fuego</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Urna estándar de madera</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Trámites legales básicos</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Certificado de cremación</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Traslado local (hasta 30 km)</span>
                                </div>
                            </div>
                            <button 
                                className="plan-button-cremacion basic-btn-cremacion"
                                onClick={() => openPlanModal('básico')}
                            >
                                Solicitar Plan
                            </button>
                        </div>

                        {/* Plan Estándar */}
                        <div className="plan-card-cremacion standard-plan-cremacion">
                            <div className="plan-badge-cremacion">Más Popular</div>
                            <div className="plan-header-cremacion">
                                <h3 className="plan-name-cremacion">Estándar</h3>
                                <div className="plan-price-cremacion">S/ 4,800</div>
                            </div>
                            <div className="plan-features-cremacion">
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Elección: Fuego o Agua (Acuamación)</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Urna premium a elección</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Ceremonia breve de despedida</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Trámites legales completos</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Asesoría personalizada</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Traslado regional (hasta 80 km)</span>
                                </div>
                            </div>
                            <button 
                                className="plan-button-cremacion standard-btn-cremacion"
                                onClick={() => openPlanModal('estándar')}
                            >
                                Solicitar Plan
                            </button>
                        </div>

                        {/* Plan Premium */}
                        <div className="plan-card-cremacion premium-plan-cremacion">
                            <div className="plan-header-cremacion">
                                <h3 className="plan-name-cremacion">Premium</h3>
                                <div className="plan-price-cremacion">S/ 8,500</div>
                            </div>
                            <div className="plan-features-cremacion">
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Elección libre: Fuego, Agua o ambas</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Urna de lujo personalizable</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Ceremonia completa personalizada</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Asistencia legal integral</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Video memorial profesional</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Transporte para familiares</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Traslado nacional</span>
                                </div>
                                <div className="feature-item-cremacion">
                                    <span className="feature-check-cremacion">✓</span>
                                    <span>Seguimiento post-servicio</span>
                                </div>
                            </div>
                            <button 
                                className="plan-button-cremacion premium-btn-cremacion"
                                onClick={() => openPlanModal('premium')}
                            >
                                Solicitar Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*SECCION ASESORIA PRIVADA */}
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
                        <button className="cta-button secondary" onClick={openModal}>
                            Coordinar Asesoría Privada
                        </button>
                    </div>
                </div>
            </div>

            <Footer />

            <AsesoriaPrivadaModal isOpen={isModalOpen} onClose={closeModal} />

            <EditarPerfilModal
                isOpen={isEditarPerfilOpen}
                onClose={closeEditarPerfil}
                usuario={usuario}
                onGuardar={guardarPerfil}
            />

            {/* Modal para solicitar plan de cremación */}
            <CremacionPlanModal 
                isOpen={isPlanModalOpen}
                onClose={closePlanModal}
                planType={selectedPlan}
                onSubmit={handlePlanSubmit}
            />
        </div>
    );
};

export default Cremacion;