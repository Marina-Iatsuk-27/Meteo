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
node backend/loginApi.cjx  
npm run dev 




запуск:
node backend/loginApi
npm run dev

qwertasdf2

<!-- Зависимости для бэкенда на сервак: -->
npm install pg bcrypt express jsonwebtoken cors dotenv

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
