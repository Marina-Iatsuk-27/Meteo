const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Создание таблицы (если не существует)
// pool.query(`
//   CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL
//   )
// `, (err) => {
//   if (err) console.error('Ошибка создания таблицы:', err);
//   else console.log('Таблица users готова');
// });

// Проверка подключения:
pool.query('SELECT 1 FROM users LIMIT 1', (err) => {
  if (err) {
    console.error('Ошибка доступа к таблице users:', err.message);
    console.log('Таблица не существует или нет прав доступа');
    process.exit(1); // Завершаем процесс с ошибкой
  } else {
    console.log('Подключение к БД успешно, таблица users доступна');
  }
});

// Регистрация
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );
    res.status(201).send('Пользователь зарегистрирован');
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    res.status(500).send('Ошибка регистрации');
  }
});

// Логин
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (rows.length === 0) return res.status(400).send('Пользователь не найден');
    
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Неверный пароль');

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).send('Ошибка входа');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});