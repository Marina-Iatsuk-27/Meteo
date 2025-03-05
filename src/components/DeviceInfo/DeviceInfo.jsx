
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
            <p><strong className={style.customStrong}>Имя устройства:</strong> {deviceData.state.uplink.deviceInfo.deviceName}</p>
            <p><strong className={style.customStrong}>ID устройства (devEUI):</strong> {deviceData.state.uplink.deviceInfo.devEui}</p>
            <p><strong className={style.customStrong}>Класс устройства:</strong> {deviceData.state.uplink.deviceInfo.deviceClassEnabled}</p>
            <p><strong className={style.customStrong}>Профиль устройства:</strong> {deviceData.state.uplink.deviceInfo.deviceProfileName}</p>
          </div>
  
          {deviceData && (
            <Dashboard deviceData={deviceData} isMeteo={isMeteo} isGround={isGround}/>
          )}
  
          {/* Object Data */}
          <div className={style.section}>
            <h2>{isMeteo ? "Показания метеостанции" : "Показания геодатчика"}</h2>
  
            {isMeteo ? (
              <>
                <p><strong className={style.customStrong}>Напряжение батареи:</strong> {deviceData.state.uplink.object.batteryVoltage} В</p>
                <p><strong className={style.customStrong}>Минимальная скорость ветра:</strong> {deviceData.state.uplink.object.windSpeedMin} м/с</p>
                <p><strong className={style.customStrong}>Максимальное направление ветра:</strong> {deviceData.state.uplink.object.windDirectionMax}°</p>
                <p><strong className={style.customStrong}>Температура датчика:</strong> {deviceData.state.uplink.object.wetTemperature} °C</p>
                <p><strong className={style.customStrong}>Температура воздуха:</strong> {deviceData.state.uplink.object.temperature} °C</p>
                <p><strong className={style.customStrong}>Среднее направление ветра:</strong> {deviceData.state.uplink.object.windDirectionAvg}°</p>
                <p><strong className={style.customStrong}>Влажность:</strong> {deviceData.state.uplink.object.humidity} %</p>
                <p><strong className={style.customStrong}>Давление:</strong> {deviceData.state.uplink.object.pressure} мм рт. ст.</p>
                <p><strong className={style.customStrong}>Осадки:</strong> {deviceData.state.uplink.object.rainfall} мм</p>
                <p><strong className={style.customStrong}>Средняя скорость ветра:</strong> {deviceData.state.uplink.object.windSpeedAvg} м/с</p>
              </>
            ) : (
              <>
                <p><strong className={style.customStrong}>Влажность:</strong> {deviceData.state.uplink.object.humidity} %</p>
                <p><strong className={style.customStrong}>Температура:</strong> {deviceData.state.uplink.object.temperature} °C</p>
                <p><strong className={style.customStrong}>Проводимость:</strong> {deviceData.state.uplink.object.conductivity} мкСм/см</p>
                <p><strong className={style.customStrong}>Содержание азота:</strong> {deviceData.state.uplink.object.nitrogen} мг/л</p>
                <p><strong className={style.customStrong}>pH:</strong> {deviceData.state.uplink.object.ph}</p>
                <p><strong className={style.customStrong}>Содержание фосфора:</strong> {deviceData.state.uplink.object.phosphorus} мг/л</p>
                <p><strong className={style.customStrong}>Содержание калия:</strong> {deviceData.state.uplink.object.potassium} мг/л</p>
                <p><strong className={style.customStrong}>Насыщение солью:</strong> {deviceData.state.uplink.object.salt_saturation} %</p>
                <p><strong className={style.customStrong}>Общее количество растворённых веществ (TDS):</strong> {deviceData.state.uplink.object.tds} мг/л</p>
              </>
            )}
          </div>
  
          {/* Time Field */}
          <div className={style.section}>
            <h2>Время показаний</h2>
            <p>{formatTime(deviceData.state.time)}</p>
          </div>
        </div>
      )}
    </div>
  );
  
}
