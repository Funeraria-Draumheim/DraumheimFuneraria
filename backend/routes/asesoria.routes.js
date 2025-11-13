const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'funeraria',
  password: '12345678', 
  port: 5432,
});

router.post("/asesoria-general", async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      email,
      ciudad,
      tipo_servicio,
      tipo_ceremonia,
      ubicacion_ceremonia,
      tipo_ataud,
      tipo_cremacion,
      urna,
      transporte,
      flores,
      adicionales,
      fecha_servicio,
      cantidad_asistentes,
      mensaje,
      precio_calculado,
      desglose_precio
    } = req.body;

    const result = await pool.query(
      `INSERT INTO solicitudes_asesoria_general 
        (nombre, telefono, email, ciudad, tipo_servicio, tipo_ceremonia, ubicacion_ceremonia, 
         tipo_ataud, tipo_cremacion, urna, transporte, flores, adicionales, 
         fecha_servicio, cantidad_asistentes, mensaje, precio_calculado, desglose_precio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING id`,
      [
        nombre, telefono, email, ciudad, tipo_servicio, tipo_ceremonia,
        ubicacion_ceremonia, tipo_ataud, tipo_cremacion, urna, transporte,
        flores, JSON.stringify(adicionales || []), fecha_servicio || null,
        cantidad_asistentes, mensaje, precio_calculado,
        JSON.stringify(desglose_precio || {})
      ]
    );

    res.status(201).json({ message: "Solicitud guardada", id: result.rows[0].id });
  } catch (error) {
    console.error("Error al guardar solicitud:", error);
    res.status(500).json({ error: "Error al guardar la solicitud" });
  }
});

module.exports = router;
