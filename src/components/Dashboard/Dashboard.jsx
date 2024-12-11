// Dashboard.js
import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import styles from './Dashboard.module.scss';

const Dashboard = ({ deviceData, isMeteo, isGround }) => {

  console.log('xnj d devisedata на странице девайса: ',deviceData);
  if (!deviceData) return null;

    // Функция для определения цвета влажности воздуха
    const getAirHumidityColor = (indicator) => {
        if (indicator < 30) return '#4682B4'; // синий
        if (indicator >= 30 && indicator < 60) return '#32CD32'; // зеленый
        return '#FF6347'; // красный
      };
    
      // Функция для определения цвета температуры воздуха
      const getAirTemperatureColor = (indicator) => {
        if (indicator < 15) return '#0000ff'; // синий
        if (indicator >= 15 && indicator <= 25) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };

      //атмосферное давление
      const getAirPressureColor = (indicator) => {
              if (indicator < 740) return '#0000ff'; // синий
              if (indicator >= 740 && indicator <= 779) return '#32CD32'; // зеленый
              return '#ff0000'; // красный
            };

      // Температурпа почвы
      const getGroundTemperatureColor = (indicator) => {
        if (indicator < 16) return '#0000ff'; // синий
        if (indicator >= 16 && indicator <= 22) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };

      // Влажность почвы
      const getGroundHumidityColor = (indicator) => {
        if (indicator < 10) return '#0000ff'; // синий
        if (indicator >= 10 && indicator <= 40) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };

      // Проводимость ЕС
      const getGroundConductivityColor = (indicator) => {
        if (indicator < 200) return '#0000ff'; // синий
        if (indicator >= 200 && indicator <= 1200) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };
      
      // PH
      const getGroundPHColor = (indicator) => {
        if (indicator < 5) return '#0000ff'; // синий
        if (indicator >= 5 && indicator <= 8) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };

      // азот
      const getGroundNitrogenColor = (indicator) => {
        if (indicator < 20) return '#0000ff'; // синий
        if (indicator >= 20 && indicator <= 50) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };

      // фосфор
      const getGroundPhosphorusColor = (indicator) => {
        if (indicator < 15) return '#0000ff'; // синий
        if (indicator >= 15 && indicator <= 30) return '#32CD32'; // зеленый
        return '#ff0000'; // красный
      };

      // калий
      const getGroundPotassiumColor = (indicator) => {
        if (indicator < 50) return '#0000ff'; // синий
        if (indicator >= 50 && indicator <= 200) return '#32CD32'; // зеленый
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
          <div className={styles.pressureValue} style={{ color: getAirPressureColor(pressure) }}>{pressure} мм рт. ст.</div>
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
                fill={getGroundTemperatureColor(temperature)}
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
                fill={getGroundHumidityColor(humidity)}
              />
            </RadialBarChart>
            <div className={styles.label}>{humidity}%</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Проводимость</h3>
            <div className={styles.value} style={{ color: getGroundConductivityColor(conductivity)}}>{conductivity} мкСм/см</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Азот (N)</h3>
            <div className={styles.value} style={{ color: getGroundNitrogenColor(nitrogen) }}>{nitrogen} мг/л</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Фосфор (P)</h3>
            <div className={styles.value} style={{ color: getGroundPhosphorusColor(phosphorus) }}>{phosphorus} мг/л</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Калий (K)</h3>
            <div className={styles.value} style={{ color: getGroundPotassiumColor(potassium)}}>{potassium} мг/л</div>
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
                fill={getGroundPHColor(humidity)}
               
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
