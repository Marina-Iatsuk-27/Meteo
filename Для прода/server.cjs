//для проксирования на проде. В корне папки
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Раздача статики
app.use(express.static(path.join(__dirname, 'dist')));

// Прокси для API внешнего (chirp-http)
app.use('/api', createProxyMiddleware({  // Используем тот же /api префикс
  target: 'http://185.71.82.247:3000',
  changeOrigin: true,
  pathRewrite: { '^/api': '' }  // Удаляем /api при проксировании
}));

// Прокси для API внутреннего (БД)
app.use('/internal-api', createProxyMiddleware({
  target: 'http://185.71.82.247:5001',
  changeOrigin: true,
  pathRewrite: { '^/internal-api': '' }
}));



// Обработка SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(5050, () => {
  //console.log('Meteo frontend running on port 5050');
});