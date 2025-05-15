require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

app.get('/pokemons', (req, res) => {
  db.query('SELECT * FROM pokemons', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error al obtener los pokemons');
    }
    res.json(results);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo`);
});
