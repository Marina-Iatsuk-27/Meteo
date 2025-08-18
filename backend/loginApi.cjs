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

    const token = jwt.sign(
      { id: user.id, role: user.role }, //  добавляем роль в токен
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );
    console.log("user from DB:", user);

    res.json({ token, role: user.role, username: user.username, id: user.id }); // отдаём на фронт
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).send('Ошибка входа');
  }
});

// Middleware: проверка токена и роли
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // { id, role }
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Нет доступа' });
  }
  next();
}

// Получить список пользователей
app.get('/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username, role FROM users ORDER BY id ASC');
    res.json(rows);

    console.log('rows',rows);
    
  } catch (err) {
    console.error('Ошибка получения пользователей:', err);
    res.status(500).send('Ошибка сервера');
  }
});

// Добавить пользователя
app.post('/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role || 'user']
    );
    res.status(201).send('Пользователь добавлен');
  } catch (err) {
    console.error('Ошибка добавления пользователя:', err);
    res.status(500).send('Ошибка сервера');
  }
});

// Удалить пользователя
app.delete('/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.send('Пользователь удалён');
  } catch (err) {
    console.error('Ошибка удаления пользователя:', err);
    res.status(500).send('Ошибка сервера');
  }
});

// Изменить роль пользователя
app.put('/admin/users/:id/role', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    res.send('Роль пользователя изменена');
  } catch (err) {
    console.error('Ошибка обновления роли:', err);
    res.status(500).send('Ошибка сервера');
  }
});

// // Удаление пользователя (админ)
// app.delete('/users/:id', async (req, res) => {
//   try {
//     const userIdToDelete = parseInt(req.params.id);
//     const { id: currentUserId, role } = req.user; // достаём из токена

//     if (role !== 'admin') {
//       return res.status(403).send('Нет прав для удаления');
//     }

//     if (userIdToDelete === currentUserId) {
//       return res.status(400).send('Нельзя удалить самого себя');
//     }

//     await pool.query('DELETE FROM users WHERE id = $1', [userIdToDelete]);
//     res.send('Пользователь удалён');
//   } catch (err) {
//     console.error('Ошибка удаления пользователя:', err);
//     res.status(500).send('Ошибка удаления');
//   }
// });


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});