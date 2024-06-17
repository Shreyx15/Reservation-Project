import { React, useEffect } from 'react';
import { Chart } from 'chart.js';
import "./PieChartForVisits.scss";

const PieChartForVisits = () => {
    const visits = [300, 50, 100];

    useEffect(() => {
        const canvas = document.getElementById('myPieChart');

        if (canvas) {
            const ctx = canvas.getContext('2d');
            const existingChart = Chart.getChart(ctx);

            if (existingChart) {
                existingChart.destroy();
            }

            const config = {
                type: 'pie',
                data: {
                    labels: [
                        'Red',
                        'Blue',
                        'Yellow'
                    ],
                    datasets: [{
                        label: 'My First Dataset',
                        data: visits,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                        ],
                        hoverOffset: 4
                    }]
                }
            };

            var pieChart = new Chart(ctx, config);
        }

        return () => {
            pieChart.destroy();
        }

    }, [visits]);


    return (
        <div className='pieChart'>
            <canvas id='myPieChart' />
        </div>
    );
};

export default PieChartForVisits;