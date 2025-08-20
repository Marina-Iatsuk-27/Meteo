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

    // --- функция для получения значения из объекта с учетом raw_data ---
    const getValue = (item, key) => {
        // Сначала проверяем верхний уровень
        if (item[key] !== undefined && !isEmpty(item[key])) {
            return normalize(item[key]);
        }
        
        // Если нет в верхнем уровне, проверяем raw_data.object
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

    // --- универсальный фильтр: убирает строки, где все ключи пустые/null/undefined ---
    const cleanData = (data, keys) => {
        return data.filter(item =>
            keys.some(key => {
                const val = getValue(item, key);
                return !isEmpty(val);
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

                // получаем значения с учетом raw_data
                const temperature = getValue(entry, 'temperature');
                const humidity = getValue(entry, 'humidity');
                const pressure = getValue(entry, 'pressure');
                const rainfall = getValue(entry, 'rainfall');
                const batteryVoltage = getValue(entry, 'batteryVoltage');

                if (!groups[key]) {
                    groups[key] = {
                        time: roundedTime,
                        temperature,
                        humidity,
                        pressure,
                        rainfall,
                        batteryVoltage
                    };
                } else {
                    groups[key] = {
                        time: groups[key].time,
                        // сохраняем уже найденное, иначе берем из текущего entry
                        temperature: groups[key].temperature ?? temperature,
                        humidity: groups[key].humidity ?? humidity,
                        pressure: groups[key].pressure ?? pressure,
                        rainfall: groups[key].rainfall ?? rainfall,
                        batteryVoltage: groups[key].batteryVoltage ?? batteryVoltage
                    };
                }
            });

            // превратить в массив, отсортировать по времени и отфильтровать полностью пустые группы
            const rows = Object.values(groups)
                .sort((a, b) => b.time - a.time)
                .filter(row =>
                    !isEmpty(row.temperature) ||
                    !isEmpty(row.humidity) ||
                    !isEmpty(row.pressure) ||
                    !isEmpty(row.rainfall) ||
                    !isEmpty(row.batteryVoltage)
                );

            return rows;
        })()
        : [];

    // --- подготовка данных для отображения ---
    let parsedData = [];
    if (isMeteo) {
        parsedData = cleanData(groupedData, [
            "temperature",
            "humidity",
            "pressure",
            "rainfall",
            "batteryVoltage"
        ]);
    } else if (isGround) {
        // Для ground датчиков используем оригинальные данные, но с учетом raw_data
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

    // --- функция для отображения значения в таблице ---
    const renderTableCell = (item, key) => {
        const value = getValue(item, key);
        return formatValue(value);
    };

    return (
        <div>
            {isLoading ? (
                <p>Загрузка данных...</p>
            ) : (
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
                                        <td>{renderTableCell(item, 'temperature')}</td>
                                        <td>{renderTableCell(item, 'humidity')}</td>
                                        <td>{renderTableCell(item, 'pressure')}</td>
                                        <td>{renderTableCell(item, 'rainfall')}</td>
                                        <td>{renderTableCell(item, 'batteryVoltage')}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{renderTableCell(item, 'temperature')}</td>
                                        <td>{renderTableCell(item, 'humidity')}</td>
                                        <td>{renderTableCell(item, 'conductivity')}</td>
                                        <td>{renderTableCell(item, 'nitrogen')}</td>
                                        <td>{renderTableCell(item, 'ph')}</td>
                                        <td>{renderTableCell(item, 'phosphorus')}</td>
                                        <td>{renderTableCell(item, 'potassium')}</td>
                                        <td>{renderTableCell(item, 'salt_saturation')}</td>
                                        <td>{renderTableCell(item, 'tds')}</td>
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