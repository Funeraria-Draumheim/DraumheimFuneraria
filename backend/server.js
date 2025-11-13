const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//ruta urnas//
const urnasRoutes = require('./routes/urnas.routes');
app.use('/api', urnasRoutes);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'funeraria',
  password: '12345678',
  port: 5432,
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

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

// ruta de asesoría
const asesoriaRoutes = require('./routes/asesoria.routes');
app.use('/api', asesoriaRoutes);

app.post("/api/asesoria-general", async (req, res) => {
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

    try {
        const result = await pool.query(
    `INSERT INTO solicitudes_asesoria_general (
        nombre, telefono, email, ciudad, tipo_servicio, tipo_ceremonia,
        ubicacion_ceremonia, tipo_ataud, tipo_cremacion, urna, transporte, flores,
        fecha_servicio, cantidad_asistentes, adicionales, mensaje,
        precio_calculado, desglose_precio
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    RETURNING *`,
    [
        nombre, telefono, email, ciudad, tipo_servicio, tipo_ceremonia,
        ubicacion_ceremonia, tipo_ataud, tipo_cremacion, urna, transporte, flores,
        fecha_servicio, cantidad_asistentes, JSON.stringify(adicionales), mensaje,
        precio_calculado, JSON.stringify(desglose_precio)
    ]
);


        res.status(201).json({
            mensaje: "Solicitud de asesoría guardada exitosamente",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error al guardar asesoría:", error);
        res.status(500).json({ error: "Error al guardar los datos en la base" });
    }
});

//
//ruta de plan funerario
//
app.post("/api/planes-funerarios", async (req, res) => {
    const {
        nombre_completo,
        telefono,
        email,
        tipo_plan,
        capilla,
        fecha_servicio,
        cantidad_asistentes,
        mensaje_adicional
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO solicitudes_planes_funerarios (
                nombre_completo, telefono, email, tipo_plan, capilla, 
                fecha_servicio, cantidad_asistentes, mensaje_adicional
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                nombre_completo, telefono, email, tipo_plan, capilla,
                fecha_servicio, cantidad_asistentes, mensaje_adicional
            ]
        );

        res.status(201).json({
            mensaje: "Solicitud de plan funerario guardada correctamente",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error al guardar plan funerario:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
});

//
//ruta de cremacion
//

app.post("/api/planes-cremacion", async (req, res) => {
    const {
        nombre_completo,
        telefono,
        email,
        ubicacion,
        tipo_plan,
        tipo_cremacion,
        lugar_cremacion,
        tipo_urna,
        fecha_servicio,
        mensaje_adicional
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO solicitudes_planes_cremacion (
                nombre_completo, telefono, email, ubicacion, tipo_plan,
                tipo_cremacion, lugar_cremacion, tipo_urna, fecha_servicio, mensaje_adicional
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *`,
            [
                nombre_completo, telefono, email, ubicacion, tipo_plan,
                tipo_cremacion, lugar_cremacion, tipo_urna, fecha_servicio, mensaje_adicional
            ]
        );

        res.status(201).json({
            mensaje: "Solicitud de plan de cremación guardada correctamente",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error al guardar plan de cremación:", error);
        res.status(500).json({ error: "Error al guardar en la base de datos" });
    }
});

// ruta empleados
const empleadosRoutes = require('./routes/empleados.routes');
app.use('/api', empleadosRoutes);

app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});