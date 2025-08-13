import { useEffect, useRef, useMemo } from 'react';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip);

export default function SingleChart({ deviceHistory, label, keyName, unit, isMeteo, isGround }) {
    const chartRef = useRef(null);
    
    // Подготавливаем данные для графика
    const { timestamps, values, color } = useMemo(() => {
        if (!deviceHistory || deviceHistory.length === 0) {
            return { timestamps: [], values: [], color: 'rgba(54, 162, 235, 1)' };
        }
        
        // Берем историю в обратном порядке (от старых к новым)
        const reversedHistory = [...deviceHistory].reverse();
        
        // Получаем метки времени
        const ts = reversedHistory.map(entry => {
            try {
                const parsed = JSON.parse(entry.raw_data);
                return new Date(parsed.time).toLocaleString();
            } catch {
                return new Date(entry.time).toLocaleString();
            }
        });
        
        // Получаем значения и цвет для выбранного показателя
        let vals = [];
        let chartColor = 'rgba(54, 162, 235, 1)'; // Синий по умолчанию
        
        if (isMeteo) {
            // Для метеостанции берем значения напрямую из entry
            vals = reversedHistory.map(entry => {
                if (keyName === 'rainfall') {
                    return entry[keyName] === '-' ? null : entry[keyName];
                }
                return entry[keyName] ?? null;
            });
            
            // Устанавливаем цвет в зависимости от показателя
            switch(keyName) {
                case 'temperature':
                    chartColor = 'rgba(255, 99, 132, 1)'; // Красный
                    break;
                case 'humidity':
                    chartColor = 'rgba(54, 162, 235, 1)'; // Синий
                    break;
                case 'pressure':
                    chartColor = 'rgba(75, 192, 192, 1)'; // Зеленый
                    break;
                case 'rainfall':
                    chartColor = 'rgba(153, 102, 255, 1)'; // Фиолетовый
                    break;
                default:
                    chartColor = 'rgba(54, 162, 235, 1)'; // Синий по умолчанию
            }
        } 
        else if (isGround) {
            // Для геодатчика парсим raw_data.object
            const parsedObjects = reversedHistory.map(entry => {
                try {
                    const parsed = JSON.parse(entry.raw_data);
                    return parsed.object ?? {};
                } catch {
                    return {};
                }
            });
            
            vals = parsedObjects.map(obj => obj[keyName] ?? null);
            
            // Устанавливаем цвет в зависимости от показателя
            switch(keyName) {
                case 'conductivity':
                    chartColor = 'rgba(255, 159, 64, 1)'; // Оранжевый
                    break;
                case 'humidity':
                    chartColor = 'rgba(54, 162, 235, 1)'; // Синий
                    break;
                case 'ph':
                    chartColor = 'rgba(75, 192, 192, 1)'; // Зеленый
                    break;
                case 'phosphorus':
                    chartColor = 'rgba(153, 102, 255, 1)'; // Фиолетовый
                    break;
                case 'potassium':
                    chartColor = 'rgba(255, 99, 132, 1)'; // Красный
                    break;
                case 'salt_saturation':
                    chartColor = 'rgba(54, 162, 235, 1)'; // Синий
                    break;
                case 'tds':
                    chartColor = 'rgba(75, 192, 192, 1)'; // Зеленый
                    break;
                case 'temperature':
                    chartColor = 'rgba(153, 102, 255, 1)'; // Фиолетовый
                    break;
                case 'nitrogen':
                    chartColor = 'rgba(255, 206, 86, 1)'; // Желтый
                    break;
                default:
                    chartColor = 'rgba(54, 162, 235, 1)'; // Синий по умолчанию
            }
        }
        
        return { timestamps: ts, values: vals, color: chartColor };
    }, [deviceHistory, keyName, isMeteo, isGround]);
    
    // Создаем/обновляем график
    useEffect(() => {
        if (!timestamps.length || !values.some(v => v !== null)) {
            // Очищаем canvas, если нет данных
            const canvas = chartRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Нет данных для отображения', canvas.width / 2, canvas.height / 2);
            }
            return;
        }
        
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;
        
        // Уничтожаем предыдущий график, если он есть
        if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
        }
        
        // Создаем новый график
        chartRef.current.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [
                    {
                        label: `${label}${unit ? ` (${unit})` : ''}`,
                        data: values,
                        borderColor: color,
                        backgroundColor: color.replace('1)', '0.2)'),
                        pointRadius: 4,
                        pointHoverRadius: 15,
                        fill: true,
                        spanGaps: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
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
                            label: (tooltipItem) => `${label}: ${tooltipItem.raw}${unit ? ` ${unit}` : ''}`,
                        },
                        titleFont: {
                            size: 25,
                        },
                        bodyFont: {
                            size: 20,
                            weight: 'bold',
                        },
                        footerFont: {
                            size: 17,
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
        
        return () => {
            if (chartRef.current?.chart) {
                chartRef.current.chart.destroy();
            }
        };
    }, [timestamps, values, label, unit, color]);
    
    return (
        <div style={{ width: '100%', height: '500px', padding: '20px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{label}</h3>
            <canvas 
                ref={chartRef} 
                style={{ width: '100%', height: 'calc(100% - 40px)' }}
            />
        </div>
    );
}