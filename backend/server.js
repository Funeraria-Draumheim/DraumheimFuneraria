const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a TU base de datos Draumheim
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'funeraria_db',
  password: '12345678',
  port: 5432,
});

app.listen(5000, () => {
  console.log('Servidor en http://localhost:5000');
});