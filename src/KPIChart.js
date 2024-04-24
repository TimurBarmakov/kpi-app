import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function KPIChart({ employees }) {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  const getAverageMonthlyKPI = (kpiRecords) => {
    if (!kpiRecords) return 0; // Если kpiRecords не определен, возвращаем 0
  
    const kpiValues = months.map(month => {
      const value = kpiRecords[month];
      return value ? parseFloat(value) : NaN; // Если значение месяца не определено, используем NaN для фильтрации
    });
  
    const validKPIs = kpiValues.filter(value => !isNaN(value));
    return validKPIs.length > 0 ? (validKPIs.reduce((sum, value) => sum + value, 0) / validKPIs.length) : 0;
  };
  

  const data = {
    labels: employees.map(employee => `${employee.name} (${employee.position})`),
    datasets: [
      {
        label: 'KPI прошлого года (%)',
        data: employees.map(employee => parseFloat(employee.kpi ? employee.kpi.replace('%', '') : 0)),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'KPI (%)',
        data: employees.map(employee => getAverageMonthlyKPI(employee.kpiRecords)),
        backgroundColor: 'rgba(33, 39, 79, 0.5)',
      },
      {
        label: 'Цель KPI (%)',
        data: employees.map(employee => parseFloat(employee.kpiTarget ? employee.kpiTarget.replace('%', '') : 0)),
        backgroundColor: 'rgba(145, 20, 17, 0.5)',
      },
      {
        label: 'Выполненные проекты',
        data: employees.map(employee => employee.projectsCompleted),
        backgroundColor: 'rgba(55, 140, 75, 0.5)',
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

  const handlePrint = () => {
    const printableElement = document.getElementById('kpiChart');
    printableElement.classList.add("print-this");
    window.print();
    printableElement.classList.remove("print-this");
  }

  return (
    <div>
      <div id='kpiChart' style={{ width: '70%', height: '30%', margin: '0 auto' }}>
      <h2>KPI сотрудников и выполненные проекты</h2>
      <Bar data={data} options={options} />
      <h4>Данные о сотрудниках</h4>
      <ul className="employee-list">
            {employees.map((employee, index) => (
                <li key={index} className="employee-item">
                    <strong>{employee.name}</strong>: KPI прошлого года: <strong>{employee.kpi}</strong>, KPI текущего года: <strong>{getAverageMonthlyKPI(employee.kpiRecords).toFixed(2)}%</strong>, цель KPI: <strong>{employee.kpiTarget}</strong>, выполненные проекты: <strong>{employee.projectsCompleted}</strong>
                </li>
            ))}
        </ul>
    </div>
    
    <button className='print-button' onClick={handlePrint}>Печать</button>
    </div>
  );
}

export default KPIChart;
