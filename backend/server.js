const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'funeraria_db',
  password: '12345678',
  port: 5432,
});

// Ruta de registro
app.post('/register', async (req, res) => {
  const { username, email, password, tel, ter } = req.body;

  try {
    // Validar que no exista el email
    const emailExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, acepto_terminos) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre_completo, email, telefono',
      [username, email, hashedPassword, tel, ter]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});