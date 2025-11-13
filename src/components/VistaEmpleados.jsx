import React, { useEffect, useState } from "react";
import "./AdminPanel.css";

const VistaEmpleados = ({ onEmpleadosCargados }) => {
  const [empleados, setEmpleados] = useState([]);
  const [mostrarActivos, setMostrarActivos] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre_empleado: "",
    email: "",
    contraseña: "",
    puesto: "",
    activo: true
  });

  // ====== CARGAR EMPLEADOS ======
  useEffect(() => {
    fetch("http://localhost:5000/api/empleados")
      .then(res => res.json())
      .then(data => {
        setEmpleados(data);
        onEmpleadosCargados && onEmpleadosCargados(data);
      })
      .catch(err => console.error("Error al cargar empleados:", err));
  }, []);


  // ====== MANEJO DE MODAL ======
  const abrirModal = (empleado = null) => {
    setEmpleadoEditando(empleado);
    setFormData(
      empleado
        ? { ...empleado }
        : { nombre_empleado: "", email: "", contraseña: "", puesto: "", activo: true }
    );
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEmpleadoEditando(null);
  };

  // ====== GUARDAR EMPLEADO ======
  const guardarEmpleado = async (e) => {
    e.preventDefault();
    const url = empleadoEditando
      ? `http://localhost:5000/api/empleados/${empleadoEditando.id}`
      : "http://localhost:5000/api/empleados";
    const method = empleadoEditando ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    cerrarModal();
    const res = await fetch("http://localhost:5000/api/empleados");
    setEmpleados(await res.json());
  };
  

  // ====== SUSPENDER / ACTIVAR ======
  const cambiarEstado = async (id, activar) => {
    const endpoint = activar ? "activar" : "suspender";
    await fetch(`http://localhost:5000/api/empleados/${id}/${endpoint}`, {
      method: "PATCH"
    });
    const res = await fetch("http://localhost:5000/api/empleados");
    setEmpleados(await res.json());
  };

  // ====== FILTRADO ======
  const empleadosFiltrados = empleados.filter(emp => emp.activo === mostrarActivos);

  return (
    <div className="productos-header">
      <div className="header-acciones">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>
            {mostrarActivos ? "Empleados Activos" : "Empleados Inactivos"}
          </h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn btn-agregar" onClick={() => abrirModal()}>
              ➕ Nuevo Empleado
            </button>
            <button
              className="btn btn-normal"
              onClick={() => setMostrarActivos(!mostrarActivos)}
            >
              {mostrarActivos ? "Ver Inactivos" : "Ver Activos"}
            </button>
          </div>
        </div>
      </div>

      <div className="productos-grid" style={{ gridTemplateColumns: "1fr" }}>
        <table style={{
          width: "100%",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>
          <thead style={{ background: "#667eea", color: "white" }}>
            <tr>
              <th style={{ padding: "12px" }}>Nombre</th>
              <th>Email</th>
              <th>Puesto</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.length > 0 ? (
              empleadosFiltrados.map((emp) => (
                <tr key={emp.id} style={{ textAlign: "center" }}>
                  <td>{emp.nombre_empleado}</td>
                  <td>{emp.email}</td>
                  <td>{emp.puesto}</td>
                  <td>{emp.activo ? "✅" : "❌"}</td>
                  <td style={{ display: "flex", gap: "10px", justifyContent: "center", padding: "10px" }}>
                    {emp.activo ? (
                      <>
                        <button className="btn btn-editar" onClick={() => abrirModal(emp)}>✏️ Editar</button>
                        <button className="btn btn-eliminar" onClick={() => cambiarEstado(emp.id, false)}>🚫 Suspender</button>
                      </>
                    ) : (
                      <button className="btn btn-proceso" onClick={() => cambiarEstado(emp.id, true)}>🔄 Reactivar</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="sin-resultados">
                  <div className="sin-resultados-icon">😕</div>
                  <h3>No hay empleados {mostrarActivos ? "activos" : "inactivos"} disponibles</h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL DE CREACIÓN / EDICIÓN ===== */}
      {modalAbierto && (
        <div className="producto-modal">
          <header>{empleadoEditando ? "Editar Empleado" : "Nuevo Empleado"}</header>
          <form className="form-producto" onSubmit={guardarEmpleado}>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre_empleado"
                  value={formData.nombre_empleado}
                  onChange={(e) => setFormData({ ...formData, nombre_empleado: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                  required={!empleadoEditando}
                />
              </div>

              <div className="form-group">
                <label>Puesto</label>
                <input
                  type="text"
                  name="puesto"
                  value={formData.puesto}
                  onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-acciones">
              <button type="button" className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
              <button type="submit" className="btn-guardar">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VistaEmpleados;
