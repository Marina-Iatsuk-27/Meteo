// WeatherSoilTable.js
import React, { useEffect, useState } from 'react';
import iconTrash from '../../assets/icons/icons8-trash.png';
import style from './WeatherSoilTable.module.scss';

export default function WeatherSoilTable({ newData }) {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   if (Array.isArray(newData) && newData.length > 0) {
  //     setData(newData);
  //   } else {
  //     setData([]);
  //   }
  // }, [newData]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5001/reference", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });
        const result = await res.json();
        setData(result);
        console.log('result in WeatherSoilTable',result);
        
      } catch (err) {
        console.error("Ошибка загрузки справочников:", err);
      }
    }
  
    fetchData();
  }, [newData]);
  
// удаление записи
const handleDelete = async (id) => {
  if (!window.confirm("Удалить эту запись?")) return;

  try {
    const res = await fetch(`http://localhost:5001/reference/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setData((prev) => prev.filter((row) => row.id !== id));
    } else {
      let errorMessage;
      try {
        errorMessage = await res.json();
      } catch {
        errorMessage = await res.text(); // fallback, если пришёл HTML
      }
      console.error("Ошибка удаления:", errorMessage);
    }
  } catch (err) {
    console.error("Ошибка удаления:", err);
  }
};

console.log('data in weatherSoilTable',data)
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
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.region}</td>

              <td className={style["min-cell"]}>{row.airtempmin}</td>
              <td className={style["max-cell"]}>{row.airtempmax}</td>

              <td className={style["min-cell"]}>{row.airhumiditymin}</td>
              <td className={style["max-cell"]}>{row.airhumiditymax}</td>

              <td className={style["min-cell"]}>{row.pressuremin}</td>
              <td className={style["max-cell"]}>{row.pressuremax}</td>

              <td className={style["min-cell"]}>{row.winddirectionmin || '-'}</td>
              <td className={style["max-cell"]}>{row.winddirectionmax || '-'}</td>

              <td className={style["min-cell"]}>{row.soilconductivitymin}</td>
              <td className={style["max-cell"]}>{row.soilconductivitymax}</td>

              <td className={style["min-cell"]}>{row.soilphmin}</td>
              <td className={style["max-cell"]}>{row.soilphmax}</td>

              <td className={style["min-cell"]}>{row.soiltempmin}</td>
              <td className={style["max-cell"]}>{row.soiltempmax}</td>

              <td className={style["min-cell"]}>{row.nitrogenmin}</td>
              <td className={style["max-cell"]}>{row.nitrogenmax}</td>

              <td className={style["min-cell"]}>{row.phosphorusmin}</td>
              <td className={style["max-cell"]}>{row.phosphorusmax}</td>

              <td className={style["min-cell"]}>{row.potassiummin}</td>
              <td className={style["max-cell"]}>{row.potassiummax}</td>
              <td>
              <button
                onClick={() => handleDelete(row.id)}
                className={style.deleteBtn}
              >
                <img src={iconTrash} alt="Удалить" className={style.deleteIcon} />
              </button>
            </td>
            </tr>
          ))}

</tbody>

        </table>
      </div>
    </div>
  );
}
