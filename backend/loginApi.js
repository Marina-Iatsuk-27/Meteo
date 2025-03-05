//const express = require('express'); чтобы использовать require (старый метод), надо отключить "type": "module" в package.json, либо использовать import
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const mysql = require('mysql2');
// const cors = require('cors'); // Для поддержки CORS-запросов
// require('dotenv').config(); //для паролей

import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

// Инициализация dotenv для import
dotenv.config();

const app = express();
const SECRET_KEY = 'your_secret_key'; // Замените на безопасный ключ
app.use(cors());
app.use(bodyParser.json());
  

// Создание подключения к MySQL
const db = mysql.createConnection({
  host: process.env.HOST,
  password: process.env.PASSWORD,
  user: 'root',          // Имя пользователя
  database: 'meteo',  // Название  базы данных
  port: 3306             // Порт MySQL
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
  });

  // Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.query(query, [username, hashedPassword], (err) => {
      if (err) return res.status(500).send('Ошибка регистрации пользователя');
      res.status(201).send('Пользователь зарегистрирован');
    });
  });
  
  // Логин пользователя
  app.post('/login', (req, res) => {
    
    const { username, password } = req.body;
    
    const query = `SELECT * FROM users WHERE username = ?`;
    db.query(query, [username], async (err, results) => {
      if (err) return res.status(500).send('Ошибка регистрации');
      console.log(err);
      if (results.length === 0) return res.status(400).send('Пользователь не найден');
  
      const user = results[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).send('Неверный пароль');
  
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    });
  });
  
  
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});