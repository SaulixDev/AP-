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

app.use(express.json()); // Asegura que se pueda leer JSON en el body

app.post('/login', (req, res) => {
  console.log("Iniciando Login")
  const {  alias, contraseña } = req.body;

  if (!alias || !contraseña) {
    return res.status(400).json({ error: 'Faltan nombre de usuario o contraseña' });
  }

  const query = 'SELECT * FROM usuarios WHERE alias = ?';
  db.query(query, [alias], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comparar hash enviado con el hash guardado
    if (user.contraseña !== contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Login correcto, responder con info simple
    res.json({ message: 'Login exitoso', user: { id: user.id, alias: user.alias } });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor corriendo`);
});
