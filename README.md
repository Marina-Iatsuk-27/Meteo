npm install
npm install -D sass-embedded
npm install react-router-dom
npm install react-chartjs-2 chart.js
npm install recharts

<!-- для sql -->
npm install express body-parser mysql2 bcrypt jsonwebtoken cors
npm install axios


<!-- для паролей:  -->
npm install dotenv
<!-- для карты:  -->
npm install react-leaflet leaflet
<!-- для иконок:  -->
npm install react-icons
<!-- для таблицы эксель:  -->
npm install xlsx


<!-- открыть: -->
node backend/api.cjs  
npm run dev 




запуск:
node backend/api.cjs
npm run dev

qwertasdf2

<!-- Зависимости для бэкенда на сервак: -->
npm install pg bcrypt express jsonwebtoken cors dotenv



<!-- Для прода: -->
Везде вместо http://localhost:5001 ставить /internal-api

В сервисах перед /data и /devices ставить /api

<!-- ЛОГИНЫ -->
Роль admin проставляем вручную в БД (UPDATE users
SET role = 'admin'
WHERE username = 'admin';)
таблица в БД вот такая:
users;
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default              
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null | 
 password | character varying(255) |           | not null | 
 role     | character varying(20)  |           |          | 'user'::character varying
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)

    создание таблицы справочника:
    sudo -u postgres psql -d meteo -c "
CREATE TABLE reference_data (
    id SERIAL PRIMARY KEY,
    region VARCHAR(255) NOT NULL,
    airTempMin VARCHAR(50),
    airTempMax VARCHAR(50),
    airHumidityMin VARCHAR(50),
    airHumidityMax VARCHAR(50),
    pressureMin VARCHAR(50),
    pressureMax VARCHAR(50),
    windDirectionMin VARCHAR(50),
    windDirectionMax VARCHAR(50),
    soilConductivityMin VARCHAR(50),
    soilConductivityMax VARCHAR(50),
    soilPHMin VARCHAR(50),
    soilPHMax VARCHAR(50),
    soilTempMin VARCHAR(50),
    soilTempMax VARCHAR(50),
    nitrogenMin VARCHAR(50),
    nitrogenMax VARCHAR(50),
    phosphorusMin VARCHAR(50),
    phosphorusMax VARCHAR(50),
    potassiumMin VARCHAR(50),
    potassiumMax VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
"
права на таблицу (вне sql) (иначе нельзя будет подключиться к таблице):
sudo -u postgres psql -d meteo -c "
GRANT ALL PRIVILEGES ON TABLE users TO \"postgres-meteo\";
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO \"postgres-meteo\";
"

sudo -u postgres psql -d meteo -c "
GRANT ALL PRIVILEGES ON TABLE reference_data TO \"postgres-meteo\";
GRANT USAGE, SELECT ON SEQUENCE reference_data_id_seq TO \"postgres-meteo\";
"

//или вот так не входя в sql:
sudo -u postgres psql -d meteo -c "
CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    deviceName VARCHAR(255) NOT NULL,
    devEui VARCHAR(255) UNIQUE NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
GRANT ALL PRIVILEGES ON TABLE sensors TO \"postgres-meteo\";
GRANT USAGE, SELECT ON SEQUENCE sensors_id_seq TO \"postgres-meteo\";
"


meteo=> \d sensors
                                        Table "public.sensors"
   Column   |            Type             | Collation | Nullable |               Default               
------------+-----------------------------+-----------+----------+-------------------------------------
 id         | integer                     |           | not null | nextval('sensors_id_seq'::regclass)
 devicename | character varying(255)      |           | not null | 
 deveui     | character varying(255)      |           | not null | 
 latitude   | numeric(10,8)               |           |          | 
 longitude  | numeric(11,8)               |           |          | 
 created_at | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "sensors_pkey" PRIMARY KEY, btree (id)
    "sensors_deveui_key" UNIQUE CONSTRAINT, btree (deveui)

meteo=> 