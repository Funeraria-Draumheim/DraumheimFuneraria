import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('todas');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [cargando, setCargando] = useState(true);

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

    // DATOS DE EJEMPLO MEJORADOS
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
        },
        {
            id_solicitud: 3,
            id_usuario: 3,
            tipo: 'cotizacion_personalizada',
            estado: 'nueva',
            datos_solicitud: {
                nombre: 'Roberto Silva',
                telefono: '+51 987 555 888',
                email: 'roberto@email.com',
                tipo_servicio: 'plan_premium',
                personas: '2',
                presupuesto: '5000-10000',
                comentarios: 'Necesito cotización para mi esposa y para mí, estamos interesados en un plan familiar.'
            },
            fecha_creacion: '2024-01-14T08:45:00Z',
            prioridad: 'media'
        },
        {
            id_solicitud: 4,
            id_usuario: 4,
            tipo: 'asesoria_privada',
            estado: 'atendida',
            datos_solicitud: {
                nombre: 'Laura Mendoza',
                telefono: '+51 987 444 777',
                email: 'laura@email.com',
                ubicacion: 'Arequipa',
                tipoCremacion: 'agua',
                tipoServicio: 'virtual',
                fechaPreferida: '2024-01-20',
                horarioPreferido: 'tarde',
                mensaje: 'Interesada en conocer más sobre la cremación con agua, me preocupa el impacto ambiental.'
            },
            fecha_creacion: '2024-01-13T16:20:00Z',
            prioridad: 'baja'
        },
        {
            id_solicitud: 5,
            id_usuario: 5,
            tipo: 'plan_basico',
            estado: 'nueva',
            datos_solicitud: {
                nombre: 'Miguel Torres',
                telefono: '+51 987 333 222',
                email: 'miguel@email.com',
                mensaje: 'Solicito información sobre el plan básico para mi madre.'
            },
            fecha_creacion: '2024-01-14T11:20:00Z',
            prioridad: 'media'
        }
    ];

    useEffect(() => {
        setTimeout(() => {
            setSolicitudes(solicitudesEjemplo);
            setCargando(false);
        }, 1500);
    }, []);

    // FILTRAR SOLICITUDES
    const solicitudesFiltradas = solicitudes.filter(s => {
        const coincideTipo = filtroTipo === 'todas' || s.tipo === filtroTipo;
        const coincideEstado = filtroEstado === 'todos' || s.estado === filtroEstado;
        return coincideTipo && coincideEstado;
    });

    // ESTADÍSTICAS
    const estadisticas = {
        total: solicitudes.length,
        nuevas: solicitudes.filter(s => s.estado === 'nueva').length,
        enProceso: solicitudes.filter(s => s.estado === 'en_proceso').length,
        atendidas: solicitudes.filter(s => s.estado === 'atendida').length
    };

    const cambiarEstado = (idSolicitud, nuevoEstado) => {
        setSolicitudes(prev => prev.map(s => 
            s.id_solicitud === idSolicitud 
                ? { ...s, estado: nuevoEstado }
                : s
        ));
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

    const TarjetaSolicitud = ({ solicitud }) => {
        const tipoInfo = tiposSolicitud[solicitud.tipo];
        const estadoInfo = estadosSolicitud[solicitud.estado];
        const datos = solicitud.datos_solicitud;

        return (
            <div className="tarjeta-solicitud" style={{ borderLeftColor: tipoInfo.color }}>
                {/* HEADER MEJORADO */}
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

                {/* INFORMACIÓN DEL CLIENTE MEJORADA */}
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

                {/* DETALLES MEJORADOS */}
                <div className="detalles-solicitud">
                    <h5 className="detalles-titulo">Detalles de la solicitud:</h5>
                    <div className="detalles-contenido">
                        {solicitud.tipo === 'asesoria_24_7' && (
                            <>
                                <DetailItem icon="⚰️" label="Servicio" value={datos.servicio} />
                                <DetailItem icon="👤" label="Fallecido" value={datos.fallecido} />
                                <DetailItem icon="📅" label="Fecha" value={datos.fecha} />
                                <DetailItem icon="💬" label="Mensaje" value={datos.mensaje} />
                            </>
                        )}

                        {solicitud.tipo === 'asesoria_privada' && (
                            <>
                                <DetailItem icon="🔥" label="Tipo Cremación" value={datos.tipoCremacion} />
                                <DetailItem icon="💻" label="Tipo Asesoría" value={datos.tipoServicio} />
                                <DetailItem icon="📅" label="Fecha Preferida" value={datos.fechaPreferida} />
                                <DetailItem icon="⏰" label="Horario" value={datos.horarioPreferido} />
                                {datos.mensaje && <DetailItem icon="💬" label="Comentario" value={datos.mensaje} />}
                            </>
                        )}

                        {solicitud.tipo.startsWith('plan_') && (
                            <>
                                <DetailItem icon="🏢" label="Empresa" value={datos.empresa || 'No especificada'} />
                                <DetailItem icon="💼" label="Cargo" value={datos.cargo || 'No especificado'} />
                                {datos.requerimientos && <DetailItem icon="📋" label="Requerimientos" value={datos.requerimientos} />}
                            </>
                        )}

                        {solicitud.tipo === 'cotizacion_personalizada' && (
                            <>
                                <DetailItem icon="⚙️" label="Tipo Servicio" value={datos.tipo_servicio} />
                                <DetailItem icon="👥" label="Personas" value={datos.personas} />
                                <DetailItem icon="💰" label="Presupuesto" value={datos.presupuesto} />
                                <DetailItem icon="💬" label="Comentarios" value={datos.comentarios} />
                            </>
                        )}
                    </div>
                </div>

                {/* ACCIONES MEJORADAS */}
                <div className="tarjeta-acciones">
                    <div className="acciones-grupo">
                        {solicitud.estado === 'nueva' && (
                            <>
                                <ActionButton 
                                    icon="🔄" 
                                    text="En Proceso" 
                                    type="proceso"
                                    onClick={() => cambiarEstado(solicitud.id_solicitud, 'en_proceso')}
                                />
                                <ActionButton 
                                    icon="✅" 
                                    text="Atendida" 
                                    type="atendida"
                                    onClick={() => cambiarEstado(solicitud.id_solicitud, 'atendida')}
                                />
                            </>
                        )}
                        
                        {solicitud.estado === 'en_proceso' && (
                            <ActionButton 
                                icon="✅" 
                                text="Marcar como Atendida" 
                                type="atendida"
                                onClick={() => cambiarEstado(solicitud.id_solicitud, 'atendida')}
                            />
                        )}
                    </div>
                    
                    <div className="acciones-secundarias">
                        <ActionButton icon="📞" text="Contactar" type="contactar" />
                        <ActionButton icon="❌" text="cancelado" type="cancelado" />
                    </div>
                </div>
            </div>
        );
    };

    const DetailItem = ({ icon, label, value }) => (
        <div className="detail-item">
            <span className="detail-icon">{icon}</span>
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
                    <p>Cargando solicitudes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="panel-admin">
            {/* HEADER MEJORADO */}
            <div className="panel-header">
                <div className="header-content">
                    <div className="header-titulo">
                        <h1>📊 Panel de Administración</h1>
                        <p>Gestiona todas las solicitudes de los clientes</p>
                    </div>
                    
                    {/* ESTADÍSTICAS MEJORADAS - AHORA DEBAJO DEL TÍTULO */}
                    <div className="estadisticas-grid">
                        <div className="stat-card total">
                            <div className="stat-icon">📋</div>
                            <div className="stat-content">
                                <div className="stat-number">{estadisticas.total}</div>
                                <div className="stat-label">Total Solicitudes</div>
                            </div>
                        </div>
                        <div className="stat-card nuevas">
                            <div className="stat-icon">🆕</div>
                            <div className="stat-content">
                                <div className="stat-number">{estadisticas.nuevas}</div>
                                <div className="stat-label">Nuevas</div>
                            </div>
                        </div>
                        <div className="stat-card proceso">
                            <div className="stat-icon">🔄</div>
                            <div className="stat-content">
                                <div className="stat-number">{estadisticas.enProceso}</div>
                                <div className="stat-label">En Proceso</div>
                            </div>
                        </div>
                        <div className="stat-card atendidas">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-number">{estadisticas.atendidas}</div>
                                <div className="stat-label">Atendidas</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTROS MEJORADOS */}
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

            {/* CONTADOR DE RESULTADOS */}
            <div className="resultados-info">
                <p>
                    Mostrando <strong>{solicitudesFiltradas.length}</strong> de <strong>{solicitudes.length}</strong> solicitudes
                    {filtroTipo !== 'todas' && ` • Tipo: ${tiposSolicitud[filtroTipo]?.nombre}`}
                    {filtroEstado !== 'todos' && ` • Estado: ${estadosSolicitud[filtroEstado]?.nombre}`}
                </p>
            </div>

            {/* LISTA DE SOLICITUDES */}
            <div className="solicitudes-grid">
                {solicitudesFiltradas.length === 0 ? (
                    <div className="sin-solicitudes">
                        <div className="sin-solicitudes-icon">📭</div>
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
        </div>
    );
};

export default AdminPanel;