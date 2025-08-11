import React, { useContext } from 'react';
import { DeviceHistoryContext } from "../../context/GetDeviceHistory";
import style from './WeatherSoilTable.module.scss';

export default function WeatherSoilTable() {
  const { deviceHistory = [] } = useContext(DeviceHistoryContext);

  const formatValue = (val) => {
    if (
      val === undefined ||
      val === null ||
      val === "undefined" ||
      val === "null" ||
      val === ""
    ) {
      return "–";
    }
    return val;
  };

  return (
    <div className={style["weatherSoilTableContainer"]}>
      <div className={style["weatherSoilTableContainer__header"]}>
        <h2 className={style["weatherSoilTableContainer__title"]}>
          Метеорологические и почвенные данные
        </h2>
      </div>

      <div className={style["weatherSoilTableContainer__table-section"]}>
        <table className={style["weatherSoilTableContainer__table"]}>
          <thead className={style["weatherSoilTableContainer__table-header"]}>
            <tr>
              <th>Время</th>
              <th>Температура воздуха</th>
              <th>Влажность воздуха</th>
              <th>Атмосферное давление</th>
              <th>Осадки</th>
              <th>Направление ветра</th>
              <th>Проводимость почвы</th>
              <th>PH почвы</th>
              <th>Температура почвы</th>
              <th>Азот</th>
              <th>Фосфор</th>
              <th>Калий</th>
            </tr>
          </thead>
          <tbody className={style["weatherSoilTableContainer__table-body"]}>
            {deviceHistory.map((row, index) => (
              <tr key={index} className={style["weatherSoilTableContainer__table-row"]}>
                <td>{formatValue(new Date(row.time).toLocaleString().slice(0, -3))}</td>
                <td>{formatValue(row.temperature)}</td>
                <td>{formatValue(row.humidity)}</td>
                <td>{formatValue(row.pressure)}</td>
                <td>{formatValue(row.rainfall)}</td>
                <td>{formatValue(row.windDirection)}</td>
                <td>{formatValue(row.conductivity)}</td>
                <td>{formatValue(row.ph)}</td>
                <td>{formatValue(row.soilTemp)}</td>
                <td>{formatValue(row.nitrogen)}</td>
                <td>{formatValue(row.phosphorus)}</td>
                <td>{formatValue(row.potassium)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
