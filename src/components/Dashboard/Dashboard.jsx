// Dashboard.js
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import styles from './Dashboard.module.scss';

const Dashboard = ({ deviceData, isMeteo, isGround }) => {

  console.log('xnj d devisedata на странице девайса: ',deviceData);
  if (!deviceData) return null;

    // Функция для определения цвета влажности воздуха
const getAirHumidityColor = (indicator) => {
  if (indicator < 30) return '#889069'; // светло-хаки (низкая влажность)
  if (indicator >= 30 && indicator < 60) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (высокая влажность)
};

// Функция для определения цвета температуры воздуха
const getAirTemperatureColor = (indicator) => {
  if (indicator < 15) return '#5e7ce2'; // мягкий синий (холодно)
  if (indicator >= 15 && indicator <= 25) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (жарко)
};

// Функция для определения цвета атмосферного давления
const getAirPressureColor = (indicator) => {
  if (indicator < 740) return '#5e7ce2'; // мягкий синий (низкое)
  if (indicator >= 740 && indicator <= 779) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (высокое)
};

// Функция для определения цвета температуры почвы
const getGroundTemperatureColor = (indicator) => {
  if (indicator < 16) return '#5e7ce2'; // мягкий синий (холодно)
  if (indicator >= 16 && indicator <= 22) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (жарко)
};

// Функция для определения цвета влажности почвы
const getGroundHumidityColor = (indicator) => {
  if (indicator < 10) return '#5e7ce2'; // мягкий синий (сухо)
  if (indicator >= 10 && indicator <= 40) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (влажно)
};

// Функция для определения цвета проводимости почвы (EC)
const getGroundConductivityColor = (indicator) => {
  if (indicator < 200) return '#5e7ce2'; // мягкий синий (низкая)
  if (indicator >= 200 && indicator <= 1200) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (высокая)
};

// Функция для определения цвета pH почвы
const getGroundPHColor = (indicator) => {
  if (indicator < 5) return '#5e7ce2'; // мягкий синий (кислая)
  if (indicator >= 5 && indicator <= 8) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (щелочная)
};

// Функция для определения цвета содержания азота в почве
const getGroundNitrogenColor = (indicator) => {
  if (indicator < 20) return '#5e7ce2'; // мягкий синий (недостаток)
  if (indicator >= 20 && indicator <= 50) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (избыток)
};

// Функция для определения цвета содержания фосфора в почве
const getGroundPhosphorusColor = (indicator) => {
  if (indicator < 15) return '#5e7ce2'; // мягкий синий (недостаток)
  if (indicator >= 15 && indicator <= 30) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (избыток)
};

// Функция для определения цвета содержания калия в почве
const getGroundPotassiumColor = (indicator) => {
  if (indicator < 50) return '#5e7ce2'; // мягкий синий (недостаток)
  if (indicator >= 50 && indicator <= 200) return '#606c38'; // основной хаки (норма)
  return '#d1603d'; // терракотовый (избыток)
};

 // Функции для получения статусов
 const getAirHumidityStatus = (indicator) => {
  if (indicator < 30) return 'Низкая';
  if (indicator >= 30 && indicator < 60) return 'Норма';
  return 'Высокая';
};

const getAirTemperatureStatus = (indicator) => {
  if (indicator < 15) return 'Холодно';
  if (indicator >= 15 && indicator <= 25) return 'Норма';
  return 'Жарко';
};

const getAirPressureStatus = (indicator) => {
  if (indicator < 740) return 'Низкое';
  if (indicator >= 740 && indicator <= 779) return 'Норма';
  return 'Высокое';
};

const getGroundTemperatureStatus = (indicator) => {
  if (indicator < 16) return 'Холодно';
  if (indicator >= 16 && indicator <= 22) return 'Норма';
  return 'Жарко';
};

const getGroundHumidityStatus = (indicator) => {
  if (indicator < 10) return 'Сухо';
  if (indicator >= 10 && indicator <= 40) return 'Норма';
  return 'Влажно';
};

const getGroundConductivityStatus = (indicator) => {
  if (indicator < 200) return 'Низкая';
  if (indicator >= 200 && indicator <= 1200) return 'Норма';
  return 'Высокая';
};

const getGroundPHStatus = (indicator) => {
  if (indicator < 5) return 'Кислая';
  if (indicator >= 5 && indicator <= 8) return 'Норма';
  return 'Щелочная';
};

const getGroundNitrogenStatus = (indicator) => {
  if (indicator < 20) return 'Недостаток';
  if (indicator >= 20 && indicator <= 50) return 'Норма';
  return 'Избыток';
};

const getGroundPhosphorusStatus = (indicator) => {
  if (indicator < 15) return 'Недостаток';
  if (indicator >= 15 && indicator <= 30) return 'Норма';
  return 'Избыток';
};

const getGroundPotassiumStatus = (indicator) => {
  if (indicator < 50) return 'Недостаток';
  if (indicator >= 50 && indicator <= 200) return 'Норма';
  return 'Избыток';
};
            

if (isMeteo) {
  const temperature = deviceData.state.uplink.object.temperature || 0;
  const humidity = deviceData.state.uplink.object.humidity || 0;
  const pressure = deviceData.state.uplink.object.pressure || 0;
  const rainfall = deviceData.state.uplink.object.rainfall || 0;

  return (
    <div className={styles.infoDashboard}>
      <div className={styles.dataSection}>
        <div className={styles.gaugeContainer}>
          <h3>Влажность воздуха</h3>
          <RadialBarChart
            width={150}
            height={150}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            data={[{ value: humidity }]}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              fill={getAirHumidityColor(humidity)}
            />
          </RadialBarChart>
          <div className={styles.label}>{humidity}%</div>
          <div className={styles.status} style={{ color: getAirHumidityColor(humidity) }}>
            {getAirHumidityStatus(humidity)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Температура воздуха</h3>
          <RadialBarChart
            width={150}
            height={150}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={[{ value: temperature }]}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 50]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              fill={getAirTemperatureColor(temperature)}
            />
          </RadialBarChart>
          <div className={styles.label}>{temperature}°C</div>
          <div className={styles.status} style={{ color: getAirTemperatureColor(temperature) }}>
            {getAirTemperatureStatus(temperature)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Атмосф. давление</h3>
          <div className={styles.pressureValue} style={{ color: getAirPressureColor(pressure) }}>
            {pressure} мм рт. ст.
          </div>
          <div className={styles.status} style={{ color: getAirPressureColor(pressure) }}>
            {getAirPressureStatus(pressure)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Осадки</h3>
          <div className={styles.rainfall}>{rainfall} мм</div>
        </div>
      </div>
    </div>
  );
} else if (isGround) {
  const temperature = deviceData.state.uplink.object.temperature || 0;
  const humidity = deviceData.state.uplink.object.humidity || 0;
  const conductivity = deviceData.state.uplink.object.conductivity || 0;
  const nitrogen = deviceData.state.uplink.object.nitrogen || 0;
  const phosphorus = deviceData.state.uplink.object.phosphorus || 0;
  const potassium = deviceData.state.uplink.object.potassium || 0;
  const ph = deviceData.state.uplink.object.ph || 0;

  return (
    <div className={styles.infoDashboard}>
      <div className={styles.dataSection}>
        <div className={styles.gaugeContainer}>
          <h3>Температура</h3>
          <RadialBarChart
            width={150}
            height={150}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={[{ value: temperature }]}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 50]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              fill={getGroundTemperatureColor(temperature)}
            />
          </RadialBarChart>
          <div className={styles.label}>{temperature}°C</div>
          <div className={styles.status} style={{ color: getGroundTemperatureColor(temperature) }}>
            {getGroundTemperatureStatus(temperature)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Влажность</h3>
          <RadialBarChart
            width={150}
            height={150}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            data={[{ value: humidity }]}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              fill={getGroundHumidityColor(humidity)}
            />
          </RadialBarChart>
          <div className={styles.label}>{humidity}%</div>
          <div className={styles.status} style={{ color: getGroundHumidityColor(humidity) }}>
            {getGroundHumidityStatus(humidity)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Проводимость</h3>
          <div className={styles.value} style={{ color: getGroundConductivityColor(conductivity)}}>
            {conductivity} мкСм/см
          </div>
          <div className={styles.status} style={{ color: getGroundConductivityColor(conductivity) }}>
            {getGroundConductivityStatus(conductivity)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Азот (N)</h3>
          <div className={styles.value} style={{ color: getGroundNitrogenColor(nitrogen) }}>
            {nitrogen} мг/л
          </div>
          <div className={styles.status} style={{ color: getGroundNitrogenColor(nitrogen) }}>
            {getGroundNitrogenStatus(nitrogen)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Фосфор (P)</h3>
          <div className={styles.value} style={{ color: getGroundPhosphorusColor(phosphorus) }}>
            {phosphorus} мг/л
          </div>
          <div className={styles.status} style={{ color: getGroundPhosphorusColor(phosphorus) }}>
            {getGroundPhosphorusStatus(phosphorus)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Калий (K)</h3>
          <div className={styles.value} style={{ color: getGroundPotassiumColor(potassium)}}>
            {potassium} мг/л
          </div>
          <div className={styles.status} style={{ color: getGroundPotassiumColor(potassium) }}>
            {getGroundPotassiumStatus(potassium)}
          </div>
        </div>

        <div className={styles.gaugeContainer}>
          <h3>pH Уровень</h3>
          <RadialBarChart
            width={150}
            height={150}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="100%"
            startAngle={180}
            endAngle={0}
            data={[{ value: ph * 10 }]}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              fill={getGroundPHColor(ph)}
            />
          </RadialBarChart>
          <div className={styles.label}>{ph}</div>
          <div className={styles.status} style={{ color: getGroundPHColor(ph) }}>
            {getGroundPHStatus(ph)}
          </div>
        </div>
      </div>
    </div>
  );
}

return null;
};

export default Dashboard;
