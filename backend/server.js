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

//REGISTER
app.post('/register', async (req, res) => {
  const { username, email, password, tel, ter } = req.body;

  try {
    const emailExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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

//LOGIN
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.get('/api/usuario/perfil', async(req, res) => {
  try {
    const {user_id} = req.query;

    const result = await pool.query(
      'SELECT id, nombre_completo, email, telefono FROM usuarios WHERE id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({error: 'Usuario no encontrado'});
    }

    res.json({usuario: result.rows[0] });
  }catch (error) {
    res.status(500).json({error: 'Error del servidor'});
  }
});

//Editar perfil de usuario
app.put('/api/auth/editar', async (req, res) => {
  const {id, nombre, email, telefono, password} = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: 'Id de usuari es obligatorio'})
    }

    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado'});
    }

    const usuarioActual = userExists.rows[0];

    const nombreFinal = nombre || usuarioActual.nombre_completo;
    const emailFinal = email || usuarioActual.email;
    const telefonoFinal = telefono !== undefined ? telefono : usuarioActual.telefono;

    if(email && email !== usuarioActual.email) {
      const emailExists = await pool.query(
        'SELECT id FROM usuarios WHERE email =$1 AND id != $2',
        [email, id]
      );

      if (emailExists.rows.length > 0) {
        return res.status(400).json({ error: 'El email ya esta en uso por otro usuario'});
      }
    }

    let query = '';
    let values = [];

    if (password && password.trim() !== ''){
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `
      UPDATE usuarios
      SET nombre_completo = $1, email = $2, telefono = $3, password_hash = $4, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, nombre_completo, email, telefono`;
      values = [nombreFinal, emailFinal, telefonoFinal, hashedPassword, id];
    }else {
      query = `
      UPDATE usuarios
      SET nombre_completo = $1, email = $2, telefono = $3, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, nombre_completo, email, telefono`;
      values = [nombreFinal, emailFinal, telefonoFinal, id];
    }
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(500).json({ error: 'No se pudo actualizar el perfil'});
    }

    res.json({
      message: 'Perfil actualizado correctamente',
      usuario: result.rows[0]
    });
  }catch (error) {
    console.error('Error al editar perfil: ', error);
    res.status(500).json({ error: 'Error del servidor'});
  }
});

//Cerrar Sesion
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Sesion cerrada correctamente'});
});

app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});