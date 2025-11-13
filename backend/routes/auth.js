const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'funeraria',
    password: '12345678',
    port: 5432,
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leonardofvtvrehbomax@gmail.com',
        pass: 'jhejajbwdejhmdsn'
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log('Error Gmail: ', error);
    } else {
        console.log('Gmail configurado correctamente');
    }
});

//codigos temposares 2FA
const verificationCodes = new Map();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // PRIMERO buscar en usuarios
        let userQuery = 'SELECT * FROM usuarios WHERE email = $1';
        let userResult = await pool.query(userQuery, [email]);
        let user = userResult.rows[0];
        let userType = 'usuario';

        // SI no existe en usuarios, buscar en empleados
        if (!user) {
            userQuery = 'SELECT * FROM empleados WHERE email = $1 AND activo = true';
            userResult = await pool.query(userQuery, [email]);
            user = userResult.rows[0];
            userType = 'empleado';
        }

        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar contraseña según el tipo de usuario
        let validPassword = false;
        
        if (userType === 'usuario') {
            // Para usuarios, usar bcrypt
            validPassword = await bcrypt.compare(password, user.password_hash);
        } else {
            // Para empleados, comparación directa (texto plano)
            validPassword = (password === user.contraseña);
        }

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        verificationCodes.set(email, {
            code: code,
            expires: Date.now() + 10 * 60 * 1000,
            userId: user.id,
            userType: userType // Guardar el tipo de usuario
        });

        console.log(`Codigo de autentificacion para ${email}: ${code}`);

        try {
            await transporter.sendMail({
                from: '"Draumheim" <leonardofvtvrehbomax@gmail.com>',
                to: email,
                subject: 'Codigo de autentificacion - Draumheim',
                html: `
                    <h2>Codigo de autentificacion</h2>
                    <p>Tu codigo es: <strong>${code}</strong></p>
                    <p>Valido por 10 minutos<p>
                `
            });

            console.log(`Email enviado a: ${email}`);

        } catch (emailError) {
            console.error('Error al enviar el email: ', emailError);
        }

        res.json({
            success: true,
            message: 'Codigo de autentificacion enviado a tu email',
            requires2FA: true
        });
    } catch (error) {
        console.error('Error en el login: ', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//Verificacion del codigo
router.post('/verify-2fa', async (req, res) => {
    try {
        const { email, code } = req.body;

        const storedData = verificationCodes.get(email);

        if (!storedData) {
            return res.status(400).json({ message: 'Codigo invalido o expirado' });
        }

        if (Date.now() > storedData.expires) {
            verificationCodes.delete(email);
            return res.status(400).json({ message: 'Codigo expirado' });
        }

        if (storedData.code !== code) {
            return res.status(400).json({ message: 'Codigo incorrecto' });
        }

        verificationCodes.delete(email);

        let user;
        
        if (storedData.userType === 'empleado') {
            // Buscar empleado y asignar rol
            const userQuery = 'SELECT id, nombre_empleado, email, puesto, activo FROM empleados WHERE email = $1';
            const userResult = await pool.query(userQuery, [email]);
            user = userResult.rows[0];
            
            // Convertir empleado a formato de usuario con rol
            if (user) {
                user.rol = user.puesto === 'admin' ? 'admin' : 'empleado';
                user.nombre_completo = user.nombre_empleado;
            }
        } else {
            // Buscar usuario normal
            const userQuery = 'SELECT id, nombre_completo, email, rol FROM usuarios WHERE email = $1';
            const userResult = await pool.query(userQuery, [email]);
            user = userResult.rows[0];
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                rol: user.rol,
                userType: storedData.userType || 'usuario'
            },
            'draumheim-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                nombre: user.nombre_completo,
                email: user.email,
                rol: user.rol,
                userType: storedData.userType || 'usuario'
            }
        });
    } catch (error) {
        console.error('Error en verify-2fa: ', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

//Reenviar codigo
router.post('/resend-2fa', async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar en ambas tablas
        let userQuery = 'SELECT id FROM usuarios WHERE email = $1';
        let userResult = await pool.query(userQuery, [email]);
        let user = userResult.rows[0];
        let userType = 'usuario';

        if (!user) {
            userQuery = 'SELECT id FROM empleados WHERE email = $1 AND activo = true';
            userResult = await pool.query(userQuery, [email]);
            user = userResult.rows[0];
            userType = 'empleado';
        }

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const newCode = Math.floor(100000 + Math.random() * 900000).toString();

        verificationCodes.set(email, {
            code: newCode,
            expires: Date.now() + 10 * 60 * 1000,
            userId: user.id,
            userType: userType
        });

        console.log(`Nuevo codigo de autentificacion ${email}: ${newCode}`);

        try {
            await transporter.sendMail({
                from: '"Draumheim" <leonardofvtvrehbomax@gmail.com>',
                to: email,
                subject: 'Codigo de autentificacion - Draumheim',
                html: `
                    <h2>Codigo de autentificacion</h2>
                    <p>Tu codigo es: <strong>${newCode}</strong></p>
                    <p>Valido por 10 minutos<p>
                `
            });

            console.log(`Email enviado a: ${email}`);

        } catch (emailError) {
            console.error('Error al enviar el email: ', emailError);
        }

        res.json({
            success: true,
            message: 'Nuevo codigo enviado a tu email'
        });
    } catch (error) {
        console.error('Error reenviando el codigo: ', error);
        res.status(500).json({ message: 'Error del servidor' })
    }
});

module.exports = router;