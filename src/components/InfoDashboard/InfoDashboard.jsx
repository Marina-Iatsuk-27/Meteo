import React, { useContext } from 'react';
import style from './InfoDashboard.module.scss';
import Loader from "../Loader/Loader";
import { DevicesListContext } from "../../context/GetDevicesList";

// Иконки 
import iconConductivity from '../../assets/icons/icons8-лабораторные-предметы.png';
import iconPh from '../../assets/icons/icons8-кислота-на-поверхности.png';
import iconSoilHumidity from '../../assets/icons/icons8-влажность.png';
import iconSoilTemperature from '../../assets/icons/icons8-температура.png';
import iconNitrogen from '../../assets/icons/icons8-колба.png';
import iconPhosphorus from '../../assets/icons/icons8-колба.png';
import iconPotassium from '../../assets/icons/icons8-колба.png';
import iconAirTemperature from '../../assets/icons/icons8-температура.png';
import iconAirHumidity from '../../assets/icons/icons8-влажность.png';
import iconPressure from '../../assets/icons/icons8-давление.png';
import iconRainfall from '../../assets/icons/icons8-дождь.png';
import iconWindSpeed from '../../assets/icons/icons8-ветер.png';
import iconWindDirection from '../../assets/icons/icons8-компас.png';
import iconUV from '../../assets/icons/icons8-uv-index.png';

//взяты отсюда: https://icons8.com/icons/set, цвет #88B999



export default function InfoDashboard() {
  const { devicesList } = useContext(DevicesListContext);

  if (!devicesList || devicesList.length === 0) {
    return <Loader text="Загружаем данные..." />;
  }


  // Для meteo: объединяем 3 пакета
  const mergeMeteoData = (readings) => {
    const result = {};
    readings.forEach(packet => {
      for (let key in packet) {
        if (packet[key] !== null && key !== "time") {
          result[key] = result[key] ?? packet[key];
        }
      }
    });
    return result;
  };

  // Для ground: берём первый по убыванию времени, в котором есть данные
  const pickLatestGroundData = (readings) => {
    for (let packet of readings) {
      const hasData = Object.keys(packet).some(key =>
        ['temperature', 'humidity', 'ph', 'conductivity'].includes(key) && packet[key] !== null
      );
      if (hasData) return packet;
    }
    return null;
  };

  const renderGroundData = (data) => (
    <div className={style.dataList}>
      <h1 className={style.title}>Показатели почвы</h1>
      <div className={style.rows}>
        <RenderRow icon={iconConductivity} label="Проводимость" value={data.conductivity} unit="мСм/см" />
        <RenderRow icon={iconPh} label="pH" value={data.ph} unit="pH" />
        <RenderRow icon={iconSoilHumidity} label="Влажность почвы" value={data.humidity} unit="%" />
        <RenderRow icon={iconSoilTemperature} label="Температура почвы" value={data.temperature} unit="°C" />
        <RenderRow icon={iconNitrogen} label="Азот" value={data.nitrogen} unit="г/кг" />
        <RenderRow icon={iconPhosphorus} label="Фосфор" value={data.phosphorus} unit="г/кг" />
        <RenderRow icon={iconPotassium} label="Калий" value={data.potassium} unit="г/кг" />
      </div>
    </div>
  );

  const renderMeteoData = (data) => (
    <div className={style.dataList}>
      <h1 className={style.title}>Показатели воздуха</h1>
      <div className={style.rows}>
        <RenderRow icon={iconAirTemperature} label="Температура воздуха" value={data.temperature} unit="°C" />
        <RenderRow icon={iconAirHumidity} label="Влажность воздуха" value={data.humidity} unit="%" />
        <RenderRow icon={iconPressure} label="Давление" value={data.pressure} unit="мм рт. ст." />
        <RenderRow icon={iconRainfall} label="Осадки" value={data.rainfall} unit="мм" />
        <RenderRow icon={iconWindSpeed} label="Скорость ветра" value={data.windSpeed} unit="м/с" />
        <WindDirectionRow direction={data.windDirection} />
        <RenderRow icon={iconUV} label="UV-индекс" value={data.uvIndex} unit="" />

      </div>
    </div>
  );

  const RenderRow = ({ icon, label, value, unit }) => (
    <div className={style.dataRow}>
      <img src={icon} alt={label} className={style.icon} />
      <div className={style.dataInfo}>
        <span className={style.label}>{label}:</span>
        <div className={style.dataIndication}>
          <span className={style.text}>{value ?? '-'}</span>
          <span className={style.unit}>{value !== null ? unit : ''}</span>
        </div>
      </div>
    </div>
  );

  const WindDirectionRow = ({ direction }) => {
    if (direction === null || direction === undefined) {
      return (
        <div className={style.dataRow}>
          <img src={iconWindDirection} alt="Ветер" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Направление ветра:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>-</span>
            </div>
          </div>
        </div>
      );
    }
  
    const angle = direction % 360;
  
    const directionText = getDirectionText(angle);
  
    return (
      <div className={style.dataRow}>
        <img
          src={iconWindDirection}
          alt="Ветер"
          className={style.icon}
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className={style.dataInfo}>
          <span className={style.label}>Направление ветра:</span>
          <div className={style.dataIndication}>
            <span className={style.text}>{directionText}</span>
          </div>
        </div>
      </div>
    );
  };
  
  const getDirectionText = (angle) => {
    if (angle >= 0 && angle <= 22 || angle > 337) return 'С';
    if (angle > 22 && angle <= 67) return 'СВ';
    if (angle > 67 && angle <= 112) return 'В';
    if (angle > 112 && angle <= 157) return 'ЮВ';
    if (angle > 157 && angle <= 202) return 'Ю';
    if (angle > 202 && angle <= 247) return 'ЮЗ';
    if (angle > 247 && angle <= 292) return 'З';
    if (angle > 292 && angle <= 337) return 'СЗ';
    return '-';
  };
  

  const renderDevice = (device) => {
    const name = device.deviceName.toLowerCase();
    const readings = device.lastReadings;

    if (name.includes('ground')) {
      const data = pickLatestGroundData(readings);
      return data ? renderGroundData(data) : <p>Нет данных по устройству</p>;
    }

    if (name.includes('meteo')) {
      const data = mergeMeteoData(readings);
      return renderMeteoData(data);
    }

    return <p>Тип устройства не распознан</p>;
  };

  return (
    <div className={style.infoDashboardContainer}>
      {devicesList.map(device => (
        <div className={style.card} key={device.devEui}>
          {renderDevice(device)}
        </div>
      ))}
    </div>
  );
}
