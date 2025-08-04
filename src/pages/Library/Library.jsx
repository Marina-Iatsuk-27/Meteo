import React from 'react'
import Excel from '../../components/Excel/Excel'
import WeatherSoilTable from '../../components/WeatherSoilTable/WeatherSoilTable';
import style from "./Library.module.scss";

export default function Library() {
  return (
    <>
        <div className={style.title}>
          <h1>Справочник нормативов</h1>
        </div>
        <div className={style.infoNote}>
        Здесь вы найдете нормативные показатели для различных регионов. Используйте их для сравнения с данными ваших датчиков и оптимизации агротехнических мероприятий.
            </div>
            <div className={style.weatherSoilTableContainer}>
          
            <WeatherSoilTable/>
        </div>
            
        <div className={style.excelContainer}>
          
            <Excel/>
        </div>
    </>
  )
}
