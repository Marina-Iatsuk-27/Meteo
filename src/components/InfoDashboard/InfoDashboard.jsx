import React, { useContext, useState, useEffect } from 'react';
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

export default function InfoDashboard() {
  const { devicesList } = useContext(DevicesListContext);
  const [activeChart, setActiveChart] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [expandedDevices, setExpandedDevices] = useState({});

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

  // Функции сравнения
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

  const getValueColor = (value, metricKey) => {
    if (!selectedRegion || value === null) return 'inherit';
    
    const min = selectedRegion[`${metricKey}min`];
    const max = selectedRegion[`${metricKey}max`];
    
    if (min === null || max === null) return 'inherit';
    
    return getComparisonColor(value, min, max);
  };

  const getValueStatus = (value, metricKey, goodText, lowText, highText) => {
    if (!selectedRegion || value === null) return null;
    
    const min = selectedRegion[`${metricKey}min`];
    const max = selectedRegion[`${metricKey}max`];
    
    if (min === null || max === null) return null;
    
    return getComparisonStatus(value, min, max, goodText, lowText, highText);
  };

  const normalizePacket = (packet) => {
    let data = { ...packet };
    
    if (packet.raw_data) {
      try {
        const parsed = JSON.parse(packet.raw_data);
        if (parsed.object) {
          for (let key in parsed.object) {
            if (
              (data[key] === null || data[key] === undefined) &&
              parsed.object[key] !== "undefined" &&
              parsed.object[key] !== null
            ) {
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

  const mergeMeteoData = (readings) => {
    const result = {};
    readings.map(normalizePacket).forEach(packet => {
      for (let key in packet) {
        if (packet[key] !== null && key !== "time") {
          result[key] = result[key] ?? packet[key];
        }
      }
    });
    return result;
  };

  const pickLatestGroundData = (readings) => {
    for (let packet of readings.map(normalizePacket)) {
      const hasData = Object.keys(packet).some(key =>
        ['temperature', 'humidity', 'ph', 'conductivity'].includes(key) && packet[key] !== null
      );
      if (hasData) return packet;
    }
    return null;
  };

  const toggleDeviceExpansion = (devEui) => {
    setExpandedDevices(prev => ({
      ...prev,
      [devEui]: !prev[devEui]
    }));
  };

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

  const WindDirectionRow = ({ direction, label }) => {
    if (direction === null || direction === undefined) {
      return (
        <div className={style.dataRow}>
          <img src={iconWindDirection} alt="Ветер" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>{label}:</span>
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
          <span className={style.label}>{label}:</span>
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

  // Разделяем устройства на метео и грунтовые
  const meteoDevices = devicesList.filter(device => 
    device.deviceName.toLowerCase().includes('meteo')
  );

  const groundDevices = devicesList.filter(device => 
    device.deviceName.toLowerCase().includes('ground')
  );

  const renderMeteoDevice = (device) => {
    const data = mergeMeteoData(device.lastReadings);
    return (
      <div className={style.meteoCard}>
        <h3 className={style.deviceTitle}>Метеостанция</h3>
        {selectedRegion && (
          <div className={style.regionInfo}>
            Справочник: {selectedRegion.region}
          </div>
        )}
        <div className={style.meteoGrid}>
          <RenderRow 
            icon={iconAirTemperature} 
            label="Температура" 
            value={data.temperature} 
            unit="°C" 
            device={device} 
            metric="temperature"
            valueColor={getValueColor(data.temperature, 'airtemp')}
            status={getValueStatus(data.temperature, 'airtemp', "Норма", "Холодно", "Жарко")}
          />
          <RenderRow 
            icon={iconAirHumidity} 
            label="Влажность" 
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
        </div>
      </div>
    );
  };

  const renderGroundDevice = (device) => {
    const data = pickLatestGroundData(device.lastReadings);
    const isExpanded = expandedDevices[device.devEui];
    
    return (
      <div className={`${style.groundCard} ${isExpanded ? style.expanded : ''}`}>
        <div 
          className={style.groundHeader}
          onClick={() => toggleDeviceExpansion(device.devEui)}
        >
          <div className={style.deviceName}>{device.deviceName}</div>
          <div className={style.dataRow}>
            <img src={iconPh} alt="pH" className={style.icon} />
            <div className={style.groundInfo}>
              <div className={style.label}>Кислотность</div>
              <div 
                className={style.phValue}
                style={{ color: getValueColor(data?.ph, 'soilph') }}
              >
                pH: {data?.ph ?? '-'}
              </div>
            </div>
            <div className={style.expandIcon}>
            {isExpanded ? '▲' : '▼'}
          </div>
          </div>
          
          
        </div>
        
        {isExpanded && data && (
          <div className={style.groundDetails}>
            {selectedRegion && (
              <div className={style.regionInfo}>
                Справочник: {selectedRegion.region}
              </div>
            )}
            <div className={style.groundGrid}>
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
                icon={iconSoilHumidity} 
                label="Влажность" 
                value={data.humidity} 
                unit="%" 
                device={device} 
                metric="humidity"
                valueColor={getValueColor(data.humidity, 'airhumidity')}
                status={getValueStatus(data.humidity, 'airhumidity', "Норма", "Сухо", "Влажно")}
              />
              <RenderRow 
                icon={iconSoilTemperature} 
                label="Температура" 
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
        )}
      </div>
    );
  };

  return (
    <div className={style.infoDashboardContainer}>
      {/* Метео секция над грунтовыми датчиками, выровненная по правому краю */}
      {meteoDevices.length > 0 && (
        <div className={style.meteoSection}>
          <div className={style.infoNote}>
        Добро пожаловать в систему АгроМониторинг! Здесь вы можете отслеживать все важные показатели почвы и воздуха для вашего хозяйства в режиме реального времени.
      </div> 
          {meteoDevices.map(device => renderMeteoDevice(device))}
        </div>
      )}
      
      {/* Грунтовые датчики */}
      <div className={style.groundSection}>
        {groundDevices.map(device => renderGroundDevice(device))}
      </div>
      
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