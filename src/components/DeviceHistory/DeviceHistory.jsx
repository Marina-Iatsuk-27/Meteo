// src/components/DeviceHistory/DeviceHistory.jsx
import { useContext, useMemo, useState } from "react";
import { DeviceHistoryContext } from "../../context/GetDeviceHistory";
import style from "./DeviceHistory.module.scss";
import DashboardHistory from "../DashboardHistory/DashboardHistory";
import Loader from "../Loader/Loader";

function toLocalDateInputValue(date) {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function DeviceHistory() {
  const { deviceHistory = [], loading, setPeriod, setCustomRange, filters } =
    useContext(DeviceHistoryContext);

  // custom range inputs
  const [showCustom, setShowCustom] = useState(false);
  const [customFrom, setCustomFrom] = useState(() =>
    filters?.from ? toLocalDateInputValue(filters.from) : toLocalDateInputValue(new Date(Date.now() - 24 * 3600 * 1000))
  );
  const [customTo, setCustomTo] = useState(() =>
    filters?.to ? toLocalDateInputValue(filters.to) : toLocalDateInputValue(new Date())
  );

  const deviceName = deviceHistory[0]?.deviceName || null;
  const isMeteo = deviceName && deviceName.toLowerCase().includes("meteo");
  const isGround =
    deviceName &&
    (deviceName.toLowerCase().includes("ground") ||
      deviceName.toLowerCase().includes("...5277"));

  const isEmpty = (v) =>
    v === undefined || v === null || v === "" || v === "undefined" || v === "null";

  const normalize = (v) => {
    if (isEmpty(v)) return null;
    if (typeof v === "string" && !Number.isNaN(Number(v))) return Number(v);
    return v;
  };

  const formatValue = (val) => (isEmpty(val) ? "–" : val);

  const getValue = (item, key) => {
    if (item[key] !== undefined && !isEmpty(item[key])) return normalize(item[key]);
    if (item.raw_data) {
      try {
        const rawObj = JSON.parse(item.raw_data);
        if (rawObj?.object && rawObj.object[key] !== undefined && !isEmpty(rawObj.object[key])) {
          return normalize(rawObj.object[key]);
        }
      } catch (e) {
        console.error("Error parsing raw_data:", e);
      }
    }
    return null;
  };

  const cleanData = (data, keys) =>
    data.filter((item) => keys.some((key) => !isEmpty(getValue(item, key))));

  const groupedData = useMemo(() => {
    if (!isMeteo) return [];
    const sorted = [...deviceHistory].sort((a, b) => new Date(b.time) - new Date(a.time));
    const groups = {};
    sorted.forEach((entry) => {
      const entryTime = new Date(entry.time);
      const roundedTime = new Date(entryTime);
      roundedTime.setSeconds(Math.floor(entryTime.getSeconds() / 10) * 10, 0);
      const key = roundedTime.toISOString();

      const temperature = getValue(entry, "temperature");
      const humidity = getValue(entry, "humidity");
      const pressure = getValue(entry, "pressure");
      const rainfall = getValue(entry, "rainfall");
      const batteryVoltage = getValue(entry, "batteryVoltage");

      if (!groups[key]) {
        groups[key] = { time: roundedTime, temperature, humidity, pressure, rainfall, batteryVoltage };
      } else {
        groups[key] = {
          time: groups[key].time,
          temperature: groups[key].temperature ?? temperature,
          humidity: groups[key].humidity ?? humidity,
          pressure: groups[key].pressure ?? pressure,
          rainfall: groups[key].rainfall ?? rainfall,
          batteryVoltage: groups[key].batteryVoltage ?? batteryVoltage,
        };
      }
    });

    return Object.values(groups)
      .sort((a, b) => b.time - a.time)
      .filter(
        (row) =>
          !isEmpty(row.temperature) ||
          !isEmpty(row.humidity) ||
          !isEmpty(row.pressure) ||
          !isEmpty(row.rainfall) ||
          !isEmpty(row.batteryVoltage)
      );
  }, [isMeteo, deviceHistory]);

  const parsedData = useMemo(() => {
    let baseData = deviceHistory;
    console.log('baseData',baseData);
    
    // последние 50 записей по умолчанию
    if (!filters?.from && !filters?.to) {
      baseData = baseData.slice(0, 50);
    }

    if (isMeteo) {
      return cleanData(groupedData, ["temperature", "humidity", "pressure", "rainfall", "batteryVoltage"]);
    }
    if (isGround) {
      return cleanData(baseData, [
        "temperature",
        "humidity",
        "conductivity",
        "nitrogen",
        "ph",
        "phosphorus",
        "potassium",
        "salt_saturation",
        "tds",
      ]);
    }
    return baseData;
  }, [isMeteo, isGround, groupedData, deviceHistory, filters]);

  const renderTableCell = (item, key) => formatValue(getValue(item, key));

  // apply custom range
  const applyCustom = () => {
    if (!customFrom || !customTo) return;
    const fromDate = new Date(`${customFrom}T00:00:00`);
    const toDate = new Date(`${customTo}T23:59:59`);
    setCustomRange(fromDate, toDate);
    setShowCustom(false); 
  };;

  return (
    <div>
      <div className={style.periodButtons}>
        <button onClick={() => setPeriod("24h")} className={style.button}>За сутки</button>
        <button onClick={() => setPeriod("7d")} className={style.button}>За неделю</button>
        <button onClick={() => setPeriod("30d")} className={style.button}>За месяц</button>
        <button onClick={() => setPeriod("today")} className={style.button}>Сегодня</button>

        <button onClick={() => setShowCustom((s) => !s)} className={style.button}>
          {showCustom ? "Скрыть выбор дат" : "Выбрать даты"}
        </button>
      </div>

      {showCustom && (
        <div className={style.customRange}>
            <label>
            С:
            <input
                type="date"
                value={customFrom}
                max={new Date().toISOString().split("T")[0]}   // не позже сегодняшнего дня
                onChange={(e) => setCustomFrom(e.target.value)}
            />
            </label>

            <label>
            По:
            <input
                type="date"
                value={customTo}
                min={customFrom || undefined}                  // не раньше даты "С"
                max={new Date().toISOString().split("T")[0]}   // не позже сегодняшнего дня
                onChange={(e) => setCustomTo(e.target.value)}
            />
            </label>

            <button onClick={applyCustom} className={style.button}>
            Применить
            </button>
        </div>
        )}




        {loading ? (
        <Loader text="Загрузка данных..." />  
        ) : parsedData.length === 0 ? (
        <div className={style.empty}>Нет данных за выбранный период</div>
        ) : (
        <DashboardHistory
            deviceHistory={parsedData}
            isMeteo={isMeteo}
            isGround={isGround}
        />
        )}
        {loading ? (
        <Loader text="Загрузка данных..." /> 
        ) : parsedData.length === 0 ? (
        <div className={style.empty}>Нет данных за выбранный период</div>
        ) : (
            <div className={style.deviceHistoryContainer}>
            <h1 className={style.title}>
            {isMeteo && "История метеостанции"}
            {isGround && "История геодатчика"}
            {!isMeteo && !isGround && "История устройства"}
            </h1>

            <table className={style.table}>
            <thead>
                <tr>
                <th>Дата/Время</th>
                {isMeteo ? (
                    <>
                    <th>Температура (°C)</th>
                    <th>Влажность (%)</th>
                    <th>Давление (hPa)</th>
                    <th>Осадки (mm)</th>
                    <th>Батарея (V)</th>
                    </>
                ) : (
                    <>
                    <th>Температура (°C)</th>
                    <th>Влажность (%)</th>
                    <th>Проводимость (мкСм/см)</th>
                    <th>Азот (мг/кг)</th>
                    <th>pH</th>
                    <th>Фосфор (мг/кг)</th>
                    <th>Калий (мг/кг)</th>
                    <th>Насыщенность солей (%)</th>
                    <th>TDS</th>
                    </>
                )}
                </tr>
            </thead>
            <tbody>
                {parsedData.map((item, index) => (
                <tr key={index}>
                    <td>{formatValue(new Date(item.time).toLocaleString().slice(0, -3))}</td>
                    {isMeteo ? (
                    <>
                        <td>{renderTableCell(item, "temperature")}</td>
                        <td>{renderTableCell(item, "humidity")}</td>
                        <td>{renderTableCell(item, "pressure")}</td>
                        <td>{renderTableCell(item, "rainfall")}</td>
                        <td>{renderTableCell(item, "batteryVoltage")}</td>
                    </>
                    ) : (
                    <>
                        <td>{renderTableCell(item, "temperature")}</td>
                        <td>{renderTableCell(item, "humidity")}</td>
                        <td>{renderTableCell(item, "conductivity")}</td>
                        <td>{renderTableCell(item, "nitrogen")}</td>
                        <td>{renderTableCell(item, "ph")}</td>
                        <td>{renderTableCell(item, "phosphorus")}</td>
                        <td>{renderTableCell(item, "potassium")}</td>
                        <td>{renderTableCell(item, "salt_saturation")}</td>
                        <td>{renderTableCell(item, "tds")}</td>
                    </>
                    )}
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}


      
    </div>
  );
}
