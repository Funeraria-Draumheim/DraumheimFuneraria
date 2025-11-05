import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import axios from "axios";

const AdminPanel = () => {
    const [vistaActiva, setVistaActiva] = useState('solicitudes'); // 'solicitudes' o 'productos'
    const [solicitudes, setSolicitudes] = useState([]);
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

    useEffect(() => {
  const cargarDatos = async () => {
    try {
      setCargando(true);

      const [asesoria, funerarios, cremacion] = await Promise.all([
        axios.get("http://localhost:5000/api/asesoria-general"),
        axios.get("http://localhost:5000/api/planes-funerarios"),
        axios.get("http://localhost:5000/api/planes-cremacion"),
      ]);

      // Normaliza la estructura para que React entienda todas igual
      const normalizar = (arr, tipoLabel, tipoCodigo) =>
        arr.map((s) => ({
          id_solicitud: s.id,
          tipo: tipoCodigo,
          estado: s.estado || "nueva",
          prioridad: s.prioridad || "media",
          fecha_creacion: s.fecha_creacion || s.fecha_servicio || new Date().toISOString(),
          datos_solicitud: {
            nombre: s.nombre || s.nombre_completo,
            telefono: s.telefono,
            email: s.email,
            ciudad: s.ciudad || s.ubicacion || "No especificada",
            servicio: tipoLabel,
            mensaje: s.mensaje || s.mensaje_adicional || "(Sin mensaje adicional)",
            fecha_servicio: s.fecha_servicio,
            detalles: {
              tipo_servicio: s.tipo_servicio || s.tipo_plan || s.tipo_cremacion || "",
              tipo_ceremonia: s.tipo_ceremonia,
              capilla: s.capilla,
              lugar_cremacion: s.lugar_cremacion,
              tipo_ataud: s.tipo_ataud,
              urna: s.urna || s.tipo_urna,
              flores: s.flores,
              adicionales: s.adicionales,
            },
          },
        }));

      const todas = [
        ...normalizar(asesoria.data, "Asesoría General", "asesoria_24_7"),
        ...normalizar(funerarios.data, "Plan Funerario", "plan_estandar"),
        ...normalizar(cremacion.data, "Plan Cremación", "plan_premium"),
      ];

      setSolicitudes(todas);
    } catch (error) {
      console.error("Error al cargar datos del servidor:", error);
    } finally {
      setCargando(false);
    }
  };

  cargarDatos();
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
        stockBajo: productos.filter(p => p.stock < 5).length
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

  {Object.entries(datos).map(([key, value]) => {
    if (['nombre', 'telefono', 'email'].includes(key)) return null;

            if (typeof value === 'object' && value !== null) {
                return (
                    <div key={key} className="detalle-subgrupo">
                    <h6>{key.replace(/_/g, ' ')}:</h6>
                    {Object.entries(value)
                        .filter(([_, subVal]) => subVal)
                        .map(([subKey, subVal]) => (
                    <DetailItem
                        key={`${key}-${subKey}`}
                        label={subKey.replace(/_/g, ' ')}
                        value={String(subVal)}
                    />
                 ))}
                </div>
                );
            }

                    return (
                        <DetailItem
                            key={key}
                            label={key.replace(/_/g, ' ')}
                            value={String(value)}
                        />
                    );
                })}
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
                    </div>
                    
                    {/* ESTADÍSTICAS */}
                    <div className="estadisticas-grid">
                        <div className="stat-card total">
                            <div className="stat-icon">{vistaActiva === 'solicitudes' ? '' : ''}</div>
                            <div className="stat-content">
                                <div className="stat-number">
                                    {vistaActiva === 'solicitudes' ? estadisticas.totalSolicitudes : estadisticas.totalProductos}
                                </div>
                                <div className="stat-label">
                                    {vistaActiva === 'solicitudes' ? 'Total Solicitudes' : 'Total Productos'}
                                </div>
                            </div>
                        </div>
                        <div className="stat-card nuevas">
                            <div className="stat-icon">
                                {vistaActiva === 'solicitudes' ? '' : ''}
                            </div>
                            <div className="stat-content">
                                <div className="stat-number">
                                    {vistaActiva === 'solicitudes' ? estadisticas.nuevasSolicitudes : estadisticas.stockBajo}
                                </div>
                                <div className="stat-label">
                                    {vistaActiva === 'solicitudes' ? 'Nuevas' : 'Stock Bajo'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                            solicitudesFiltradas.map((solicitud) => (
                                <TarjetaSolicitud
                                    key={`${solicitud.tipo}-${solicitud.id_solicitud || crypto.randomUUID()}`}
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