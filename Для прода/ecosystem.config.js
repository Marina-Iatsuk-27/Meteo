module.exports = {
  apps: [
    // Основной сервер (frontend) - порт 5050
    {
      name: "meteo-frontend",
      script: "/home/marina/projects/meteostation-react/Meteo/server.cjs",
      env: {
        PORT: 5050,
        NODE_ENV: "production"
      }
    },
    // Бэкенд API - порт 5001
    {
      name: "meteo-internal-api",
      cwd: "/home/marina/projects/meteostation-react/Meteo", // чтобы .env и прочее подтянулось из проекта
      script: "./backend/api.cjs",
      env: {
        PORT: 5001,
        NODE_ENV: "production",
        DB_USER: "postgres-meteo",
        DB_HOST: "185.71.82.247",
        DB_NAME: "meteo",
        DB_PASSWORD: "qazwsxedc",
        DB_PORT: "5432",
        SECRET_KEY: "77bc28196c3247366fbeed844927c124cf5358886f7dc20b95f0dd103dfe69af"
      }
    },
    // Бэкенд для вебхука - порт 3000
    {
      name: "chirp-webhook",
      cwd: "/home/marina/projects/chirp-webhook", // ВАЖНО: база chirp_data.db лежит тут
      script: "server.js",
      env: {
        PORT: 3000,
        NODE_ENV: "production"
      }
    }
  ]
}
