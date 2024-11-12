import { useEffect, useRef } from 'react';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
} from 'chart.js';;
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);;
import style from "./DashboardHistory.module.scss";

export default function DashboardHistory({ deviceHistory, isMeteo, isGround }) {
    console.log('isMeteo?', isMeteo);
    console.log('isGround?', isGround);
    
    const chartsRef = useRef({});

    useEffect(() => {
        // Функция для уничтожения всех предыдущих графиков
        const destroyCharts = () => {
            Object.values(chartsRef.current).forEach(chart => chart?.destroy());
        };

        // Уничтожаем графики перед созданием новых
        destroyCharts();

        // Данные для графиков в зависимости от типа устройства
        const timestamps = deviceHistory.map(entry => new Date(entry.time).toLocaleString());

        if (isMeteo) {
            // Строим графики для метеоданных
            chartsRef.current.temperatureChart = createChart('temperatureChart', 'Температура (°C)', timestamps, deviceHistory.map(entry => entry.temperature || null), 'rgba(255, 99, 132, 1)');
            chartsRef.current.humidityChart = createChart('humidityChart', 'Влажность (%)', timestamps, deviceHistory.map(entry => entry.humidity || null), 'rgba(54, 162, 235, 1)');
            chartsRef.current.pressureChart = createChart('pressureChart', 'Давление (hPa)', timestamps, deviceHistory.map(entry => entry.pressure || null), 'rgba(75, 192, 192, 1)');
            chartsRef.current.rainfallChart = createChart('rainfallChart', 'Осадки (мм)', timestamps, deviceHistory.map(entry => entry.rainfall === '-' ? null : entry.rainfall), 'rgba(153, 102, 255, 1)');
            console.log('deviceHistory in meteo', deviceHistory)
        }

        if (isGround) {
            // Строим графики для данных грунтового датчика
            chartsRef.current.conductivityChart = createChart('conductivityChart', 'Проводимость', timestamps, deviceHistory.map(entry => entry.uplink.object.conductivity || null), 'rgba(255, 159, 64, 1)');
            chartsRef.current.humidityChart = createChart('groundHumidityChart', 'Влажность (%)', timestamps, deviceHistory.map(entry => entry.uplink.object.humidity || null), 'rgba(54, 162, 235, 1)');
            chartsRef.current.phChart = createChart('phChart', 'pH', timestamps, deviceHistory.map(entry => entry.uplink.object.ph || null), 'rgba(75, 192, 192, 1)');
            chartsRef.current.phosphorusChart = createChart('phosphorusChart', 'Фосфор', timestamps, deviceHistory.map(entry => entry.uplink.object.phosphorus || null), 'rgba(153, 102, 255, 1)');
            chartsRef.current.potassiumChart = createChart('potassiumChart', 'Калий', timestamps, deviceHistory.map(entry => entry.uplink.object.potassium || null), 'rgba(255, 99, 132, 1)');
            chartsRef.current.saltSaturationChart = createChart('saltSaturationChart', 'Насыщенность солей', timestamps, deviceHistory.map(entry => entry.uplink.object.salt_saturation || null), 'rgba(54, 162, 235, 1)');
            chartsRef.current.tdsChart = createChart('tdsChart', 'TDS', timestamps, deviceHistory.map(entry => entry.uplink.object.tds || null), 'rgba(75, 192, 192, 1)');
            chartsRef.current.temperatureChart = createChart('groundTemperatureChart', 'Температура (°C)', timestamps, deviceHistory.map(entry => entry.uplink.object.temperature || null), 'rgba(153, 102, 255, 1)');
            console.log('deviceHistory in ground', deviceHistory);
            chartsRef.current.nitrogenChart = createChart('nitrogenChart', 'Азот', timestamps, deviceHistory.map(entry => entry.uplink.object.nitrogen || null), 'rgba(255, 206, 86, 1)');
        }

        // Уничтожаем графики при размонтировании компонента
        return () => destroyCharts();
    }, [deviceHistory, isMeteo, isGround]);

    const createChart = (id, label, labels, data, color) => {
        const ctx = document.getElementById(id)?.getContext('2d');
        if (!ctx) return null; // Проверка, если canvas не найден
    
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label,
                        data,
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.2)'),
                        pointRadius: 4,
                        pointHoverRadius: 15,
                        fill: true,
                        spanGaps: true,  // эта опция указывает Chart.js игнорировать пропуски в данных и продолжать рисовать линию, как если бы данные в этих точках существовали
                    },
                ],
            },
            options: {
                responsive: true,  // Автоматическая подстройка по контейнеру
                maintainAspectRatio: false,  // Не сохранять пропорции, растягиваем по ширине и высоте
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            title: (tooltipItems) => tooltipItems[0]?.label || '',
                            label: (tooltipItem) => `${label}: ${tooltipItem.raw}`,
                        },
                        // Устанавливаем параметры шрифта
                        titleFont: {
                            size: 25, // Размер шрифта заголовка
                        },
                        bodyFont: {
                            size: 20, // Размер шрифта тела тултипа
                            weight: 'bold', // Стиль шрифта
                        },
                        footerFont: {
                            size: 17, // Размер шрифта футера (если используется)
                        },
                    },
                },
                hover: {
                    mode: 'nearest',
                    intersect: true,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Время',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: label,
                        },
                    },
                },
            },
        });
    };
    
    
    


    return (
        <div>
            <h2>Дашборд</h2>
            {isMeteo && (
                <>
                    <h3>Метеостанция</h3>
                    <div style={{ width: '90vw', height: '400px' }}>
                        <canvas id="temperatureChart" className={style.canvas}></canvas>
                    </div>
                    <div style={{ width: '90vw', height: '400px' }}>
                        <canvas id="humidityChart" className={style.canvas}></canvas>
                    </div>
                    <div style={{ width: '90vw', height: '400px' }}>
                        <canvas id="pressureChart" className={style.canvas}></canvas>
                    </div>
                    <div style={{ width: '90vw', height: '400px' }}>
                        <canvas id="rainfallChart" className={style.canvas}></canvas>
                    </div>
                </>
            )}
            {isGround && (
                <>
                    <h3>Геодатчик</h3>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="conductivityChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="groundHumidityChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="phChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="phosphorusChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="potassiumChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="saltSaturationChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="tdsChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="groundTemperatureChart" className={style.canvas}></canvas></div>
                    <div style={{ width: '90vw', height: '400px' }}><canvas id="nitrogenChart" className={style.canvas}></canvas></div>
                </>
            )}
        </div>
    );
}
