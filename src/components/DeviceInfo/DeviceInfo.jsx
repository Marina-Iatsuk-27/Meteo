
import { useContext } from "react";
import style from "./DeviceInfo.module.scss";
import Dashboard from '../Dashboard/Dashboard';


import { MeteoInfoContext } from "../../context/GetDeviceInfo";

export default function MeteoInfo() {
    const {deviceData, setDeviceData} = useContext(MeteoInfoContext); // Состояние для хранения данных устройства
    //  console.log('deviceData  в компоненте',deviceData);

      // Преобразование времени
  const formatTime = (unixTime) => {
    const date = new Date(unixTime);
    return date.toLocaleString(); // Преобразуем в читаемую строку
  };
   // Проверка типа устройства
   const deviceName = deviceData?.name || '';
  //  console.log(deviceName);
   const isMeteo = deviceName.toLowerCase().includes('meteo');
   const isGround = deviceName.toLowerCase().includes('ground');

 
   return (
    <div className={style.container}>
      <h1 className={style.title}>
        {isMeteo && "Данные метеостанции"}
        {isGround && "Данные геодатчика"}
        {!isMeteo && !isGround && "Данные"}
      </h1>
  
      {deviceData && (
        <div className={style.dataContainer}>
          {/* Device Info */}
          <div className={style.section}>
            <h2>
              {isMeteo && "Информация об устройстве метеостанции"}
              {isGround && "Информация об устройстве геодатчика"}
              {!isMeteo && !isGround && "Информация об устройстве"}
            </h2>
            <p><strong>Имя устройства:</strong> {deviceData.state.uplink.deviceInfo.deviceName}</p>
            <p><strong>ID устройства (devEUI):</strong> {deviceData.state.uplink.deviceInfo.devEui}</p>
            <p><strong>Класс устройства:</strong> {deviceData.state.uplink.deviceInfo.deviceClassEnabled}</p>
            <p><strong>Профиль устройства:</strong> {deviceData.state.uplink.deviceInfo.deviceProfileName}</p>
          </div>
  
          {deviceData && (
            <Dashboard deviceData={deviceData} isMeteo={isMeteo} isGround={isGround}/>
          )}
  
          {/* Object Data */}
          <div className={style.section}>
            <h2>{isMeteo ? "Показания метеостанции" : "Показания геодатчика"}</h2>
  
            {isMeteo ? (
              <>
                <p><strong>Напряжение батареи:</strong> {deviceData.state.uplink.object.batteryVoltage} В</p>
                <p><strong>Минимальная скорость ветра:</strong> {deviceData.state.uplink.object.windSpeedMin} м/с</p>
                <p><strong>Максимальное направление ветра:</strong> {deviceData.state.uplink.object.windDirectionMax}°</p>
                <p><strong>Температура датчика:</strong> {deviceData.state.uplink.object.wetTemperature} °C</p>
                <p><strong>Температура воздуха:</strong> {deviceData.state.uplink.object.temperature} °C</p>
                <p><strong>Среднее направление ветра:</strong> {deviceData.state.uplink.object.windDirectionAvg}°</p>
                <p><strong>Влажность:</strong> {deviceData.state.uplink.object.humidity} %</p>
                <p><strong>Давление:</strong> {deviceData.state.uplink.object.pressure} мм рт. ст.</p>
                <p><strong>Осадки:</strong> {deviceData.state.uplink.object.rainfall} мм</p>
                <p><strong>Средняя скорость ветра:</strong> {deviceData.state.uplink.object.windSpeedAvg} м/с</p>
              </>
            ) : (
              <>
                <p><strong>Влажность:</strong> {deviceData.state.uplink.object.humidity} %</p>
                <p><strong>Температура:</strong> {deviceData.state.uplink.object.temperature} °C</p>
                <p><strong>Проводимость:</strong> {deviceData.state.uplink.object.conductivity} мкСм/см</p>
                <p><strong>Содержание азота:</strong> {deviceData.state.uplink.object.nitrogen} мг/л</p>
                <p><strong>pH:</strong> {deviceData.state.uplink.object.ph}</p>
                <p><strong>Содержание фосфора:</strong> {deviceData.state.uplink.object.phosphorus} мг/л</p>
                <p><strong>Содержание калия:</strong> {deviceData.state.uplink.object.potassium} мг/л</p>
                <p><strong>Насыщение солью:</strong> {deviceData.state.uplink.object.salt_saturation} %</p>
                <p><strong>Общее количество растворённых веществ (TDS):</strong> {deviceData.state.uplink.object.tds} мг/л</p>
              </>
            )}
          </div>
  
          {/* Time Field */}
          <div className={style.section}>
            <h2>Время показаний</h2>
            <p>{formatTime(deviceData.time)}</p>
          </div>
        </div>
      )}
    </div>
  );
  
}
