import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PlanFunerario.css';

const Fondo = "https://storage.googleapis.com/uxpilot-auth.appspot.com/6d652cea1f-d8ed739fd56344770b38.png";
const Familia = "https://storage.googleapis.com/uxpilot-auth.appspot.com/7352741237-ea9657fb30618a722ad9.png";
const Plan_Basico = "https://storage.googleapis.com/uxpilot-auth.appspot.com/c30fc49b7f-e594311283f960ed13aa.png";
const Plan_Estandar = "https://storage.googleapis.com/uxpilot-auth.appspot.com/a8d9cbc0d0-20f4d744a1860ee0d103.png";
const Plan_Premium = "https://storage.googleapis.com/uxpilot-auth.appspot.com/5f7d583b77-e2164749d2f07316421c.png";

// Datos del Navbar
const servicesData = [
    { name: "Funeral Tradicional", path: "/servicios/tradicional" },
    { name: "Cremación", path: "/servicios/cremacion" },
    { name: "Plan Funerario", path: "/servicios/plan" },
    { name: "Urnas", path: "/servicios/urnas" }
];

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

                    <Link to="/testimonios" className="nav-item">Testimonios</Link>
                    <Link to="/contacto" className="nav-item">Contacto</Link>
                </div>

                {usuario ? (
                    <div
                        className="nav-item nav-dropdown"
                        ref={userDropdownRef}
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                        <span>Bienvenido, {usuario.nombre_completo}</span>
                        <span className="dropdown-arrow">▼</span>

                        {isUserDropdownOpen && (
                            <div className="dropdown-menu">
                                <button className="dropdown-item" onClick={handleEditarPerfil}>
                                    ✏️ Editar Cuenta
                                </button>
                                <button className="dropdown-item" onClick={handleCerrarSesion}>
                                    🚪 Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="nav-login-button">
                            Iniciar Sesión
                        </button>
                    </Link>
                )}
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

const BaseModal = ({ isOpen, onClose, children, className = "" }) => {
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal-content ${className}`} ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

// MODAL PLAN BASICO
const ModalBasico = ({ isOpen, onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Gracias! Hemos recibido tu solicitud para el Plan Basico. Nos contactaremos contigo en breve.');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="modal-header">
                <h2>Plan Basico</h2>
                <p>Complete el formulario para obtener su Plan Basico</p>
            </div>

            <form className="asesoria-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="nombre-basico">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombre-basico"
                            required
                            placeholder="Ingrese su nombre completo"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="telefono-basico">Teléfono *</label>
                        <input
                            type="tel"
                            id="telefono-basico"
                            required
                            placeholder="Ej: +51 999 888 777"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="email-basico">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email-basico"
                        placeholder="su@email.com"
                    />
                </div>

                <div className="benefits-notice">
                    <h4>Resumen del Plan Basico</h4>
                    <ul>
                        <li>Servicio de cremación simple o sepelio</li>
                        <li>Asesoría legal y documentación básica</li>
                        <li>Traslado local dentro de la ciudad</li>
                        <li>Urna o ataúd estándar</li>
                    </ul>
                    <p className="plan-price">Desde: <strong>S/ 1,650</strong></p>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="submit-button basic-btn">
                        Solicitar Plan Básico
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// MODAL PLAN ESTANDAR
const ModalEstandar = ({ isOpen, onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Gracias! Hemos recibido tu solicitud para el Plan Estándar. Un asesor se contactará contigo para personalizar tu plan.');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className="modal-header">
                <h2>Plan Estándar</h2>
                <p>Complete el formulario para personalizar su Plan Estándar</p>
            </div>

            <form className="asesoria-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="nombre-estandar">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombre-estandar"
                            required
                            placeholder="Ingrese su nombre completo"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="telefono-estandar">Teléfono *</label>
                        <input
                            type="tel"
                            id="telefono-estandar"
                            required
                            placeholder="Ej: +51 999 888 777"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="preferencias">Preferencias de Servicio</label>
                    <select id="preferencias">
                        <option value="">Seleccione sus preferencias</option>
                        <option value="velacion">Velación de 24 horas</option>
                        <option value="flores">Arreglos florales incluidos</option>
                        <option value="catering">Catering ligero</option>
                        <option value="todos">Todos los servicios</option>
                    </select>
                </div>

                <div className="benefits-notice">
                    <h4> Resumen del Plan Estándar</h4>
                    <ul>
                        <li>Servicio integral con velación de 24 horas</li>
                        <li>Sala de velación privada y arreglos florales</li>
                        <li>Gestión completa de trámites</li>
                        <li>Opciones mejoradas de urnas o ataúdes</li>
                        <li>Catering ligero para asistentes (opcional)</li>
                    </ul>
                    <p className="plan-price">Desde: <strong>S/ 3,000</strong></p>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="submit-button standard-btn">
                        Personalizar Plan Estándar
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// MODAL PLAN PREMIUM
const ModalPremium = ({ isOpen, onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Excelente elección! Hemos recibido tu solicitud para el Plan Premium. Nuestro director de servicios premium se contactará contigo personalmente.');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} className="premium-modal">
            <div className="modal-header premium-header">
                <h2>Plan Premium</h2>
                <p>Complete el formulario para acceder a nuestro servicio premium</p>
            </div>

            <form className="asesoria-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="nombre-premium">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombre-premium"
                            required
                            placeholder="Ingrese su nombre completo"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="telefono-premium">Teléfono *</label>
                        <input
                            type="tel"
                            id="telefono-premium"
                            required
                            placeholder="Ej: +51 999 888 777"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="empresa">Empresa (si aplica)</label>
                        <input
                            type="text"
                            id="empresa"
                            placeholder="Nombre de su empresa"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cargo">Cargo</label>
                        <input
                            type="text"
                            id="cargo"
                            placeholder="Su cargo en la empresa"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="requerimientos">Requerimientos Específicos</label>
                    <textarea
                        id="requerimientos"
                        rows="3"
                        placeholder="Describa cualquier requerimiento especial o servicio personalizado que necesite..."
                    ></textarea>
                </div>

                <div className="benefits-notice premium-summary">
                    <h4>Beneficios Exclusivos Premium</h4>
                    <ul>
                        <li>Servicio de lujo totalmente personalizado</li>
                        <li>Traslados nacionales o internacionales</li>
                        <li>Asesoría testamentaria y legal avanzada</li>
                        <li>Selección de urnas o ataúdes de alta gama</li>
                        <li>Servicio de seguimiento y apoyo en el duelo</li>
                        <li>Asesor personal asignado 24/7</li>
                    </ul>
                    <p className="plan-price">Consultar precio personalizado</p>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="submit-button premium-btn">
                        Solicitar Asesoría Premium
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

// MODAL COTIZACION
const ModalCotizacion = ({ isOpen, onClose }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('¡Gracias por su interés! Hemos recibido su solicitud de cotización personalizada. Un especialista se contactará con usted dentro de las próximas 24 horas para discutir los detalles de su plan único.');
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} className="cotizacion-modal">
            <div className="modal-header">
                <h2>Diseñe Su Plan Funerario Personalizado</h2>
                <p>Complete los siguientes detalles para que nuestro especialista pueda empezar a crear una cotización única para usted.</p>
            </div>

            <form className="asesoria-form" onSubmit={handleSubmit}>
                {/*SECCIÓN DE INFORMACIÓN DE CONTACTO*/}
                <h3>1. Información de Contacto</h3>
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="nombre-cotizacion">Nombre Completo *</label>
                        <input type="text" id="nombre-cotizacion" required placeholder="Ingrese su nombre completo" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="telefono-cotizacion">Teléfono *</label>
                        <input type="tel" id="telefono-cotizacion" required placeholder="Ej: +51 999 888 777" />
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="email-cotizacion">Correo Electrónico *</label>
                    <input type="email" id="email-cotizacion" required placeholder="su@email.com" />
                </div>

                {/*DETALLES BASICOS DEL SERVICIO*/}
                <h3>2. Preferencias Principales</h3>
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="tipo-servicio">Tipo de Plan</label>
                        <select id="tipo-servicio" required defaultValue="personalizado" readOnly>
                            <option value="personalizado">Servicio Personalizado</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="destino-final">Destino Final</label>
                        <select id="destino-final" required>
                            <option value="">Seleccione el destino</option>
                            <option value="cremacion">Cremación</option>
                            <option value="entierro">Entierro / Inhumación</option>
                            <option value="ambos">Servicio con velatorio y luego cremación</option>
                            <option value="otros">Otros (Detallar en comentarios)</option>
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="presupuesto-personalizado">Presupuesto Estimado (Ayuda a enfocar las opciones)</label>
                    <select id="presupuesto-personalizado">
                        <option value="">Seleccione un rango</option>
                        <option value="5000-10000">S/ 5,000 - 10,000</option>
                        <option value="10000-20000">S/ 10,000 - 20,000</option>
                        <option value="20000+">Más de S/ 20,000</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>

                {/*SECCIÓN DE PERSONALIZACIÓN*/}
                <h3>3. Elementos de Personalización</h3>

                <div className="input-group">
                    <label>Tipo y Duración de la Ceremonia</label>
                    <textarea
                        id="detalles-ceremonia"
                        rows="3"
                        placeholder="Ej: Ceremonia de celebración de vida, no religiosa, de 3 horas de duración. Máximo 80 invitados. En un lugar al aire libre."
                    ></textarea>
                </div>

                <div className="input-group">
                    <label>Requerimientos de Música / Decoración / Temática</label>
                    <textarea
                        id="detalles-tematica"
                        rows="3"
                        placeholder="Ej: Queremos música de jazz en vivo, no queremos flores, preferimos una exhibición de fotografías y objetos de pesca."
                    ></textarea>
                </div>

                {/*CAMPO BLIGATORIO DE CREMACION */}
                <div className="input-group" id="opcion-cremacion-condicional">
                    <label htmlFor="urna-personalizada">Detalles de Urna / Cenizas (Solo si eligió Cremación)</label>
                    <input
                        type="text"
                        id="urna-personalizada"
                        placeholder="Ej: Urna de madera artesanal, o queremos dividir las cenizas en 3 urnas pequeñas."
                    />
                </div>

                {/* CAMPO OBLIGATORIO DEL ENTIERRO */}
                <div className="input-group" id="opcion-entierro-condicional">
                    <label htmlFor="ataud-personalizado">Detalles de Ataúd / Lápida (Solo si eligió Entierro)</label>
                    <input
                        type="text"
                        id="ataud-personalizado"
                        placeholder="Ej: Ataúd ecológico de bambú, o requerimos una lápida personalizada con grabado especial."
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="catering">Recepción o Catering para Invitados</label>
                    <select id="catering">
                        <option value="no-requerido">No requerido</option>
                        <option value="basico">Cafetería básica (café, té, galletas)</option>
                        <option value="catering-ligero">Catering ligero (snacks, bebidas)</option>
                        <option value="catering-completo">Catering completo (comida formal)</option>
                    </select>
                </div>

                {/*COMENTARIOS*/}
                <h3>4. Comentarios Adicionales</h3>
                <div className="input-group">
                    <label htmlFor="comentarios">Cualquier otra solicitud o pregunta</label>
                    <textarea
                        id="comentarios"
                        rows="4"
                        placeholder="Ej: Necesitamos traslado desde otra ciudad, o apoyo con la asesoría legal de un testamento."
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="submit-button cotizacion-btn">
                        Solicitar Diseño y Cotización
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

const ValorCard = ({ emoji, title, description, color }) => (
    <div className="valor-card" style={{ backgroundColor: color }}>
        <div className="valor-icon-container">
            <span className="valor-emoji">{emoji}</span>
        </div>
        <h4 className="valor-title">{title}</h4>
        <p className="valor-description">{description}</p>
    </div>
);

const HowItWorksStep = ({ emoji, title, description }) => (
    <div className="how-it-works-step">
        <div className="step-icon-container">
            <span className="step-emoji">{emoji}</span>
        </div>
        <h4 className="step-title">{title}</h4>
        <p className="step-description">{description}</p>
    </div>
);

const PlanCard = ({ title, priceTag, features, bgColor, borderColor, buttonColor, imageUrl, onButtonClick }) => (
    <div className="plan-card" style={{ backgroundColor: bgColor }}>
        <div className="plan-header">
            <img
                src={imageUrl}
                alt={title}
                className="plan-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/CCCCCC/333333?text=Plan+Imagen"; }}
            />
            <div className="plan-price-tag" style={{ backgroundColor: borderColor }}>
                {priceTag}
            </div>
            <h3 className="plan-title">{title}</h3>
        </div>

        <ul className="plan-features">
            {features.map((feature, index) => (
                <li key={index} className="plan-feature">
                    <span className="feature-check">✓</span>
                    <span className="feature-text">{feature}</span>
                </li>
            ))}
        </ul>

        <div className="plan-action">
            <button
                className="plan-button"
                style={{ backgroundColor: buttonColor }}
                onClick={onButtonClick}
            >
                {`Obtener ${title.split(' ')[1]}`}
            </button>
        </div>
    </div>
);

// Diseño de la pagina
const PlanFunerario = () => {
    const [modalBasicoOpen, setModalBasicoOpen] = useState(false);
    const [modalEstandarOpen, setModalEstandarOpen] = useState(false);
    const [modalPremiumOpen, setModalPremiumOpen] = useState(false);
    const [modalCotizacionOpen, setModalCotizacionOpen] = useState(false);

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

    const planes = [
        {
            title: "Plan Basico",
            priceTag: "$ Básico",
            features: [
                "Servicio de cremación simple o sepelio.",
                "Asesoría legal y documentación básica.",
                "Traslado local dentro de la ciudad.",
                "Urna o ataúd estándar (según el plan)."
            ],
            bgColor: '#F8F1FF',
            borderColor: '#A855F7',
            buttonColor: '#A855F7',
            imageUrl: Plan_Basico,
            onButtonClick: () => setModalBasicoOpen(true)
        },
        {
            title: "Plan Estandar",
            priceTag: "$$ Estándar",
            features: [
                "Servicio integral con velación de 24 horas.",
                "Sala de velación privada y arreglos florales.",
                "Gestión completa de trámites.",
                "Opciones mejoradas de urnas o ataúdes.",
                "Catering ligero para asistentes (opcional)."
            ],
            bgColor: '#FFF5F7',
            borderColor: '#EC4899',
            buttonColor: '#EC4899',
            imageUrl: Plan_Estandar,
            onButtonClick: () => setModalEstandarOpen(true)
        },
        {
            title: "Plan Premium",
            priceTag: "$$$ Premium",
            features: [
                "Servicio de lujo y totalmente personalizado.",
                "Traslados nacionales o internacionales.",
                "Asesoría testamentaria y legal avanzada.",
                "Selección de urnas o ataúdes de alta gama.",
                "Servicio de seguimiento y apoyo en el duelo."
            ],
            bgColor: '#FFFDF0',
            borderColor: '#F59E0B',
            buttonColor: '#F59E0B',
            imageUrl: Plan_Premium,
            onButtonClick: () => setModalPremiumOpen(true)
        }
    ];

    return (
        <div className="plan-funerario-page">

            {/*NAVBAR */}
            <Navbar
                services={servicesData}
                usuario={usuario}
                onEditarPerfil={openEditarPerfil}
                onCerrarSesion={cerrarSesion}
            />

            {/* SECCION HERO */}
            <div
                className="hero-section-plan"
                style={{
                    backgroundImage: `url(${Fondo}), linear-gradient(to top, #333333, #555555)`
                }}
            >
                <div className="hero-content-plan">
                    <h1 className="hero-title-plan">
                        Plan funerario
                    </h1>
                    <p className="hero-subtitle-plan">
                        Tranquilidad hoy, dignidad mañana.
                    </p>
                    <button
                        className="hero-button-plan"
                        onClick={() => setModalCotizacionOpen(true)}
                    >
                        Ver planes
                    </button>
                </div>
                <div className="hero-overlay-plan"></div>
            </div>

            <div id="about" className="about-section-plan">
                <div className="intro-container-plan">
                    <div className="intro-text-plan">
                        <p className="intro-main-text-plan">
                            Planificar con anticipación brinda una <strong>tranquilidad</strong> invaluable, asegurando que su familia pueda concentrarse en lo que más importa: <strong>celebrar la vida</strong>, en lugar de tomar decisiones apresuradas en momentos difíciles.
                        </p>
                        <p className="intro-secondary-text-plan">
                            Con una preposición cuidadosa hoy, usted establece la seguridad y la certeza de que su deseo será honrado para el futuro.
                        </p>
                    </div>
                    <div className="intro-image-plan">
                        <img
                            src={Familia}
                            alt="Familia caminando"
                            className="family-image"
                        />
                    </div>
                </div>

                <h2 className="values-title-plan">Nuestros Valores</h2>
                <p className="values-subtitle-plan">
                    Los principios que nos guían al servir a las familias con compasión y dignidad.
                </p>

                <div className="values-grid-plan">
                    <ValorCard
                        emoji="💖"
                        title="Respeto"
                        description="Honramos cada vida con dignidad y serenidad, justo como se merece."
                        color="#F8F1FF"
                    />
                    <ValorCard
                        emoji="📖"
                        title="Personalización"
                        description="Servicios diseñados a medida para reflejar la esencia de la persona."
                        color="#FFF5F7"
                    />
                    <ValorCard
                        emoji="👥"
                        title="Apoyo"
                        description="Acompañamiento profesional y cálido en cada etapa del proceso."
                        color="#F8F1FF"
                    />
                    <ValorCard
                        emoji="✓"
                        title="Tranquilidad"
                        description="Garantía de cumplimiento y claridad en todos los trámites."
                        color="#FFF5F7"
                    />
                </div>
            </div>

            <div className="how-it-works-section-plan">
                <div className="how-it-works-container-plan">
                    <h2 className="how-it-works-title-plan">Cómo funciona</h2>

                    <div className="steps-container-plan">
                        <div className="steps-line-plan"></div>

                        <HowItWorksStep
                            emoji="📞"
                            title="Contacto y Asesoría"
                            description="Llámenos para una consulta confidencial."
                        />
                        <HowItWorksStep
                            emoji="🔢"
                            title="Definición del Plan"
                            description="Escogemos las coberturas que necesita su familia."
                        />
                        <HowItWorksStep
                            emoji="💰"
                            title="Cálculo del Costo"
                            description="Definimos el pago según el plan y sus preferencias."
                        />
                        <HowItWorksStep
                            emoji="🎁"
                            title="Activación Inmediata"
                            description="Su plan queda disponible desde el primer pago."
                        />
                    </div>
                </div>
            </div>

            <div id="plans" className="plans-section-plan">
                <div className="plans-container-plan">
                    <h2 className="plans-title-plan">Elige tu plan hoy</h2>

                    <div className="plans-grid-plan">
                        {planes.map(plan => (
                            <PlanCard
                                key={plan.title}
                                title={plan.title}
                                priceTag={plan.priceTag}
                                features={plan.features}
                                bgColor={plan.bgColor}
                                borderColor={plan.borderColor}
                                buttonColor={plan.buttonColor}
                                imageUrl={plan.imageUrl}
                                onButtonClick={plan.onButtonClick}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div
                id="contact-cta"
                className="cta-section-plan"
            >
                <div className="cta-container-plan">
                    <h2 className="cta-title-plan">
                        Planifica hoy, triunfa mañana
                    </h2>
                    <p className="cta-description-plan">
                        Da el primer paso para asegurar la tranquilidad de tu familia con un plan funerario personalizado.
                    </p>
                    <button
                        className="cta-button-plan"
                        onClick={() => setModalCotizacionOpen(true)}
                    >
                        Personaliza tu plan funerario
                    </button>
                </div>
            </div>

            <Footer />

            <ModalBasico
                isOpen={modalBasicoOpen}
                onClose={() => setModalBasicoOpen(false)}
            />
            <ModalEstandar
                isOpen={modalEstandarOpen}
                onClose={() => setModalEstandarOpen(false)}
            />
            <ModalPremium
                isOpen={modalPremiumOpen}
                onClose={() => setModalPremiumOpen(false)}
            />
            <ModalCotizacion
                isOpen={modalCotizacionOpen}
                onClose={() => setModalCotizacionOpen(false)}
            />

            <EditarPerfilModal
                isOpen={isEditarPerfilOpen}
                onClose={closeEditarPerfil}
                usuario={usuario}
                onGuardar={guardarPerfil}
            />

        </div>
    );
};

export default PlanFunerario;