const express = require("express");
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "funeraria",
  password: "12345678",
  port: 5432,
});

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/urnas/"); // carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Ruta para obtener todas las urnas
router.get("/urnas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM urnas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener urnas:", error);
    res.status(500).json({ error: "Error al obtener urnas" });
  }
});

// ✅ Ruta para registrar una urna con imagen
router.post("/urnas", upload.single("imagen"), async (req, res) => {
  try {
    // 🔹 Limpiar los datos del body, quitando duplicados o vacíos
    const rawData = req.body;

    // Crear un nuevo objeto limpio
    const data = {};
    for (const key in rawData) {
      // Evita duplicados y campos vacíos
      if (!data[key] && rawData[key] && rawData[key].trim() !== "") {
        data[key] = rawData[key];
      }
    }

    console.log("🧹 Datos recibidos y limpiados:", data);

    const { nombre, material, precio, stock, descripcion_corta, categoria_id } = data;

    const imagenUrl = req.file ? `/uploads/urnas/${req.file.filename}` : null;

    // Validación mínima
    if (!categoria_id || !nombre || !material || !precio || !stock || !descripcion_corta) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const result = await pool.query(
      `INSERT INTO urnas (categoria_id, nombre, material, precio, stock, descripcion_corta, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [categoria_id, nombre, material, precio, stock, descripcion_corta, imagenUrl]
    );

    res.status(201).json({
      message: "Urna guardada correctamente",
      urna: result.rows[0],
    });
  } catch (error) {
    console.error("Error al guardar urna:", error);
    res.status(500).json({ error: "Error al guardar urna" });
  }
});



module.exports = router;