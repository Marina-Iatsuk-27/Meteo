import React, { useContext,useState,useEffect } from 'react';
import style from './InfoDashboard.module.scss';
import Loader from "../Loader/Loader";
import { DevicesListContext } from "../../context/GetDevicesList";
import ChartModal from '../ChartModal/ChartModal'

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
  //console.log('что в devicesList в инфодашборд:',devicesList);
  const [activeChart, setActiveChart] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Загружаем выбранный регион из localStorage
  useEffect(() => {
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
      setSelectedRegion(JSON.parse(savedRegion));
    }
  }, []);
  

  if (!devicesList || devicesList.length === 0) {
    return <Loader text="Загружаем данные..." />;
  }

  // Функции сравнения (такие же как в Dashboard)
  const neutralColor = "#9fa786";

  const getComparisonStatus = (value, min, max, goodText = "Норма", lowText = "Низкое", highText = "Высокое") => {
    if (value === null || min === null || max === null) return "Нет данных";
    if (value < min) return lowText;
    if (value > max) return highText;
    return goodText;
  };

  const getComparisonColor = (value, min, max, goodColor = "#606c38", lowColor = "#6b84c4", highColor = "#d1603d") => {
    if (value === null || min === null || max === null) return neutralColor;
    if (value < min) return lowColor;
    if (value > max) return highColor;
    return goodColor;
  };

  // Функция для получения цвета значения в зависимости от региона
  const getValueColor = (value, metricKey) => {
    if (!selectedRegion || value === null) return 'inherit';
    
    const min = selectedRegion[`${metricKey}min`];
    const max = selectedRegion[`${metricKey}max`];
    
    if (min === null || max === null) return 'inherit';
    
    return getComparisonColor(value, min, max);
  };

  // Функция для получения статуса значения
  const getValueStatus = (value, metricKey, goodText, lowText, highText) => {
    if (!selectedRegion || value === null) return null;
    
    const min = selectedRegion[`${metricKey}min`];
    const max = selectedRegion[`${metricKey}max`];
    
    if (min === null || max === null) return null;
    
    return getComparisonStatus(value, min, max, goodText, lowText, highText);
  };



// Универсальная функция нормализации пакета
const normalizePacket = (packet) => {
  let data = { ...packet };
  
  if (packet.raw_data) {
    try {
      const parsed = JSON.parse(packet.raw_data);
      if (parsed.object) {
        for (let key in parsed.object) {
          // Подставляем только если сейчас null или undefined
          if (
            (data[key] === null || data[key] === undefined) &&
            parsed.object[key] !== "undefined" &&
            parsed.object[key] !== null
          ) {
            // Преобразуем числовые строки в число
            const num = parseFloat(parsed.object[key]);
            data[key] = isNaN(num) ? parsed.object[key] : num;
          }
        }
      }
    } catch (err) {
      console.error("Ошибка парсинга raw_data:", err);
    }
  }
  
  return data;
};

// Для meteo — объединяем 3 пакета
const mergeMeteoData = (readings) => {
  const result = {};
  readings.map(normalizePacket).forEach(packet => {
    for (let key in packet) {
      if (packet[key] !== null && key !== "time") {
        result[key] = result[key] ?? packet[key];
      }
    }
  });
  console.log('result',result);
  
  return result;
};

// Для ground — берём первый по убыванию времени с данными
const pickLatestGroundData = (readings) => {
  for (let packet of readings.map(normalizePacket)) {
    const hasData = Object.keys(packet).some(key =>
      ['temperature', 'humidity', 'ph', 'conductivity'].includes(key) && packet[key] !== null
    );
    if (hasData) return packet;
  }
  return null;
};


const renderGroundData = (data, device) => (
  <div className={style.dataList}>
    <h1 className={style.title}>Показатели почвы</h1>
    {selectedRegion && (
      <div className={style.regionInfo}>
        Сравнение с: {selectedRegion.region}
      </div>
    )}
    <div className={style.rows}>
      <RenderRow 
        icon={iconConductivity} 
        label="Проводимость" 
        value={data.conductivity} 
        unit="мСм/см" 
        device={device} 
        metric="conductivity"
        valueColor={getValueColor(data.conductivity, 'soilconductivity')}
        status={getValueStatus(data.conductivity, 'soilconductivity', "Норма", "Низкая", "Высокая")}
      />
      <RenderRow 
        icon={iconPh} 
        label="pH" 
        value={data.ph} 
        unit="pH" 
        device={device} 
        metric="ph"
        valueColor={getValueColor(data.ph, 'soilph')}
        status={getValueStatus(data.ph, 'soilph', "Норма", "Кислая", "Щелочная")}
      />
      <RenderRow 
        icon={iconSoilHumidity} 
        label="Влажность почвы" 
        value={data.humidity} 
        unit="%" 
        device={device} 
        metric="humidity"
        valueColor={getValueColor(data.humidity, 'airhumidity')}
        status={getValueStatus(data.humidity, 'airhumidity', "Норма", "Сухо", "Влажно")}
      />
      <RenderRow 
        icon={iconSoilTemperature} 
        label="Температура почвы" 
        value={data.temperature} 
        unit="°C" 
        device={device} 
        metric="temperature"
        valueColor={getValueColor(data.temperature, 'soiltemp')}
        status={getValueStatus(data.temperature, 'soiltemp', "Норма", "Холодно", "Жарко")}
      />
      <RenderRow 
        icon={iconNitrogen} 
        label="Азот" 
        value={data.nitrogen} 
        unit="г/кг" 
        device={device} 
        metric="nitrogen"
        valueColor={getValueColor(data.nitrogen, 'nitrogen')}
        status={getValueStatus(data.nitrogen, 'nitrogen')}
      />
      <RenderRow 
        icon={iconPhosphorus} 
        label="Фосфор" 
        value={data.phosphorus} 
        unit="г/кг" 
        device={device} 
        metric="phosphorus"
        valueColor={getValueColor(data.phosphorus, 'phosphorus')}
        status={getValueStatus(data.phosphorus, 'phosphorus')}
      />
      <RenderRow 
        icon={iconPotassium} 
        label="Калий" 
        value={data.potassium} 
        unit="г/кг" 
        device={device} 
        metric="potassium"
        valueColor={getValueColor(data.potassium, 'potassium')}
        status={getValueStatus(data.potassium, 'potassium')}
      />
    </div>
  </div>
);

