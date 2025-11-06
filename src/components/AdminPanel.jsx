import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [vistaActiva, setVistaActiva] = useState('solicitudes'); // 'solicitudes' o 'productos'
    const [solicitudes, setSolicitudes] = useState([]);
    //PAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    const [clientes, setClientes] = useState([]);
    const [ModalClienteAbierto, setModalClienteAbierto] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);
    const [formCliente, setFormCliente] = useState({
        usuario_id: '',
        nombre_completo: '',
        dni: '',
        telefono: '',
        email: '',
        direccion: '',
        numero_espacios: 1, // Default 1
        ubicacion_espacios: '',
        estado: 'activo', // Default 'activo'
        observaciones: '',
        // fecha_registro y fecha_creacion se auto-generarán
    });
    //PAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
    const [productos, setProductos] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('todas');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [cargando, setCargando] = useState(true);
    const [modalProductoAbierto, setModalProductoAbierto] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);
    const [formProducto, setFormProducto] = useState({
        nombre: '',
        categoria: '',
        material: '',
        precio: '',
        stock: '',
        descripcion: '',
        descripcion_larga: '',
        imagen_url: '',
        dimensiones: '',
        peso_kg: '',
        capacidad_ml: '',
        destacado: false
    });

    // TIPOS DE SOLICITUD CON ICONOS Y COLORES MEJORADOS
    const tiposSolicitud = {
        asesoria_24_7: { 
            nombre: 'Asesoría 24/7', 
            color: '#FF6B6B', 
            icono: '🚨',
            bgColor: '#FFF5F5'
        },
        asesoria_privada: { 
            nombre: 'Asesoría Privada', 
            color: '#4ECDC4', 
            icono: '👥',
            bgColor: '#F0FFFC'
        },
        plan_basico: { 
            nombre: 'Plan Básico', 
            color: '#45B7D1', 
            icono: '📦',
            bgColor: '#F0F8FF'
        },
        plan_estandar: { 
            nombre: 'Plan Estándar', 
            color: '#96CEB4', 
            icono: '⭐',
            bgColor: '#F8FFF0'
        },
        plan_premium: { 
            nombre: 'Plan Premium', 
            color: '#FFD93D', 
            icono: '👑',
            bgColor: '#FFFDF0'
        },
        cotizacion_personalizada: { 
            nombre: 'Cotización Personalizada', 
            color: '#DDA0DD', 
            icono: '💰',
            bgColor: '#FDF0FF'
        }
    };

    const estadosSolicitud = {
        nueva: { nombre: 'Nueva', color: '#FF6B6B', icono: '🆕' },
        en_proceso: { nombre: 'En Proceso', color: '#4ECDC4', icono: '🔄' },
        atendida: { nombre: 'Atendida', color: '#96CEB4', icono: '✅' },
        cancelada: { nombre: 'Cancelada', color: '#95A5A6', icono: '❌' }
    };

    const categoriasProductos = {
        1: { nombre: 'Clásicas', color: '#F59E0B', icono: '❤️' },
        2: { nombre: 'Modernas', color: '#10B981', icono: '☀️' },
        3: { nombre: 'Joyas', color: '#A855F7', icono: '💎' }
    };

    // DATOS DE EJEMPLO MEJORADOS - SOLICITUDES
    const solicitudesEjemplo = [
        {
            id_solicitud: 1,
            id_usuario: 1,
            tipo: 'asesoria_24_7',
            estado: 'nueva',
            datos_solicitud: {
                nombre: 'Carlos Rodríguez',
                telefono: '+51 987 654 321',
                email: 'carlos@email.com',
                ciudad: 'Lima',
                servicio: 'funeral-tradicional',
                mensaje: 'Necesito ayuda urgente para un familiar fallecido esta mañana. Requiero orientación inmediata.',
                fallecido: 'María Rodríguez',
                fecha: '2024-01-15'
            },
            fecha_creacion: '2024-01-14T10:30:00Z',
            prioridad: 'alta'
        },
        {
            id_solicitud: 2,
            id_usuario: 2,
            tipo: 'plan_premium',
            estado: 'en_proceso',
            datos_solicitud: {
                nombre: 'Ana García',
                telefono: '+51 987 123 456',
                email: 'ana.garcia@empresa.com',
                empresa: 'Tech Solutions SAC',
                cargo: 'Gerente General',
                requerimientos: 'Servicio internacional para ejecutivo, necesito coordinar traslado desde Estados Unidos.'
            },
            fecha_creacion: '2024-01-14T09:15:00Z',
            prioridad: 'media'
        }
    ];

    // DATOS DE EJEMPLO - PRODUCTOS
    const productosEjemplo = [
        {
            id: 1,
            categoria_id: 1,
            nombre: "Urna Clásica de Nogal",
            descripcion: "Diseño tradicional en madera de nogal macizo",
            descripcion_larga: "Urna elaborada en nogal de primera calidad con acabados brillantes y detalles tallados a mano. Perfecta para ceremonias tradicionales.",
            material: "Madera de nogal",
            precio: 480.00,
            stock: 15,
            imagen_url: "https://placehold.co/400x300/F59E0B/FFFFFF?text=Urna+Nogal",
            dimensiones: "25x25x35 cm",
            peso_kg: 3.5,
            capacidad_ml: 3000,
            destacado: true,
            activo: true
        },
        {
            id: 2,
            categoria_id: 2,
            nombre: "Urna Minimalista Blanca",
            descripcion: "Diseño contemporáneo en resina ecológica",
            descripcion_larga: "Urna moderna con líneas limpias y acabado mate. Fabricada con materiales ecológicos y biodegradables.",
            material: "Resina ecológica",
            precio: 520.00,
            stock: 8,
            imagen_url: "https://placehold.co/400x300/10B981/FFFFFF?text=Urna+Modern",
            dimensiones: "20x20x30 cm",
            peso_kg: 2.8,
            capacidad_ml: 2800,
            destacado: true,
            activo: true
        },
        {
            id: 3,
            categoria_id: 3,
            nombre: "Colgante Corazón Plateado",
            descripcion: "Joyería conmemorativa en plata 925",
            descripcion_larga: "Elegante colgante en forma de corazón que permite conservar una pequeña porción de cenizas. Incluye cadena de plata.",
            material: "Plata 925",
            precio: 280.00,
            stock: 25,
            imagen_url: "https://placehold.co/400x300/A855F7/FFFFFF?text=Joyas",
            dimensiones: "3x3x1 cm",
            peso_kg: 0.05,
            capacidad_ml: 5,
            destacado: false,
            activo: true
        }
    ];

    //PAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
       //DATO EJEMPLO - CLIENTES
