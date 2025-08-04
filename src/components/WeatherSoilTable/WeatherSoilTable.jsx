
import React from 'react';
import style from './WeatherSoilTable.module.scss';
export default function WeatherSoilTable() {

  //генерируем случайные ланные:
  const generateRandomData = () => {
    const regions = ['Центральный', 'Северный', 'Южный', 'Восточный', 'Западный'];
    
    return regions.map(region => ({
      region,
      airTemp: `${(Math.random() * 30 - 5).toFixed(1)}°C`,
      airHumidity: `${(Math.random() * 100).toFixed(1)}%`,
      pressure: `${(750 + Math.random() * 30).toFixed(1)} мм рт.ст.`,
      precipitation: ['Нет', 'Слабый дождь', 'Дождь', 'Ливень', 'Снег'][Math.floor(Math.random() * 5)],
      windDirection: ['С', 'С-В', 'В', 'Ю-В', 'Ю', 'Ю-З', 'З', 'С-З'][Math.floor(Math.random() * 8)],
      soilConductivity: `${(Math.random() * 5).toFixed(2)} mS/cm`,
      soilPH: (Math.random() * 4 + 5).toFixed(1),
      soilTemp: `${(Math.random() * 25 + 5).toFixed(1)}°C`,
      nitrogen: `${(Math.random() * 100).toFixed(1)} ppm`,
      phosphorus: `${(Math.random() * 50).toFixed(1)} ppm`,
      potassium: `${(Math.random() * 200).toFixed(1)} ppm`
    }));
  };

  const [data, setData] = React.useState(generateRandomData());

  // Функция для обновления данных
  const refreshData = () => {
    setData(generateRandomData());
  };

  return (
    <div className={style["weather-soil-table"]}>
      <div className={style["weather-soil-table__header"]}>
        <h2 className={style["weather-soil-table__title"]}>Метеорологические и почвенные данные</h2>
        <button 
          onClick={refreshData}
          className={style["weather-soil-table__refresh-button"]}
        >
          Обновить данные
        </button>
      </div>
      
      <div className={style["weather-soil-table__table-section"]}>
        <table className={style["weather-soil-table__table"]}>
          <thead className={style["weather-soil-table__table-header"]}>
            <tr>
              <th className={style["weather-soil-table__table-header-cell"]}>Наименование региона</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Температура воздуха</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Влажность воздуха</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Атмосферное давление</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Направление ветра</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Проводимость почвы</th>
              <th className={style["weather-soil-table__table-header-cell"]}>PH почвы</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Температура почвы</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Кол-во азота в почве</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Кол-во фосфора в почве</th>
              <th className={style["weather-soil-table__table-header-cell"]}>Кол-во калия в почве</th>
            </tr>
          </thead>
          <tbody className={style["weather-soil-table__table-body"]}>
            {data.map((row, index) => (
              <tr key={index} className={style["weather-soil-table__table-row"]}>
                <td className={style["weather-soil-table__table-cell"]}>{row.region}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.airTemp}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.airHumidity}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.pressure}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.precipitation}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.windDirection}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.soilConductivity}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.soilPH}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.soilTemp}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.nitrogen}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.phosphorus}</td>
                <td className={style["weather-soil-table__table-cell"]}>{row.potassium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

