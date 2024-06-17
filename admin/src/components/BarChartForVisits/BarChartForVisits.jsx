import React, { useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import "./barChartForVisits.scss";

const BarChartForVisits = () => {
    Chart.register(...registerables);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const visitData = [100, 150, 120, 200, 180, 250, 300, 280, 220, 150, 120, 180];

    useEffect(() => {
        const canvas = document.getElementById("myBarChart");

        if (canvas) {
            const ctx = canvas.getContext('2d');
            const existingChart = Chart.getChart(ctx);

            if (existingChart) {
                existingChart.destroy();
            }

            const config = {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: 'Month',
                        data: visitData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        borderRadius: 10,

                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Visits',
                                font: {
                                    weight: 'bold',
                                }
                            },
                        },
                    },
                },
            }
            var barChart = new Chart(ctx, config);
        }

        return () => {
            barChart.destroy();
        };
    }, [months, visitData]);

    return (
        <div className='barChart'>
            <canvas id='myBarChart' />
        </div>
    );
};

export default BarChartForVisits;