const mockClientes = [
    {
        id: 1,
        usuario_id: 101,
        nombre_completo: 'Javier Pérez García',
        dni: '12345678A',
        telefono: '600111222',
        email: 'javier.perez@example.com',
        direccion: 'C/ Falsa 123, Madrid',
        numero_espacios: 2,
        ubicacion_espacios: 'Planta baja, Sector A; Planta alta, Sector B',
        fecha_registro: '2023-10-01',
        estado: 'activo',
        observaciones: 'Cliente VIP, paga puntualmente.',
        fecha_creacion: '2023-10-01T10:00:00Z',
    },
    {
        id: 2,
        usuario_id: 102,
        nombre_completo: 'Laura Martín Soto',
        dni: '98765432B',
        telefono: '600333444',
        email: 'laura.martin@example.com',
        direccion: 'Av. Principal 45, Barcelona',
        numero_espacios: 1,
        ubicacion_espacios: 'Sótano, Plaza 5',
        fecha_registro: '2023-11-15',
        estado: 'pendiente',
        observaciones: 'Esperando confirmación de pago.',
        fecha_creacion: '2023-11-15T15:30:00Z',
    },
    {
        id: 3,
        usuario_id: null,
        nombre_completo: 'Roberto Gómez',
        dni: '55555555Z',
        telefono: '600555666',
        email: 'roberto.gomez@example.com',
        direccion: 'C/ del Sol 20, Sevilla',
        numero_espacios: 3,
        ubicacion_espacios: 'Zona 1, 2 y 3',
        fecha_registro: '2024-01-20',
        estado: 'activo',
        observaciones: null,
        fecha_creacion: '2024-01-20T11:00:00Z',
    },
];

        // Estados para MODAL CLIENTE (NUEVOS)
    const abrirModalCliente = (cliente = null) => {
        if (cliente) {
            setClienteEditando(cliente);
            setFormCliente({
                usuario_id: cliente.usuario_id || '',
                nombre_completo: cliente.nombre_completo,
                dni: cliente.dni,
                telefono: cliente.telefono,
                email: cliente.email,
                direccion: cliente.direccion,
                numero_espacios: cliente.numero_espacios,
                ubicacion_espacios: cliente.ubicacion_espacios || '',
                estado: cliente.estado,
                observaciones: cliente.observaciones || '',
            });
        } else {
            setClienteEditando(null);
            setFormCliente({
                usuario_id: '',
                nombre_completo: '',
                dni: '',
                telefono: '',
                email: '',
                direccion: '',
                numero_espacios: 1,
                ubicacion_espacios: '',
                estado: 'activo',
                observaciones: '',
            });
        }
        setModalClienteAbierto(true);
    };

    const agregarOActualizarCliente = (e) => {
        e.preventDefault();
        // Validación básica de campos obligatorios
        const requiredFields = ['nombre_completo', 'dni', 'telefono', 'direccion', 'email', 'numero_espacios'];
        for (const field of requiredFields) {
            if (!formCliente[field]) {
                console.error(`El campo ${field} es obligatorio.`);
                // En un entorno real, mostrarías un mensaje al usuario
                return;
            }
        }
        
        const nuevoCliente = { ...formCliente };
        
        // Conversión a enteros y manejo de IDs opcionales
        nuevoCliente.numero_espacios = parseInt(nuevoCliente.numero_espacios, 10);
        nuevoCliente.usuario_id = nuevoCliente.usuario_id ? parseInt(nuevoCliente.usuario_id, 10) : null;
        
        if (clienteEditando) {
            // Lógica de Edición
            const updatedClientes = clientes.map(c =>
                c.id === clienteEditando.id ? { ...clienteEditando, ...nuevoCliente } : c
            );
            setClientes(updatedClientes);
            console.log("Cliente actualizado:", { id: clienteEditando.id, ...nuevoCliente });
        } else {
            // Lógica de Adición
            const newId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
            
            // Generar fecha_registro en formato YYYY-MM-DD
            const fecha = new Date();
            const formattedDate = fecha.getFullYear() + '-' + 
                                String(fecha.getMonth() + 1).padStart(2, '0') + '-' + 
                                String(fecha.getDate()).padStart(2, '0');
            
            const clienteFinal = {
                id: newId,
                ...nuevoCliente,
                fecha_registro: formattedDate, // Fecha automática
                fecha_creacion: new Date().toISOString(),
            };
            setClientes([...clientes, clienteFinal]);
            console.log("Cliente agregado:", clienteFinal);
        }

        setModalClienteAbierto(false);
        setClienteEditando(null);
    };

    const eliminarCliente = (id) => {
        // NOTA: En este entorno, se usa console.log en lugar de window.confirm() o alert(), 
        // ya que están deshabilitados. En un entorno real, usarías un modal de confirmación.
        if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente con ID ${id}?`)) { // Simula la confirmación
            setClientes(clientes.filter(c => c.id !== id));
            console.log(`Cliente con ID ${id} eliminado.`);
        }
    };

//PAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

    useEffect(() => {
        setTimeout(() => {
            setSolicitudes(solicitudesEjemplo);
            setProductos(productosEjemplo);
            //PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMM
            setClientes(mockClientes); 
            //PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMMMMMMMMMMMMMMMMMM
            setCargando(false);
        }, 1500);
    }, []);

    // FUNCIONES PARA SOLICITUDES
    const solicitudesFiltradas = solicitudes.filter(s => {
        const coincideTipo = filtroTipo === 'todas' || s.tipo === filtroTipo;
        const coincideEstado = filtroEstado === 'todos' || s.estado === filtroEstado;
        return coincideTipo && coincideEstado;
    });

    const cambiarEstadoSolicitud = (idSolicitud, nuevoEstado) => {
        setSolicitudes(prev => prev.map(s => 
            s.id_solicitud === idSolicitud 
                ? { ...s, estado: nuevoEstado }
                : s
        ));
    };

    // FUNCIONES PARA PRODUCTOS
    const abrirModalProducto = (producto = null) => {
        if (producto) {
            setProductoEditando(producto);
            setFormProducto({
                nombre: producto.nombre,
                categoria: producto.categoria_id,
                material: producto.material,
                precio: producto.precio,
                stock: producto.stock,
                descripcion: producto.descripcion,
                descripcion_larga: producto.descripcion_larga,
                imagen_url: producto.imagen_url,
                dimensiones: producto.dimensiones,
                peso_kg: producto.peso_kg,
                capacidad_ml: producto.capacidad_ml,
                destacado: producto.destacado
            });
        } else {
            setProductoEditando(null);
            setFormProducto({
                nombre: '',
                categoria: '',
                material: '',
                precio: '',
                stock: '',
                descripcion: '',
                descripcion_larga: '',
                imagen_url: '',
                dimensiones: '',
                peso_kg: '',
                capacidad_ml: '',
                destacado: false
            });
        }
        setModalProductoAbierto(true);
    };

    const guardarProducto = (e) => {
        e.preventDefault();
        if (productoEditando) {
            // Editar producto existente
            setProductos(prev => prev.map(p => 
                p.id === productoEditando.id 
                    ? { ...p, ...formProducto, categoria_id: parseInt(formProducto.categoria) }
                    : p
            ));
        } else {
            // Crear nuevo producto
            const nuevoProducto = {
                id: Math.max(...productos.map(p => p.id)) + 1,
                ...formProducto,
                categoria_id: parseInt(formProducto.categoria),
                activo: true
            };
            setProductos(prev => [...prev, nuevoProducto]);
        }
        setModalProductoAbierto(false);
    };

    const eliminarProducto = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setProductos(prev => prev.filter(p => p.id !== id));
        }
    };

    const toggleDestacado = (id) => {
        setProductos(prev => prev.map(p => 
            p.id === id ? { ...p, destacado: !p.destacado } : p
        ));
    };

    // ESTADÍSTICAS
    const estadisticas = {
        totalSolicitudes: solicitudes.length,
        nuevasSolicitudes: solicitudes.filter(s => s.estado === 'nueva').length,
        totalProductos: productos.length,
        stockBajo: productos.filter(p => p.stock < 5).length,
        totalCliente : clientes.length
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // COMPONENTE TARJETA SOLICITUD
    const TarjetaSolicitud = ({ solicitud }) => {
        const tipoInfo = tiposSolicitud[solicitud.tipo];
        const estadoInfo = estadosSolicitud[solicitud.estado];
        const datos = solicitud.datos_solicitud;

        return (
            <div className="tarjeta-solicitud" style={{ borderLeftColor: tipoInfo.color }}>
                <div className="tarjeta-header">
                    <div className="header-superior">
                        <div className="tipo-badge" style={{ backgroundColor: tipoInfo.bgColor, color: tipoInfo.color }}>
                            <span className="tipo-icono">{tipoInfo.icono}</span>
                            <span className="tipo-nombre">{tipoInfo.nombre}</span>
                        </div>
                        <div className="estado-badge" style={{ backgroundColor: estadoInfo.color }}>
                            <span className="estado-icono">{estadoInfo.icono}</span>
                            <span className="estado-nombre">{estadoInfo.nombre}</span>
                        </div>
                    </div>
                    <div className="fecha-solicitud">
                        📅 {formatearFecha(solicitud.fecha_creacion)}
                    </div>
                </div>

                <div className="info-cliente">
                    <div className="cliente-header">
                        <h4 className="cliente-nombre">{datos.nombre}</h4>
                        {solicitud.prioridad === 'alta' && <span className="prioridad-alta">⚠️ Urgente</span>}
                    </div>
                    <div className="contacto-info">
                        <div className="contacto-item">
                            <span className="contacto-icono">📞</span>
                            <span>{datos.telefono}</span>
                        </div>
                        <div className="contacto-item">
                            <span className="contacto-icono">✉️</span>
                            <span>{datos.email}</span>
                        </div>
                    </div>
                </div>

                <div className="detalles-solicitud">
                    <h5 className="detalles-titulo">Detalles de la solicitud:</h5>
                    <div className="detalles-contenido">
                        {Object.entries(datos).map(([key, value]) => (
                            key !== 'nombre' && key !== 'telefono' && key !== 'email' && (
                                <DetailItem 
                                    key={key} 
                                    label={key.replace(/_/g, ' ')} 
                                    value={value} 
                                />
                            )
                        ))}
                    </div>
                </div>

                <div className="tarjeta-acciones">
                    <div className="acciones-grupo">
                        {solicitud.estado === 'nueva' && (
                            <>
                                <ActionButton 
                                    icon="🔄" 
                                    text="En Proceso" 
                                    type="proceso"
                                    onClick={() => cambiarEstadoSolicitud(solicitud.id_solicitud, 'en_proceso')}
                                />
                                <ActionButton 
                                    icon="✅" 
                                    text="Atendida" 
                                    type="atendida"
                                    onClick={() => cambiarEstadoSolicitud(solicitud.id_solicitud, 'atendida')}
                                />
                            </>
                        )}
                        {solicitud.estado === 'en_proceso' && (
                            <ActionButton 
                                icon="✅" 
                                text="Marcar como Atendida" 
                                type="atendida"
                                onClick={() => cambiarEstadoSolicitud(solicitud.id_solicitud, 'atendida')}
                            />
                        )}
                    </div>
                    <div className="acciones-secundarias">
                        {/* <ActionButton icon="📞" text="Contactar" type="contactar" /> */}
                        <ActionButton 
                            icon="❌" 
                            text="Cancelar" 
                            type="eliminar"
                            onClick={() => cambiarEstadoSolicitud(solicitud.id_solicitud, 'cancelada')}
                        />
                    </div>
                </div>
            </div>
        );
    };

    // COMPONENTE TARJETA PRODUCTO
    const TarjetaProducto = ({ producto }) => {
        const categoriaInfo = categoriasProductos[producto.categoria_id];

        return (
            <div className="tarjeta-producto">
                <div className="producto-imagen">
                    <img src={producto.imagen_url} alt={producto.nombre} />
                    {producto.destacado && <div className="destacado-badge">Destacado</div>}
                    {producto.stock < 5 && <div className="stock-bajo-badge">Stock Bajo</div>}
                </div>
                
                <div className="producto-info">
                    <div className="producto-header">
                        <div className="categoria-badge" style={{ backgroundColor: categoriaInfo.color }}>
                            <span className="categoria-icono">{categoriaInfo.icono}</span>
                            <span className="categoria-nombre">{categoriaInfo.nombre}</span>
                        </div>
                        <div className="producto-precio">S/ {producto.precio}</div>
                    </div>
                    
                    <h4 className="producto-nombre">{producto.nombre}</h4>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    
                    <div className="producto-detalles">
                        <div className="detalle-item">
                            <span className="detalle-label">Material:</span>
                            <span className="detalle-value">{producto.material}</span>
                        </div>
                        <div className="detalle-item">
                            <span className="detalle-label">Stock:</span>
                            <span className={`detalle-value ${producto.stock < 5 ? 'stock-bajo' : ''}`}>
                                {producto.stock} unidades
                            </span>
                        </div>
                        <div className="detalle-item">
                            <span className="detalle-label">Dimensiones:</span>
                            <span className="detalle-value">{producto.dimensiones}</span>
                        </div>
                    </div>
                </div>

                <div className="producto-acciones">
                    <button 
                        className="btn btn-editar"
                        onClick={() => abrirModalProducto(producto)}
                    >
                        Editar
                    </button>
                    <button 
                        className={`btn ${producto.destacado ? 'btn-destacado' : 'btn-normal'}`}
                        onClick={() => toggleDestacado(producto.id)}
                    >
                        {producto.destacado ? 'Quitar' : 'Destacar'}
                    </button>
                    <button 
                        className="btn btn-eliminar"
                        onClick={() => eliminarProducto(producto.id)}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        );
    };

    // COMPONENTES AUXILIARES
    const DetailItem = ({ label, value }) => (
        <div className="detail-item">
            <div className="detail-content">
                <span className="detail-label">{label}:</span>
                <span className="detail-value">{value}</span>
            </div>
        </div>
    );

    const ActionButton = ({ icon, text, type, onClick }) => (
        <button 
            className={`btn btn-${type}`}
            onClick={onClick}
        >
            <span className="btn-icon">{icon}</span>
            <span className="btn-text">{text}</span>
        </button>
    );

    if (cargando) {
        return (
            <div className="panel-admin">
                <div className="cargando">
                    <div className="spinner"></div>
                    <p>Cargando panel de administración...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel-admin">
            {/* HEADER PRINCIPAL */}
            <div className="panel-header">
                <div className="header-content">
                    <div className="header-titulo">
                        <h1>Panel de Administración</h1>
                        <p>Gestiona solicitudes y productos de tu funeraria</p>
                    </div>
                    
                    {/* NAVEGACIÓN ENTRE VISTAS */}
                    <div className="navegacion-vistas">
                        <button 
                            className={`vista-btn ${vistaActiva === 'solicitudes' ? 'activa' : ''}`}
                            onClick={() => setVistaActiva('solicitudes')}
                        >
                            Solicitudes
                        </button>
                        <button 
                            className={`vista-btn ${vistaActiva === 'productos' ? 'activa' : ''}`}
                            onClick={() => setVistaActiva('productos')}
                        >
                            Gestión de Urnas
                        </button>
                        <button 
                            className={`vista-btn ${vistaActiva === 'vista-clientes' ? 'activa' : ''}`}
                            onClick={() => setVistaActiva('vista-clientes')}
                        >
                            Gestion de Clientes
                        </button>
                    </div>
                    
                    {/* ESTADÍSTICAS */}
<div className="estadisticas-grid">
    {vistaActiva === 'solicitudes' && (
        <>
            <div className="stat-card total">
                <div className="stat-content">
                    <div className="stat-number">{estadisticas.totalSolicitudes}</div>
                    <div className="stat-label">Total Solicitudes</div>
                </div>
            </div>
            <div className="stat-card nuevas">
                <div className="stat-content">
                    <div className="stat-number">{estadisticas.nuevasSolicitudes}</div>
                    <div className="stat-label">Nuevas</div>
                </div>
            </div>
        </>
    )}

    {vistaActiva === 'productos' && (
        <>
            <div className="stat-card total">
                <div className="stat-content">
                    <div className="stat-number">{estadisticas.totalProductos}</div>
                    <div className="stat-label">Total Productos</div>
                </div>
            </div>
            <div className="stat-card nuevas">
                <div className="stat-content">
                    <div className="stat-number">{estadisticas.stockBajo}</div>
                    <div className="stat-label">Stock Bajo</div>
                </div>
            </div>
        </>
    )}

    {vistaActiva === 'vista-clientes' && (
        <div className="stat-card total">
            <div className="stat-content">
                <div className="stat-number">{estadisticas.totalCliente}</div>
                <div className="stat-label">Total Clientes</div>
            </div>
        </div>
    )}
</div>

                </div>
            </div>
 {/*PAMMMMMMMMMMMMMMMMMMMMMMMMmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmMMM */}
{vistaActiva === 'vista-clientes' && (
    <div className="vista-clientes">

        {/* Botón de Agregar Cliente */}
<div className="productos-header">
    <div className="header-acciones">
        <button className="btn btn-agregar" onClick={() => abrirModalCliente()}>
            ➕👤 Agregar Cliente
        </button>
    </div>
</div>



        {/* MODAL CLIENTE */}
        {ModalClienteAbierto && (
            <div className="modal-overlay" onClick={() => setModalClienteAbierto(false)}>
                <div className="modal-content cliente-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{clienteEditando ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
                        <button 
                            className="modal-close"
                            onClick={() => setModalClienteAbierto(false)}
                        >
                            &times;
                        </button>
                    </div>

                    <form className="form-producto" onSubmit={agregarOActualizarCliente}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nombre Completo *</label>
                                <input
                                    type="text"
                                    value={formCliente.nombre_completo}
                                    onChange={(e) => setFormCliente(prev => ({...prev, nombre_completo: e.target.value}))}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>DNI *</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{8}"
                                    maxLength="8"
                                    title="Debe contener exactamente 8 dígitos numéricos"
                                    value={formCliente.dni}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // solo números
                                        setFormCliente(prev => ({ ...prev, dni: value }));
                                    }}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Teléfono *</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{9}"
                                    maxLength="9"
                                    title="Debe contener exactamente 9 dígitos numéricos"
                                    value={formCliente.telefono}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // solo números
                                        setFormCliente(prev => ({ ...prev, telefono: value }));
                                    }}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formCliente.email}
                                    onChange={(e) => setFormCliente(prev => ({...prev, email: e.target.value}))}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Dirección *</label>
                                <input
                                    type="text"
                                    value={formCliente.direccion}
                                    onChange={(e) => setFormCliente(prev => ({...prev, direccion: e.target.value}))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Número de Espacios *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formCliente.numero_espacios}
                                    onChange={(e) => setFormCliente(prev => ({...prev, numero_espacios: parseInt(e.target.value) || 1}))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ubicación de Espacios *</label>
                                <input
                                    type="text"
                                    value={formCliente.ubicacion_espacios}
                                    onChange={(e) => setFormCliente(prev => ({...prev, ubicacion_espacios: e.target.value}))}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Estado *</label>
                                <select
                                    value={formCliente.estado}
                                    onChange={(e) => setFormCliente(prev => ({...prev, estado: e.target.value}))}
                                    required
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Observaciones</label>
                                <textarea
                                    value={formCliente.observaciones}
                                    onChange={(e) => setFormCliente(prev => ({...prev, observaciones: e.target.value}))}
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="form-acciones">
                            <button 
                                type="button" 
                                className="btn btn-cancelar"
                                onClick={() => setModalClienteAbierto(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-guardar"
                            >
                                {clienteEditando ? '💾 Actualizar' : '➕ Agregar'} Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Tabla de Clientes */}
        <div className="tabla-clientes-container">
            <div className="tabla-responsive">
                <table className="tabla-solicitudes">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario ID</th>
                            <th>Nombre Completo</th>
                            <th>DNI</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Nº Espacios</th>
                            <th>Ubicación Espacios</th>
                            <th>Estado</th>
                            <th>Observaciones</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.usuario_id || 'N/A'}</td>
                                <td>{cliente.nombre_completo}</td>
                                <td>{cliente.dni}</td>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.email}</td>
                                <td>{cliente.direccion.substring(0, 30) + (cliente.direccion.length > 30 ? '...' : '')}</td>
                                <td>{cliente.numero_espacios}</td>
                                <td>{cliente.ubicacion_espacios ? cliente.ubicacion_espacios.substring(0, 20) + (cliente.ubicacion_espacios.length > 20 ? '...' : '') : 'N/A'}</td>
                                <td>
                                    <span className={`estado-badge estado-${cliente.estado.toLowerCase().replace(/ /g, '-')}`}>
                                        {cliente.estado}
                                    </span>
                                </td>
                                <td>{cliente.observaciones ? cliente.observaciones.substring(0, 30) + (cliente.observaciones.length > 30 ? '...' : '') : 'N/A'}</td>
                                <td className="acciones-col">
                                    <button
                                        className="btn-accion editar"
                                        title="Editar Cliente"
                                        onClick={() => abrirModalCliente(cliente)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-accion eliminar"
                                        title="Eliminar Cliente"
                                        onClick={() => eliminarCliente(cliente.id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {clientes.length === 0 && <p className="no-data-msg">No hay clientes registrados.</p>}
        </div>
    </div>
)}
{/*PAMMMMMMMMMMMMMMMMMMMMMMMMmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmMMM */}


            {/* VISTA DE SOLICITUDES */}
            {vistaActiva === 'solicitudes' && (
                <>
                    <div className="filtros-container">
                        <div className="filtros-grid">
                            <div className="filtro-grupo">
                                <label>🔍 Filtrar por tipo:</label>
                                <select 
                                    value={filtroTipo} 
                                    onChange={(e) => setFiltroTipo(e.target.value)}
                                    className="filtro-select"
                                >
                                    <option value="todas">Todos los tipos</option>
                                    {Object.entries(tiposSolicitud).map(([key, tipo]) => (
                                        <option key={key} value={key}>
                                            {tipo.icono} {tipo.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filtro-grupo">
                                <label>📊 Filtrar por estado:</label>
                                <select 
                                    value={filtroEstado} 
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                    className="filtro-select"
                                >
                                    <option value="todos">Todos los estados</option>
                                    {Object.entries(estadosSolicitud).map(([key, estado]) => (
                                        <option key={key} value={key}>
                                            {estado.icono} {estado.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="resultados-info">
                        <p>
                            Mostrando <strong>{solicitudesFiltradas.length}</strong> de <strong>{solicitudes.length}</strong> solicitudes
                            {filtroTipo !== 'todas' && ` • Tipo: ${tiposSolicitud[filtroTipo]?.nombre}`}
                            {filtroEstado !== 'todos' && ` • Estado: ${estadosSolicitud[filtroEstado]?.nombre}`}
                        </p>
                    </div>

                    <div className="solicitudes-grid">
                        {solicitudesFiltradas.length === 0 ? (
                            <div className="sin-resultados">
                                <div className="sin-resultados-icon">📭</div>
                                <h3>No hay solicitudes</h3>
                                <p>No se encontraron solicitudes con los filtros aplicados</p>
                            </div>
                        ) : (
                            solicitudesFiltradas.map(solicitud => (
                                <TarjetaSolicitud 
                                    key={solicitud.id_solicitud} 
                                    solicitud={solicitud} 
                                />
                            ))
                        )}
                    </div>
                </>
            )}

            {/* VISTA DE PRODUCTOS */}
            {vistaActiva === 'productos' && (
                <>
                    <div className="productos-header">
                        <div className="header-acciones">
                            <button 
                                className="btn btn-agregar"
                                onClick={() => abrirModalProducto()}
                            >
                                ➕ Agregar Producto
                            </button>
                        </div>
                    </div>

                    <div className="productos-grid">
                        {productos.length === 0 ? (
                            <div className="sin-resultados">
                                <div className="sin-resultados-icon">🏺</div>
                                <h3>No hay productos</h3>
                                <p>Comienza agregando tu primer producto</p>
                                <button 
                                    className="btn btn-agregar"
                                    onClick={() => abrirModalProducto()}
                                >
                                    ➕ Agregar Primer Producto
                                </button>
                            </div>
                        ) : (
                            productos.map(producto => (
                                <TarjetaProducto 
                                    key={producto.id} 
                                    producto={producto} 
                                />
                            ))
                        )}
                    </div>
                </>
            )}

            {/* MODAL PRODUCTO */}
            {modalProductoAbierto && (
                <div className="modal-overlay" onClick={() => setModalProductoAbierto(false)}>
                    <div className="modal-content producto-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{productoEditando ? 'Editar Producto' : 'Agregar Producto'}</h2>
                            <button 
                                className="modal-close"
                                onClick={() => setModalProductoAbierto(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form className="form-producto" onSubmit={guardarProducto}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nombre del Producto *</label>
                                    <input
                                        type="text"
                                        value={formProducto.nombre}
                                        onChange={(e) => setFormProducto(prev => ({...prev, nombre: e.target.value}))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Categoría *</label>
                                    <select
                                        value={formProducto.categoria}
                                        onChange={(e) => setFormProducto(prev => ({...prev, categoria: e.target.value}))}
                                        required
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {Object.entries(categoriasProductos).map(([id, cat]) => (
                                            <option key={id} value={id}>
                                                {cat.icono} {cat.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Material *</label>
                                    <input
                                        type="text"
                                        value={formProducto.material}
                                        onChange={(e) => setFormProducto(prev => ({...prev, material: e.target.value}))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Precio (S/) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formProducto.precio}
                                        onChange={(e) => setFormProducto(prev => ({...prev, precio: e.target.value}))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock *</label>
                                    <input
                                        type="number"
                                        value={formProducto.stock}
                                        onChange={(e) => setFormProducto(prev => ({...prev, stock: e.target.value}))}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Descripción Corta *</label>
                                    <input
                                        type="text"
                                        value={formProducto.descripcion}
                                        onChange={(e) => setFormProducto(prev => ({...prev, descripcion: e.target.value}))}
                                        required
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Descripción Larga</label>
                                    <textarea
                                        value={formProducto.descripcion_larga}
                                        onChange={(e) => setFormProducto(prev => ({...prev, descripcion_larga: e.target.value}))}
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>URL de Imagen</label>
                                    <input
                                        type="url"
                                        value={formProducto.imagen_url}
                                        onChange={(e) => setFormProducto(prev => ({...prev, imagen_url: e.target.value}))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Dimensiones</label>
                                    <input
                                        type="text"
                                        value={formProducto.dimensiones}
                                        onChange={(e) => setFormProducto(prev => ({...prev, dimensiones: e.target.value}))}
                                        placeholder="25x25x35 cm"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Peso (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formProducto.peso_kg}
                                        onChange={(e) => setFormProducto(prev => ({...prev, peso_kg: e.target.value}))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Capacidad (ml)</label>
                                    <input
                                        type="number"
                                        value={formProducto.capacidad_ml}
                                        onChange={(e) => setFormProducto(prev => ({...prev, capacidad_ml: e.target.value}))}
                                    />
                                </div>

                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formProducto.destacado}
                                            onChange={(e) => setFormProducto(prev => ({...prev, destacado: e.target.checked}))}
                                        />
                                        Producto Destacado
                                    </label>
                                </div>
                            </div>

                            <div className="form-acciones">
                                <button 
                                    type="button" 
                                    className="btn btn-cancelar"
                                    onClick={() => setModalProductoAbierto(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-guardar"
                                >
                                    {productoEditando ? '💾 Actualizar' : '➕ Agregar'} Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;