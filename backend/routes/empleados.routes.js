const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "funeraria",
  password: "12345678",
  port: 5432,
});

// Obtener todos los empleados
router.get("/empleados", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM empleados ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
});

// Crear un nuevo empleado
router.post("/empleados", async (req, res) => {
  const { nombre_empleado, email, contraseña, puesto, activo } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO empleados (nombre_empleado, email, contraseña, fecha_creacion, puesto, activo)
       VALUES ($1, $2, $3, NOW(), $4, $5)
       RETURNING *`,
      [nombre_empleado, email, contraseña, puesto, activo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear empleado:", error);
    res.status(500).json({ error: "Error al crear empleado" });
  }
});

// Actualizar empleado (editar)
router.put("/empleados/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre_empleado, email, puesto, activo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE empleados 
       SET nombre_empleado = $1, email = $2, puesto = $3, activo = $4
       WHERE id = $5 RETURNING *`,
      [nombre_empleado, email, puesto, activo, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Empleado no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
});

// Suspender o reactivar
router.patch("/empleados/:id/estado", async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;

  try {
    const result = await pool.query(
      `UPDATE empleados SET activo = $1 WHERE id = $2 RETURNING *`,
      [activo, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Empleado no encontrado" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al cambiar estado:", error);
    res.status(500).json({ error: "Error al cambiar estado" });
  }
});

module.exports = router;