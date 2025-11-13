import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const generateStars = (rating) => {
    return Array(rating).fill('⭐').join('');
};

// Modal de editar cuenta
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

    //Cargar datos del usuario para el modal edit
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
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                            placeholder="Tu número telefónico"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Nueva Contraseña (opcional)</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
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

//Modal del formulario de asesoria MEJORADO
const AsesoriaModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        ciudad: '',
        tipo_servicio: '',
        tipo_ceremonia: '',
        ubicacion_ceremonia: '',
        tipo_ataud: '',
        tipo_cremacion: '',
        urna: '',
        transporte: '',
        flores: '',
        adicionales: [],
        fecha_servicio: '',
        cantidad_asistentes: '',
        mensaje: ''
    });

    const [precioCalculado, setPrecioCalculado] = useState(0);
    const [desglosePrecio, setDesglosePrecio] = useState([]);

    // Precios base según investigación del mercado peruano
    const precios = {
        servicios: {
            'funeral-tradicional': 3500,
            'cremacion': 2500,
            'plan-funerario': 1800,
            'urna-basica': 800,
            'memorial': 1200
        },
        ceremonias: {
            'intima': 500,
            'familiar': 1000,
            'comunitaria': 2000,
            'privada': 1500
        },
        ubicaciones: {
            'capilla-propia': 0,
            'domicilio': 800,
            'iglesia': 1200,
            'aire-libre': 600
        },
        ataúdes: {
            'basico': 800,
            'estandar': 1500,
            'premium': 3000,
            'lujo': 5000
        },
        cremaciones: {
            'fuego-tradicional': 0,
            'acuamacion': 800,
            'verde': 1200
        },
        urnas: {
            'madera-basica': 0,
            'ceramica': 300,
            'metal': 500,
            'cristal': 800,
            'biodegradable': 200
        },
        transportes: {
            'basico': 0,
            'florido': 400,
            'limusina': 800,
            'especial': 600
        },
        flores: {
            'ninguna': 0,
            'basico': 200,
            'estandar': 400,
            'premium': 800
        },
        adicionales: {
            'video-memorial': 600,
            'libro-condolencias': 100,
            'recordatorios': 200,
            'musica-en-vivo': 400,
            'catering': 800,
            'seguro-funerario': 300
        }
    };

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

    // Calcular precio automáticamente cuando cambien los datos del formulario
    useEffect(() => {
        calcularPrecio();
    }, [formData]);

    const calcularPrecio = () => {
        let total = 0;
        const desglose = [];

        // Servicio principal
        if (formData.tipo_servicio && precios.servicios[formData.tipo_servicio]) {
            total += precios.servicios[formData.tipo_servicio];
            desglose.push({
                concepto: 'Servicio Principal',
                precio: precios.servicios[formData.tipo_servicio]
            });
        }

        // Tipo de ceremonia
        if (formData.tipo_ceremonia && precios.ceremonias[formData.tipo_ceremonia]) {
            total += precios.ceremonias[formData.tipo_ceremonia];
            desglose.push({
                concepto: 'Tipo de Ceremonia',
                precio: precios.ceremonias[formData.tipo_ceremonia]
            });
        }

        // Ubicación
        if (formData.ubicacion_ceremonia && precios.ubicaciones[formData.ubicacion_ceremonia]) {
            total += precios.ubicaciones[formData.ubicacion_ceremonia];
            desglose.push({
                concepto: 'Ubicación de Ceremonia',
                precio: precios.ubicaciones[formData.ubicacion_ceremonia]
            });
        }

        // Ataúd (solo para funeral tradicional)
        if (formData.tipo_servicio === 'funeral-tradicional' && formData.tipo_ataud && precios.ataúdes[formData.tipo_ataud]) {
            total += precios.ataúdes[formData.tipo_ataud];
            desglose.push({
                concepto: 'Ataúd Seleccionado',
                precio: precios.ataúdes[formData.tipo_ataud]
            });
        }

        // Cremación (solo para servicio de cremación)
        if (formData.tipo_servicio === 'cremacion' && formData.tipo_cremacion && precios.cremaciones[formData.tipo_cremacion]) {
            total += precios.cremaciones[formData.tipo_cremacion];
            desglose.push({
                concepto: 'Tipo de Cremación',
                precio: precios.cremaciones[formData.tipo_cremacion]
            });
        }

        // Urna
        if (formData.urna && precios.urnas[formData.urna]) {
            total += precios.urnas[formData.urna];
            desglose.push({
                concepto: 'Urna Seleccionada',
                precio: precios.urnas[formData.urna]
            });
        }

        // Transporte
        if (formData.transporte && precios.transportes[formData.transporte]) {
            total += precios.transportes[formData.transporte];
            desglose.push({
                concepto: 'Servicio de Transporte',
                precio: precios.transportes[formData.transporte]
            });
        }

        // Flores
        if (formData.flores && precios.flores[formData.flores]) {
            total += precios.flores[formData.flores];
            desglose.push({
                concepto: 'Arreglos Florales',
                precio: precios.flores[formData.flores]
            });
        }

        // Servicios adicionales
        formData.adicionales.forEach(adicional => {
            if (precios.adicionales[adicional]) {
                total += precios.adicionales[adicional];
                desglose.push({
                    concepto: `Servicio Adicional: ${adicional.replace('-', ' ')}`,
                    precio: precios.adicionales[adicional]
                });
            }
        });

        setPrecioCalculado(total);
        setDesglosePrecio(desglose);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                adicionales: checked 
                    ? [...prev.adicionales, value]
                    : prev.adicionales.filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    const datosCompletos = {
        ...formData,
        precio_calculado: precioCalculado,
        desglose_precio: desglosePrecio
    };

    try {
        const response = await fetch("http://localhost:5000/api/asesoria-general", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCompletos)
        });

        if (!response.ok) {
            throw new Error("Error al enviar los datos");
        }

        const data = await response.json();
        console.log("Datos guardados en la base:", data);

        alert(`✅ ¡Gracias! Hemos recibido tu solicitud.\nPrecio estimado: S/ ${precioCalculado.toLocaleString('es-PE')}`);
        onClose();
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Hubo un error al enviar tu solicitud.");
    }

    // Resetear formulario
    setFormData({
        nombre: '',
        telefono: '',
        email: '',
        ciudad: '',
        tipo_servicio: '',
        tipo_ceremonia: '',
        ubicacion_ceremonia: '',
        tipo_ataud: '',
        tipo_cremacion: '',
        urna: '',
        transporte: '',
        flores: '',
        adicionales: [],
        fecha_servicio: '',
        cantidad_asistentes: '',
        mensaje: ''
    });
};


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content asesoria-modal-improved" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Solicitar Asesoría Personalizada 24/7</h2>
                    <p>Complete el formulario para recibir una cotización exacta y personalizada</p>
                </div>

                <form className="asesoria-form-improved" onSubmit={handleSubmit}>
                    {/* Sección 1: Información Personal */}
                    <div className="form-section">
                        <h3 className="section-title">👤 Información Personal</h3>
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
                                    placeholder="+51 999 888 777"
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
                                <label htmlFor="ciudad">Ciudad y Distrito *</label>
                                <input
                                    type="text"
                                    id="ciudad"
                                    name="ciudad"
                                    value={formData.ciudad}
                                    onChange={handleChange}
                                    placeholder="Ej: Lima, Miraflores"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Servicio Principal */}
                    <div className="form-section">
                        <h3 className="section-title">🏛️ Servicio Principal</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="tipo_servicio">Tipo de Servicio *</label>
                                <select 
                                    id="tipo_servicio" 
                                    name="tipo_servicio" 
                                    value={formData.tipo_servicio}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona el servicio principal</option>
                                    <option value="funeral-tradicional">Funeral Tradicional (Desde S/ 3,500)</option>
                                    <option value="cremacion">Cremación (Desde S/ 2,500)</option>
                                    <option value="plan-funerario">Plan Funerario Prepagado (Desde S/ 1,800)</option>
                                    <option value="urna-basica">Solo Urna Básica (Desde S/ 800)</option>
                                    <option value="memorial">Servicio Memorial (Desde S/ 1,200)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="fecha_servicio">Fecha del Servicio</label>
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
                    </div>

                    {/* Sección 3: Detalles de la Ceremonia */}
                    <div className="form-section">
                        <h3 className="section-title">🎭 Detalles de la Ceremonia</h3>
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="tipo_ceremonia">Tipo de Ceremonia *</label>
                                <select 
                                    id="tipo_ceremonia" 
                                    name="tipo_ceremonia" 
                                    value={formData.tipo_ceremonia}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona el tipo</option>
                                    <option value="intima">Ceremonia Íntima (Hasta 20 personas)</option>
                                    <option value="familiar">Ceremonia Familiar (20-50 personas)</option>
                                    <option value="comunitaria">Ceremonia Comunitaria (50+ personas)</option>
                                    <option value="privada">Ceremonia Privada (Solo familia directa)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="ubicacion_ceremonia">Ubicación Preferida *</label>
                                <select 
                                    id="ubicacion_ceremonia" 
                                    name="ubicacion_ceremonia" 
                                    value={formData.ubicacion_ceremonia}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona ubicación</option>
                                    <option value="capilla-propia">Capilla Draumheim (Incluido)</option>
                                    <option value="domicilio">Domicilio (+S/ 800)</option>
                                    <option value="iglesia">Iglesia (+S/ 1,200)</option>
                                    <option value="aire-libre">Al Aire Libre (+S/ 600)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Opciones Específicas según Servicio */}
                    {formData.tipo_servicio === 'funeral-tradicional' && (
                        <div className="form-section">
                            <h3 className="section-title">⚰️ Opciones para Funeral Tradicional</h3>
                            <div className="input-group">
                                <label htmlFor="tipo_ataud">Tipo de Ataúd *</label>
                                <select 
                                    id="tipo_ataud" 
                                    name="tipo_ataud" 
                                    value={formData.tipo_ataud}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona el ataúd</option>
                                    <option value="basico">Ataúd Básico (Madera simple, +S/ 800)</option>
                                    <option value="estandar">Ataúd Estándar (Madera calidad, +S/ 1,500)</option>
                                    <option value="premium">Ataúd Premium (Caoba, +S/ 3,000)</option>
                                    <option value="lujo">Ataúd de Lujo (Bronce, +S/ 5,000)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {formData.tipo_servicio === 'cremacion' && (
                        <div className="form-section">
                            <h3 className="section-title">🔥 Opciones para Cremación</h3>
                            <div className="input-group">
                                <label htmlFor="tipo_cremacion">Tipo de Cremación *</label>
                                <select 
                                    id="tipo_cremacion" 
                                    name="tipo_cremacion" 
                                    value={formData.tipo_cremacion}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona el tipo</option>
                                    <option value="fuego-tradicional">Cremación con Fuego (Tradicional)</option>
                                    <option value="acuamacion">Acuamación (+S/ 800)</option>
                                    <option value="verde">Cremación Verde Ecológica (+S/ 1,200)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Sección 5: Urnas y Memoriales */}
                    <div className="form-section">
                        <h3 className="section-title">⚱️ Urna y Memorial</h3>
                        <div className="input-group">
                            <label htmlFor="urna">Tipo de Urna</label>
                            <select 
                                id="urna" 
                                name="urna" 
                                value={formData.urna}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una urna</option>
                                <option value="madera-basica">Urna Básica de Madera (Incluida)</option>
                                <option value="ceramica">Urna de Cerámica (+S/ 300)</option>
                                <option value="metal">Urna de Metal (+S/ 500)</option>
                                <option value="cristal">Urna de Cristal (+S/ 800)</option>
                                <option value="biodegradable">Urna Biodegradable (+S/ 200)</option>
                            </select>
                        </div>
                    </div>

                    {/* Sección 6: Servicios Adicionales */}
                    <div className="form-section">
                        <h3 className="section-title">🎵 Servicios Adicionales</h3>
                        
                        <div className="input-group">
                            <label htmlFor="transporte">Servicio de Transporte</label>
                            <select 
                                id="transporte" 
                                name="transporte" 
                                value={formData.transporte}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona transporte</option>
                                <option value="basico">Transporte Básico (Incluido)</option>
                                <option value="florido">Carroza Florida (+S/ 400)</option>
                                <option value="limusina">Limusina Fúnebre (+S/ 800)</option>
                                <option value="especial">Transporte Especial (+S/ 600)</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="flores">Arreglos Florales</label>
                            <select 
                                id="flores" 
                                name="flores" 
                                value={formData.flores}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona flores</option>
                                <option value="ninguna">Sin flores</option>
                                <option value="basico">Ramo Básico (+S/ 200)</option>
                                <option value="estandar">Arreglo Estándar (+S/ 400)</option>
                                <option value="premium">Arreglo Premium (+S/ 800)</option>
                            </select>
                        </div>

                        <div className="checkbox-group">
                            <label>Servicios Adicionales:</label>
                            <div className="checkboxes">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="adicionales" 
                                        value="video-memorial" 
                                        onChange={handleChange}
                                        checked={formData.adicionales.includes('video-memorial')}
                                    />
                                    <span className="checkmark"></span>
                                    Video Memorial (+S/ 600)
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="adicionales" 
                                        value="libro-condolencias" 
                                        onChange={handleChange}
                                        checked={formData.adicionales.includes('libro-condolencias')}
                                    />
                                    <span className="checkmark"></span>
                                    Libro de Condolencias (+S/ 100)
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="adicionales" 
                                        value="recordatorios" 
                                        onChange={handleChange}
                                        checked={formData.adicionales.includes('recordatorios')}
                                    />
                                    <span className="checkmark"></span>
                                    Recordatorios (+S/ 200)
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="adicionales" 
                                        value="musica-en-vivo" 
                                        onChange={handleChange}
                                        checked={formData.adicionales.includes('musica-en-vivo')}
                                    />
                                    <span className="checkmark"></span>
                                    Música en Vivo (+S/ 400)
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="adicionales" 
                                        value="catering" 
                                        onChange={handleChange}
                                        checked={formData.adicionales.includes('catering')}
                                    />
                                    <span className="checkmark"></span>
                                    Servicio de Catering (+S/ 800)
                                </label>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="adicionales" 
                                        value="seguro-funerario" 
                                        onChange={handleChange}
                                        checked={formData.adicionales.includes('seguro-funerario')}
                                    />
                                    <span className="checkmark"></span>
                                    Seguro Funerario (+S/ 300)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Sección 7: Mensaje Adicional */}
                    <div className="form-section">
                        <h3 className="section-title">💬 Información Adicional</h3>
                        <div className="input-group">
                            <label htmlFor="mensaje">Mensaje o Requerimientos Especiales</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                placeholder="Describe cualquier requerimiento especial, preferencias religiosas, restricciones dietéticas, o información adicional que debamos conocer..."
                                rows="4"
                            ></textarea>
                        </div>
                    </div>

                    {/* Sección 8: Resumen de Precio */}
                    <div className="price-summary">
                        <h3 className="price-title">Resumen de Cotización</h3>
                        <div className="price-breakdown">
                            {desglosePrecio.map((item, index) => (
                                <div key={index} className="price-item">
                                    <span className="price-concept">{item.concepto}</span>
                                    <span className="price-amount">S/ {item.precio.toLocaleString('es-PE')}</span>
                                </div>
                            ))}
                            <div className="price-total">
                                <span className="total-label">TOTAL ESTIMADO:</span>
                                <span className="total-amount">S/ {precioCalculado.toLocaleString('es-PE')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions-improved">
                        <button type="button" className="cancel-button-improved" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button-improved">
                            📨 Enviar Solicitud con Cotización
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const homeData = {
    services: [
        { name: "Funeral Tradicional", path: "/servicios/tradicional" },
        { name: "Cremación", path: "/servicios/cremacion" },
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
        }
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

// Página de Inicio
function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditarPerfilOpen, setIsEditarPerfilOpen] = useState(false);
    const [usuario, setUsuario] = useState(null);

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

    //guardar cambios
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

            console.log('Datos del servidor:', data.usuario);
            console.log('Usuario actual:', usuario);
            
            // Actualizar localStorage y estado
            const nuevoUsuario = { ...usuario, ...data.usuario };
            localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
            setUsuario(nuevoUsuario);
            
            return data;
        } catch (error) {
            throw error;
        }
    };

    //Cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('usuario');
        setUsuario(null);
        window.location.reload();
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openEditarPerfil = () => setIsEditarPerfilOpen(true);
    const closeEditarPerfil = () => setIsEditarPerfilOpen(false);

    return (
        <div className="home-page-container">
            <Navbar 
                services={homeData.services} 
                usuario={usuario}
                onEditarPerfil={openEditarPerfil}
                onCerrarSesion={cerrarSesion}
            />

            <main className="main-content">
                {/*SECCION HERO */}
                <header className="hero-section">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="animate-fadeInDown">En cada despedida buscamos transformar el duelo en un homenaje lleno de amor.</h1>
                        <p className="animate-fadeInUp">Apoyar a las familias con calidez humana y brindar un servicio digno que honre la memoria de quienes se van, fabricando huellas inolvidables en nuestros corazones.</p>
                        <button onClick={openModal} className="cta-button animate-bounceIn">
                            Solicitar Asesoría 24/7
                        </button>
                    </div>
                </header>

                <section className="about-section">
                    <div className="about-text">
                        <h3>Sobre Draumheim: Más de tres décadas de compasión</h3>
                        <p>Durante más de tres décadas, Draumheim ha sido un ejemplo de compasión y dignidad en nuestra comunidad. Entendemos que despedirse nunca es fácil, por eso nos dedicamos a crear homenajes significativos que celebran vidas y brindan consuelo en momentos difíciles.</p>
                        <p>Nuestra misión va más allá de los servicios; es acompañar, respetar y preservar el legado de cada ser querido.</p>
                        <Link to="/nosotros" className="learn-more-link">Leer más sobre nuestra historia →</Link>
                    </div>
                    <div className="about-image">
                        <img src="/imghomepage2.png" alt="Arreglo floral dentro de una iglesia" />
                    </div>
                </section>

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
                                <Link to={service.path} className="service-link">Ver detalles</Link>
                            </div>
                        ))}
                    </div>
                </section>

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

            {/*FOOTER*/}
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

            <AsesoriaModal isOpen={isModalOpen} onClose={closeModal} />
            
            <EditarPerfilModal 
                isOpen={isEditarPerfilOpen}
                onClose={closeEditarPerfil}
                usuario={usuario}
                onGuardar={guardarPerfil}
            />
        </div>
    );
}

export default HomePage;