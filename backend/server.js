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
  password: 'Picholin_9',
  port: 5432,
});

//PAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
//CLIENTES  CRUD 
app.get('/clientes', async (req, res) => {
  try {
    const allClientes = await pool.query(
      'SELECT id, nombre_completo, dni, telefono, email, direccion, numero_espacios, ubicacion_espacios, fecha_registro, estado, observaciones, fecha_creacion FROM clientes_espacios ORDER BY fecha_registro DESC'
    );
    res.json(allClientes.rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ message: 'Error al obtener el listado de clientes' });
  }
});

// REGISTRAR NUEVO CLIENTE 
app.post('/clientes', async (req, res) => {
  const { nombre_completo, dni, telefono, email, direccion, numero_espacios, ubicacion_espacios, estado, observaciones } = req.body;

  try {
    const existingClient = await pool.query(
      'SELECT * FROM clientes_espacios WHERE dni = $1 OR email = $2',
      [dni, email]
    );

    if (existingClient.rows.length > 0) {
      const isEmailDup = existingClient.rows.some(row => row.email === email);
      const isDniDup = existingClient.rows.some(row => row.dni === dni);

      let message = 'El cliente ya existe.';
      if (isEmailDup) message = 'El email ya está registrado para otro cliente.';
      if (isDniDup) message = 'El DNI ya está registrado para otro cliente.';

      return res.status(400).json({ message: message });
    }

    const result = await pool.query(
      `INSERT INTO clientes_espacios (nombre_completo, dni, telefono, email, direccion, numero_espacios, ubicacion_espacios, estado, observaciones, fecha_registro, fecha_creacion) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
       RETURNING *`,
      [nombre_completo, dni, telefono, email, direccion, numero_espacios, ubicacion_espacios, estado, observaciones]
    );

    res.status(201).json({
      message: 'Cliente registrado exitosamente',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ message: 'Error al registrar el nuevo cliente' });
  }
});


// ACTUALIZAR CLIENTE POR ID
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre_completo, dni, telefono, email, direccion, numero_espacios, ubicacion_espacios, estado, observaciones } = req.body;

  try {
    
    const result = await pool.query(
      `UPDATE clientes_espacios 
       SET 
         nombre_completo = $1, 
         dni = $2, 
         telefono = $3, 
         email = $4, 
         direccion = $5, 
         numero_espacios = $6, 
         ubicacion_espacios = $7, 
         estado = $8, 
         observaciones = $9
       WHERE id = $10 
       RETURNING *`,
      [nombre_completo, dni, telefono, email, direccion, numero_espacios, ubicacion_espacios, estado, observaciones, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({
      message: 'Cliente actualizado exitosamente',
      client: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ message: 'Error al actualizar el cliente' });
  }
});

// ELIMINAR CLIENTE POR ID
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM clientes_espacios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ message: 'Error al eliminar el cliente' });
  }
});

//PAMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

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
  console.log('Body recibido:', req.body);

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
//  Obtener solicitudes de asesoría general
app.get("/api/asesoria-general", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM solicitudes_asesoria_general ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes de asesoría general:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

//  Obtener solicitudes de planes funerarios (entierro)
app.get("/api/planes-funerarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM solicitudes_planes_funerarios ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes de planes funerarios:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

//  Obtener solicitudes de planes de cremación
app.get("/api/planes-cremacion", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM solicitudes_planes_cremacion ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener solicitudes de cremación:", error);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});


app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});


