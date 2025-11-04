const express = require("express");
const multer = require("multer");
const path = require("path");
const { Pool } = require("pg");

const router = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "funeraria",
  password: "password123456",
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
    console.log("🧾 Campos recibidos:", req.body);

    let { nombre, material, precio, stock, descripcion_corta, categoria_id } = req.body;

    // ✅ Conversión segura de tipo
    categoria_id = parseInt(categoria_id, 10);

    if (isNaN(categoria_id)) {
      return res.status(400).json({ error: "El campo categoria_id es obligatorio y debe ser un número válido" });
    }

    const imagenUrl = req.file ? `/uploads/urnas/${req.file.filename}` : null;

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
