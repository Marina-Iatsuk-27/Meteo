import React, { useState } from 'react'
import Excel from '../../components/Excel/Excel'
import WeatherSoilTable from '../../components/WeatherSoilTable/WeatherSoilTable';
import style from "./Library.module.scss";

export default function Library() {
  const [libraryData, setLibraryData] = useState(() => {
    // Начинаем с того, что есть в sessionStorage (если есть)
    const saved = sessionStorage.getItem("libraryData");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (newData) => {
    setLibraryData(prevData => {
      // Добавляем новые данные к уже имеющимся
      const updated = [...prevData, ...newData];
      sessionStorage.setItem("libraryData", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <>
      <div className={style.title}>
        <h1>Справочник нормативов</h1>
      </div>
      <div className={style.infoNote}>
        Здесь вы найдете нормативные показатели для различных регионов. Используйте их для сравнения с данными ваших датчиков и оптимизации агротехнических мероприятий.
      </div>
      <div className={style.weatherSoilTableContainer}>
        <WeatherSoilTable newData={libraryData} />
      </div>
      <div className={style.excelContainer}>
        <Excel onSave={handleSave} />
      </div>
    </>
  );
}
