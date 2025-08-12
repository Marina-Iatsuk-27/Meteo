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
    console.log('deviceHistory в графиках', deviceHistory);

    console.log('isMeteo?', isMeteo);
    console.log('isGround?', isGround);
    
    const chartsRef = useRef({});

    useEffect(() => {
        // Уничтожаем старые графики
        const destroyCharts = () => {
            Object.values(chartsRef.current).forEach(chart => chart?.destroy());
        };
        destroyCharts();
    
        // Берём копию deviceHistory в обратном порядке (с самых ранних к самым поздним)
        const reversedHistory = deviceHistory.slice().reverse();
    
        // Тimestamps — из reversedHistory, парсим raw_data если возможно
        const timestamps = reversedHistory.map(entry => {
          try {
            const parsed = JSON.parse(entry.raw_data);
            return new Date(parsed.time).toLocaleString();
          } catch {
            return new Date(entry.time).toLocaleString();
          }
        });
    
        if (isMeteo) {
            chartsRef.current.temperatureChart = createChart(
                'temperatureChart',
                'Температура (°C)',
                timestamps,
                reversedHistory.map(entry => entry?.temperature ?? null),
                'rgba(255, 99, 132, 1)'
            );
            chartsRef.current.humidityChart = createChart(
                'humidityChart',
                'Влажность (%)',
                timestamps,
                reversedHistory.map(entry => entry?.humidity ?? null),
                'rgba(54, 162, 235, 1)'
            );
            chartsRef.current.pressureChart = createChart(
                'pressureChart',
                'Давление (hPa)',
                timestamps,
                reversedHistory.map(entry => entry?.pressure ?? null),
                'rgba(75, 192, 192, 1)'
            );
            chartsRef.current.rainfallChart = createChart(
                'rainfallChart',
                'Осадки (мм)',
                timestamps,
                reversedHistory.map(entry => entry?.rainfall === '-' ? null : entry?.rainfall),
                'rgba(153, 102, 255, 1)'
            );
        }
    
        if (isGround) {
            const parsedObjects = reversedHistory.map(entry => {
              try {
                const parsed = JSON.parse(entry.raw_data);
                return parsed.object ?? {};
              } catch {
                return {};
              }
            });
    
            chartsRef.current.conductivityChart = createChart(
                'conductivityChart',
                'Проводимость',
                timestamps,
                parsedObjects.map(obj => obj.conductivity ?? null),
                'rgba(255, 159, 64, 1)'
            );
            chartsRef.current.humidityChart = createChart(
                'groundHumidityChart',
                'Влажность (%)',
                timestamps,
                parsedObjects.map(obj => obj.humidity ?? null),
                'rgba(54, 162, 235, 1)'
            );
            chartsRef.current.phChart = createChart(
                'phChart',
                'pH',
                timestamps,
                parsedObjects.map(obj => obj.ph ?? null),
                'rgba(75, 192, 192, 1)'
            );
            chartsRef.current.phosphorusChart = createChart(
                'phosphorusChart',
                'Фосфор',
                timestamps,
                parsedObjects.map(obj => obj.phosphorus ?? null),
                'rgba(153, 102, 255, 1)'
            );
            chartsRef.current.potassiumChart = createChart(
                'potassiumChart',
                'Калий',
                timestamps,
                parsedObjects.map(obj => obj.potassium ?? null),
                'rgba(255, 99, 132, 1)'
            );
            chartsRef.current.saltSaturationChart = createChart(
                'saltSaturationChart',
                'Насыщенность солей',
                timestamps,
                parsedObjects.map(obj => obj.salt_saturation ?? null),
                'rgba(54, 162, 235, 1)'
            );
            chartsRef.current.tdsChart = createChart(
                'tdsChart',
                'TDS',
                timestamps,
                parsedObjects.map(obj => obj.tds ?? null),
                'rgba(75, 192, 192, 1)'
            );
            chartsRef.current.temperatureChart = createChart(
                'groundTemperatureChart',
                'Температура (°C)',
                timestamps,
                parsedObjects.map(obj => obj.temperature ?? null),
                'rgba(153, 102, 255, 1)'
            );
            chartsRef.current.nitrogenChart = createChart(
                'nitrogenChart',
                'Азот',
                timestamps,
                parsedObjects.map(obj => obj.nitrogen ?? null),
                'rgba(255, 206, 86, 1)'
            );
        }
    
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
        <div className={style.dashboardHistoryContainer}>
          <h2>График изменений</h2>
          {isMeteo && (
            <>
              <h3>Метеостанция</h3>
              <div className={style.chartWrapper}>
                <canvas id="temperatureChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="humidityChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="pressureChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="rainfallChart" className={style.canvas}></canvas>
              </div>
            </>
          )}
          {isGround && (
            <>
              <h3>Геодатчик</h3>
              <div className={style.chartWrapper}>
                <canvas id="conductivityChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="groundHumidityChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="phChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="phosphorusChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="potassiumChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="saltSaturationChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="tdsChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="groundTemperatureChart" className={style.canvas}></canvas>
              </div>
              <div className={style.chartWrapper}>
                <canvas id="nitrogenChart" className={style.canvas}></canvas>
              </div>
            </>
          )}
        </div>
      );
}
