import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProjectsChart({ employees }) {
    if (!employees || !Array.isArray(employees)) {
        return <p>Loading...</p>; // Убедитесь, что employees загружен
    }

    const getAverageMonthlyKPI = (kpiRecords) => {
        if (!kpiRecords || typeof kpiRecords !== 'object' || Object.keys(kpiRecords).length === 0) {
            return 0;
        }
        const values = Object.values(kpiRecords);
        const numericValues = values.map(value => parseFloat(value)).filter(value => !isNaN(value));
        if (numericValues.length === 0) return 0;
        return numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
    };

    const calculateProjectsNeeded = (kpiTarget, kpiRecords) => {
        const target = parseFloat(kpiTarget.replace('%', ''));
        const currentKPI = getAverageMonthlyKPI(kpiRecords);
        const difference = target - currentKPI;
        return difference > 0 ? Math.ceil(difference / 2) : 0;
    };

    const data = {
        labels: employees.map(employee => employee.name),
        datasets: [
            {
                label: 'Проектов до достижения цели KPI',
                data: employees.map(employee => calculateProjectsNeeded(employee.kpiTarget, employee.kpiRecords)),
                backgroundColor: 'rgba(62, 56, 130, 0.5)',
            }
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div style={{ width: '40%', height: '20%', margin: '0 auto' }}>
            <h2>Проекты для достижения целевого KPI</h2>
            <Bar data={data} options={options} />
        </div>
    );
}

export default ProjectsChart;
