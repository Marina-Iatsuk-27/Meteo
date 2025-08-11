import { useContext, useState, useEffect } from "react";
import { DeviceHistoryContext } from "../../context/GetDeviceHistory";
import style from "./DeviceHistory.module.scss";
import DashboardHistory from '../DashboardHistory/DashboardHistory';

export default function DeviceHistory() {
    const { deviceHistory = [] } = useContext(DeviceHistoryContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (deviceHistory.length > 0) {
            setIsLoading(false);
        }
    }, [deviceHistory]);

    const deviceName = deviceHistory[0]?.deviceName || null;
    const isMeteo = deviceName && deviceName.toLowerCase().includes('meteo');
    const isGround = deviceName && (deviceName.toLowerCase().includes('ground') || deviceName.toLowerCase().includes('...5277'));

    // --- хелперы ---
    const isEmpty = (v) =>
        v === undefined ||
        v === null ||
        v === "" ||
        v === "undefined" ||
        v === "null";

    const normalize = (v) => {
        if (isEmpty(v)) return null;
        // если строка, представляющая число — привести к Number
        if (typeof v === "string" && !Number.isNaN(Number(v))) {
            return Number(v);
        }
        return v;
    };

    const formatValue = (val) => {
        if (isEmpty(val)) return "–";
        return val;
    };
    // --- универсальный фильтр: убирает строки, где все ключи пустые/null/undefined ---
    const cleanData = (data, keys) => {
        return data.filter(item =>
            keys.some(key => {
                const val = item[key];
                return (
                    val !== null &&
                    val !== undefined &&
                    val !== "null" &&
                    val !== "undefined" &&
                    val !== ""
                );
            })
        );
    };

    // --- группировка для meteo (10-секундные бакеты) ---
    const groupedData = isMeteo
        ? (() => {
            const sorted = [...deviceHistory].sort(
                (a, b) => new Date(b.time) - new Date(a.time)
            );

            const groups = {};

            sorted.forEach(entry => {
                const entryTime = new Date(entry.time);
                const roundedTime = new Date(entryTime);
                roundedTime.setSeconds(Math.floor(entryTime.getSeconds() / 10) * 10, 0);
                const key = roundedTime.toISOString();

                // безопасно распарсим raw_data.object (если есть)
                let rawObj = {};
                if (entry.raw_data) {
                    try {
                        rawObj = JSON.parse(entry.raw_data)?.object || {};
                    } catch (e) {
                        rawObj = {};
                    }
                }

                // нормализуем значения (учитываем строки "undefined"/"null" и числовые строки)
                const rawTemperature = normalize(rawObj?.temperature);
                const rawHumidity = normalize(rawObj?.humidity);
                const rawPressure = normalize(rawObj?.pressure);
                const rawRainfall = normalize(rawObj?.rainfall);
                const rawBattery = normalize(rawObj?.batteryVoltage);

                // top-level значения (они обычно уже числовые или null)
                const topTemperature = normalize(entry.temperature);
                const topHumidity = normalize(entry.humidity);
                const topPressure = normalize(entry.pressure);

                if (!groups[key]) {
                    groups[key] = {
                        time: roundedTime,
                        temperature: topTemperature ?? rawTemperature ?? null,
                        humidity: topHumidity ?? rawHumidity ?? null,
                        pressure: topPressure ?? rawPressure ?? null,
                        rainfall: rawRainfall ?? null,
                        batteryVoltage: rawBattery ?? null
                    };
                } else {
                    groups[key] = {
                        time: groups[key].time,
                        // сохраняем уже найденное, иначе берем из текущего entry/raw
                        temperature: groups[key].temperature ?? topTemperature ?? rawTemperature ?? null,
                        humidity: groups[key].humidity ?? topHumidity ?? rawHumidity ?? null,
                        pressure: groups[key].pressure ?? topPressure ?? rawPressure ?? null,
                        rainfall: groups[key].rainfall ?? rawRainfall ?? null,
                        batteryVoltage: groups[key].batteryVoltage ?? rawBattery ?? null
                    };
                }
            });

            // превратить в массив, отсортировать по времени (если нужно) и ОТФИЛЬТРОВАТЬ полностью пустые группы
            const rows = Object.values(groups)
                .sort((a, b) => b.time - a.time) // по убыванию времени
                .filter(row =>
                    !isEmpty(row.temperature) ||
                    !isEmpty(row.humidity) ||
                    !isEmpty(row.pressure) ||
                    !isEmpty(row.rainfall) ||
                    !isEmpty(row.batteryVoltage)
                );

            return rows;
        })()
        : []; // если не meteo — пустой массив, дальше будем брать deviceHistory для других типов

    // parsedData — данные, которые будут рендериться (уже без пустых мета-строк)
    let parsedData = []
    if (isMeteo) {
        parsedData = cleanData(groupedData, [
            "temperature",
            "humidity",
            "pressure",
            "rainfall",
            "batteryVoltage"
        ]);
    } else if (isGround) {
        parsedData = cleanData(deviceHistory, [
            "temperature",
            "humidity",
            "conductivity",
            "nitrogen",
            "ph",
            "phosphorus",
            "potassium",
            "salt_saturation",
            "tds"
        ]);
    } else {
        parsedData = deviceHistory;
    }

    return (
        <div>
            {isLoading ? (
                <p>Загрузка данных...</p>
            ) : (
                // Передаём в DashboardHistory уже очищенные parsedData
                <DashboardHistory deviceHistory={parsedData} isMeteo={isMeteo} isGround={isGround} />
            )}

            <div className={style.deviceHistoryContainer}>
                <h1 className={style.title}>
                    {isMeteo && "История метеостанции"}
                    {isGround && "История геодатчика"}
                    {!isMeteo && !isGround && "История устройства"}
                </h1>
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th>Время</th>
                            {isMeteo ? (
                                <>
                                    <th>Температура (°C)</th>
                                    <th>Влажность (%)</th>
                                    <th>Давление (hPa)</th>
                                    <th>Осадки (mm)</th>
                                    <th>Мощность батареи (V)</th>
                                </>
                            ) : (
                                <>
                                    <th>Температура (°C)</th>
                                    <th>Влажность (%)</th>
                                    <th>Проводимость (мкСм/см)</th>
                                    <th>Азот (мг/кг)</th>
                                    <th>PH</th>
                                    <th>Фосфор (мг/кг)</th>
                                    <th>Калий (мг/кг)</th>
                                    <th>Насыщенность солей (%)</th>
                                    <th>Общее растворенное вещество (TDS)</th>
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
                                        <td>{formatValue(item.temperature)}</td>
                                        <td>{formatValue(item.humidity)}</td>
                                        <td>{formatValue(item.pressure)}</td>
                                        <td>{formatValue(item.rainfall)}</td>
                                        <td>{formatValue(item.batteryVoltage)}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{formatValue(item.temperature)}</td>
                                        <td>{formatValue(item.humidity)}</td>
                                        <td>{formatValue(item.conductivity)}</td>
                                        <td>{formatValue(item.nitrogen)}</td>
                                        <td>{formatValue(item.ph)}</td>
                                        <td>{formatValue(item.phosphorus)}</td>
                                        <td>{formatValue(item.potassium)}</td>
                                        <td>{formatValue(item.salt_saturation)}</td>
                                        <td>{formatValue(item.tds)}</td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