const renderMeteoData = (data, device) => (
  <div className={style.dataList}>
    <h1 className={style.title}>Показатели воздуха</h1>
    {selectedRegion && (
      <div className={style.regionInfo}>
        Сравнение с: {selectedRegion.region}
      </div>
    )}
    <div className={style.rows}>
      <RenderRow 
        icon={iconAirTemperature} 
        label="Температура воздуха" 
        value={data.temperature} 
        unit="°C" 
        device={device} 
        metric="temperature"
        valueColor={getValueColor(data.temperature, 'airtemp')}
        status={getValueStatus(data.temperature, 'airtemp', "Норма", "Холодно", "Жарко")}
      />
      <RenderRow 
        icon={iconAirHumidity} 
        label="Влажность воздуха" 
        value={data.humidity} 
        unit="%" 
        device={device} 
        metric="humidity"
        valueColor={getValueColor(data.humidity, 'airhumidity')}
        status={getValueStatus(data.humidity, 'airhumidity', "Норма", "Низкая", "Высокая")}
      />
      <RenderRow 
        icon={iconPressure} 
        label="Давление" 
        value={data.pressure} 
        unit="мм рт. ст." 
        device={device} 
        metric="pressure"
        valueColor={getValueColor(data.pressure, 'pressure')}
        status={getValueStatus(data.pressure, 'pressure', "Норма", "Низкое", "Высокое")}
      />
      <RenderRow 
        icon={iconRainfall} 
        label="Осадки" 
        value={data.rainfall} 
        unit="мм" 
        device={device} 
        metric="rainfall"
      />
      <RenderRow 
        icon={iconWindSpeed} 
        label="Скорость ветра (средняя)" 
        value={data.windSpeedAvg} 
        unit="м/с" 
        device={device} 
        metric="windSpeedAvg"
      />
      <RenderRow 
        icon={iconWindSpeed} 
        label="Скорость ветра (мин)" 
        value={data.windSpeedMin} 
        unit="м/с" 
        device={device} 
        metric="windSpeedMin"
      />
      <RenderRow 
        icon={iconWindSpeed} 
        label="Скорость ветра (макс)" 
        value={data.windSpeedMax} 
        unit="м/с" 
        device={device} 
        metric="windSpeedMax"
      />
      <WindDirectionRow direction={data.windDirectionAvg} label="Направление ветра (среднее)" device={device} metric="windDirectionAvg" />
      <WindDirectionRow direction={data.windDirectionMax} label="Направление ветра (макс)" device={device} metric="windDirectionMax" />
      <RenderRow 
        icon={iconUV} 
        label="UV-индекс" 
        value={data.uvIndex} 
        device={device} 
        metric="uvIndex"
      />
    </div>
  </div>
);

  const handleRowClick = (device, metric) => {
    setSelectedDevice(device);
    setActiveChart(metric);
  };

  const closeChartModal = () => {
    setActiveChart(null);
    setSelectedDevice(null);
  };

  const RenderRow = ({ icon, label, value, unit, device, metric, valueColor = 'inherit', status }) => (
    <div 
      className={style.dataRow} 
      onClick={() => handleRowClick(device, metric)}
      style={{ cursor: 'pointer' }}
    >
      <img src={icon} alt={label} className={style.icon} />
      <div className={style.dataInfo}>
        <div className={style.label}>{label}:</div>
        <div className={style.dataIndication}>
          <div className={style.text} style={{ color: valueColor }}>
            {value ?? '-'}
            {status && (
            <span className={style.status} style={{ color: valueColor }}>
              ({status})
            </span>
          )}
          </div>
          <div className={style.unit}>{value !== null ? unit : ''}</div>
          
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
      return data ? renderGroundData(data, device) : <p>Нет данных по устройству</p>;
    }

    if (name.includes('meteo')) {
      const data = mergeMeteoData(readings);
      return renderMeteoData(data, device);
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
      
      {/* Модальное окно с графиком */}
      {activeChart && selectedDevice && (
        <ChartModal 
          device={selectedDevice} 
          metric={activeChart} 
          onClose={closeChartModal}
        />
      )}
    </div>
  );


  
}
