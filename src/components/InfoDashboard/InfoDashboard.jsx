import React from 'react';
import style from './InfoDashboard.module.scss';
import Loader from "../Loader/Loader"
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


export default function InfoDashboard({ filteredDevices }) {
  //console.log('filteredDevices в инфо: ', filteredDevices);

 // Проверяем, есть ли данные для отображения
 const isLoading = !filteredDevices || filteredDevices.length === 0 || 
 filteredDevices.some(device => !device.state || !device.state.uplink);

if (isLoading) {
 return <Loader text="Загружаем данные..." />;
}
  const renderGroundData = (device) => (
    <div className={style.dataList}>
      <h1 className={style.title}>Показатели почвы</h1>
      <div className={style.rows}> 

        <div className={style.dataRow}>
          <img src={iconConductivity} alt="Проводимость" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Проводимость:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.conductivity || ''}</span>
              <span className={style.unit}>мСм/см</span> 
            </div>
          </div> 
        </div>


        <div className={style.dataRow}>
          <img src={iconPh} alt="pH" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>pH:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.ph || ''}</span>
              <span className={style.unit}>pH</span>
            </div>
          </div>
        </div>

        <div className={style.dataRow}>
          <img src={iconSoilHumidity} alt="Влажность почвы" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Влажность почвы:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.humidity || ''}</span>
              <span className={style.unit}>%</span>
            </div>
          </div>
        </div>

        <div className={style.dataRow}>
          <img src={iconSoilTemperature} alt="Температура почвы" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Температура почвы:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.temperature || ''}</span>
              <span className={style.unit}>°C</span>
            </div>
          </div>
        </div>

        <div className={style.dataRow}>
          <img src={iconNitrogen} alt="Азот" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Азот:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.nitrogen || ''}</span>
              <span className={style.unit}>г/кг</span>
            </div>
          </div>
        </div>

        <div className={style.dataRow}>
          <img src={iconPhosphorus} alt="Фосфор" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Фосфор:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.phosphorus || ''}</span>
              <span className={style.unit}>г/кг</span>
            </div>
          </div>
        </div>

        <div className={style.dataRow}>
          <img src={iconPotassium} alt="Калий" className={style.icon} />
          <div className={style.dataInfo}>
            <span className={style.label}>Калий:</span>
            <div className={style.dataIndication}>
              <span className={style.text}>{device.state.uplink.object.potassium || ''}</span>
              <span className={style.unit}>г/кг</span>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
  
  // Функция для отображения данных для устройства с намеком на "meteo"
  const renderMeteoData = (device) => (
    <div className={style.dataList}>
       <h1 className={style.title}>Показатели воздуха</h1>
       <div className={style.rows}>
       <div className={style.dataRow}>
        <img src={iconAirTemperature} alt="Температура воздуха" className={style.icon} />
        <div className={style.dataInfo}>
          <span className={style.label}>Температура воздуха:</span>
          <div className={style.dataIndication}>
            <span className={style.text}>{device.state.uplink.object.temperature || ''}</span>
            <span className={style.unit}>°C</span>
          </div>
        </div>
      </div>

      <div className={style.dataRow}>
        <img src={iconAirHumidity} alt="Влажность воздуха" className={style.icon} />
        <div className={style.dataInfo}>
          <span className={style.label}>Влажность воздуха:</span>
          <div className={style.dataIndication}>
            <span className={style.text}>{device.state.uplink.object.humidity || ''}</span>
            <span className={style.unit}>%</span>
          </div>
        </div>
      </div>

      <div className={style.dataRow}>
        <img src={iconPressure} alt="Атмосферное давление" className={style.icon} />
        <div className={style.dataInfo}>
          <span className={style.label}>Атмосферное давление:</span>
          <div className={style.dataIndication}>
            <span className={style.text}>{device.state.uplink.object.pressure || ''}</span>
            <span className={style.unit}>мм рт. ст.</span>
          </div>
        </div>
      </div>

      <div className={style.dataRow}>
        <img src={iconRainfall} alt="Осадки" className={style.icon} />
        <div className={style.dataInfo}>
          <span className={style.label}>Осадки:</span>
          <div className={style.dataIndication}>
            <span className={style.text}>{device.state.uplink.object.rainfall || ''}</span>
            <span className={style.unit}>мм</span>
          </div>
        </div>
      </div>

      </div>
      
    </div>
  );
  


  

  // Определение, какие данные показывать в зависимости от имени устройства
  const renderDeviceData = (device) => {
    const deviceName = device.state.uplink.deviceInfo.deviceName.toLowerCase();
    if (deviceName.includes('ground')) {
      return renderGroundData(device);
    } else if (deviceName.includes('meteo')) {
      return renderMeteoData(device);
    } else {
      return <p>Данные не распознаны</p>;
    }
  };
  if (!renderDeviceData) {
    return <Loader text="Загружаем данные..."/>;
}

  return (
    <div className={style.infoDashboard}>
        {filteredDevices.map((device) => (
          <div className={style.card} key={device.id}>
            {renderDeviceData(device)}
          </div>
        ))}
      
    </div>
  );
}
