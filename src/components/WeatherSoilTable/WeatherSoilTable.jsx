import React, { useEffect, useState } from 'react';
import iconTrash from '../../assets/icons/icons8-trash.png';
import style from './WeatherSoilTable.module.scss';

export default function WeatherSoilTable({ newData }) {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null); // для уведомлений
  const user = JSON.parse(localStorage.getItem("user")); 
  const role = user.role; 

  

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
        console.log('result in WeatherSoilTable', result);
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
        setMessage("✅ Запись удалена"); // уведомление
        setTimeout(() => setMessage(null), 3000); // убираем через 3 сек
      } else {
        let errorMessage;
        try {
          errorMessage = await res.json();
        } catch {
          errorMessage = await res.text();
        }
        console.error("Ошибка удаления:", errorMessage);
        setMessage("❌ Ошибка при удалении");
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Ошибка удаления:", err);
      setMessage("❌ Ошибка при удалении");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className={style["weatherSoilTableContainer"]}>
      <div className={style["weatherSoilTableContainer__header"]}>
        <h2 className={style["weatherSoilTableContainer__title"]}>
          Метеорологические и почвенные данные
        </h2>
      </div>

      {message && <div className={style.message}>{message}</div>}

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
              {role === "admin" && <th>Действия</th>}
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

                {role === "admin" && (
                  <td>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className={style.deleteBtn}
                    >
                      <img src={iconTrash} alt="Удалить" className={style.deleteIcon} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ); 
}
