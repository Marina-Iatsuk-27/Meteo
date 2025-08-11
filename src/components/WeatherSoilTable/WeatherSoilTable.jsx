// WeatherSoilTable.js
import React, { useEffect, useState } from 'react';
import style from './WeatherSoilTable.module.scss';

export default function WeatherSoilTable({ newData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (Array.isArray(newData) && newData.length > 0) {
      setData(newData);
    } else {
      setData([]);
    }
  }, [newData]);

  return (
    <div className={style["weatherSoilTableContainer"]}>
      <div className={style["weatherSoilTableContainer__header"]}>
        <h2 className={style["weatherSoilTableContainer__title"]}>Метеорологические и почвенные данные</h2>
      </div>

      <div className={style["weatherSoilTableContainer__table-section"]}>
        <table className={style["weatherSoilTableContainer__table"]}>
          <thead>
            <tr>
              <th>Регион</th>
              <th>Темп. воздуха мин</th>
              <th>Темп. воздуха макс</th>
              <th>Влажность мин</th>
              <th>Влажность макс</th>
              <th>Давление мин</th>
              <th>Давление макс</th>
              <th>Направление ветра мин</th>
              <th>Направление ветра макс</th>
              <th>Проводимость почвы мин</th>
              <th>Проводимость почвы макс</th>
              <th>PH почвы мин</th>
              <th>PH почвы макс</th>
              <th>Темп. почвы мин</th>
              <th>Темп. почвы макс</th>
              <th>Азот мин</th>
              <th>Азот макс</th>
              <th>Фосфор мин</th>
              <th>Фосфор макс</th>
              <th>Калий мин</th>
              <th>Калий макс</th>
            </tr>
          </thead>
          <tbody>
  {data.map((row, i) => (
    <tr key={i}>
      <td>{row.region}</td>

      <td className={style["min-cell"]}>{row.airTempMin}</td>
      <td className={style["max-cell"]}>{row.airTempMax}</td>

      <td className={style["min-cell"]}>{row.airHumidityMin}</td>
      <td className={style["max-cell"]}>{row.airHumidityMax}</td>

      <td className={style["min-cell"]}>{row.pressureMin}</td>
      <td className={style["max-cell"]}>{row.pressureMax}</td>

      <td className={style["min-cell"]}>{row.windDirectionMin || '-'}</td>
      <td className={style["max-cell"]}>{row.windDirectionMax || '-'}</td>

      <td className={style["min-cell"]}>{row.soilConductivityMin}</td>
      <td className={style["max-cell"]}>{row.soilConductivityMax}</td>

      <td className={style["min-cell"]}>{row.soilPHMin}</td>
      <td className={style["max-cell"]}>{row.soilPHMax}</td>

      <td className={style["min-cell"]}>{row.soilTempMin}</td>
      <td className={style["max-cell"]}>{row.soilTempMax}</td>

      <td className={style["min-cell"]}>{row.nitrogenMin}</td>
      <td className={style["max-cell"]}>{row.nitrogenMax}</td>

      <td className={style["min-cell"]}>{row.phosphorusMin}</td>
      <td className={style["max-cell"]}>{row.phosphorusMax}</td>

      <td className={style["min-cell"]}>{row.potassiumMin}</td>
      <td className={style["max-cell"]}>{row.potassiumMax}</td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
}
