//для проксирования на проде. В корне папки
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Раздача статики
app.use(express.static(path.join(__dirname, 'dist')));

// Прокси для API
app.use('/api', createProxyMiddleware({  // Используем тот же /api префикс
  target: 'http://185.71.82.247:3000',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }  // Удаляем /api при проксировании
}));

// Обработка SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(5050, () => {
  console.log('Meteo frontend running on port 5050');
});