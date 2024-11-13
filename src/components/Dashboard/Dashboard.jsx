// Dashboard.js
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import styles from './Dashboard.module.scss';

const Dashboard = ({ deviceData, isMeteo, isGround }) => {
  if (!deviceData) return null;

    // Функция для определения цвета влажности воздуха
    const getAirHumidityColor = (humidity) => {
        if (humidity < 30) return '#4682B4'; // синий
        if (humidity >= 30 && humidity < 60) return '#32CD32'; // зеленый
        return '#FF6347'; // красный
      };
    
      // Функция для определения цвета температуры воздуха
      const getAirTemperatureColor = (temp) => {
        if (temp < 15) return '#0000ff'; // синий
        if (temp >= 15 && temp <= 25) return '#00ff00'; // зеленый
        return '#ff0000'; // красный
      };

  if (isMeteo) {
    // Отображение для метеостанции
    const temperature = deviceData.state.uplink.object.temperature || 0;
    const humidity = deviceData.state.uplink.object.humidity || 0;
    const pressure = deviceData.state.uplink.object.pressure || 0;
    const rainfall = deviceData.state.uplink.object.rainfall || 0;
 



    return (
      <div className={styles.dashboardContainer}>
        {/* <h1 className={styles.title}>Данные метеостанции</h1> */}
        {/* Визуализация для метеостанции */}
        
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
            endAngle={-270} // Полный круг
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
        </div>

        <div className={styles.gaugeContainer}>
          <h3>Атмосф. давление</h3>
          <div className={styles.pressureValue}>{pressure} мм рт. ст.</div>
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
    const saltSaturation = deviceData.state.uplink.object.salt_saturation || 0;
    const nitrogen = deviceData.state.uplink.object.nitrogen || 0;
    const phosphorus = deviceData.state.uplink.object.phosphorus || 0;
    const potassium = deviceData.state.uplink.object.potassium || 0;
    const ph = deviceData.state.uplink.object.ph || 0;

    return (
      <div className={styles.dashboardContainer}>
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
                fill={getTemperatureColor(temperature)}
              />
            </RadialBarChart>
            <div className={styles.label}>{temperature}°C</div>
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
                fill={getHumidityColor(humidity)}
              />
            </RadialBarChart>
            <div className={styles.label}>{humidity}%</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Проводимость</h3>
            <div className={styles.value}>{conductivity} мкСм/см</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Насыщенность солями</h3>
            <div className={styles.value}>{saltSaturation} мг/л</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Азот (N)</h3>
            <div className={styles.value}>{nitrogen} мг/л</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Фосфор (P)</h3>
            <div className={styles.value}>{phosphorus} мг/л</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Калий (K)</h3>
            <div className={styles.value}>{potassium} мг/л</div>
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
                fill="#8A2BE2"
              />
            </RadialBarChart>
            <div className={styles.label}>{ph}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
