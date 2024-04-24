import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SatisfactionYearsChart({ employees }) {
  const data = {
    labels: employees.map(employee => employee.name),
    datasets: [
      {
        label: 'Уровень удовлетворенности (%)',
        data: employees.map(employee => employee.satisfactionLevel),
        backgroundColor: 'rgba(188, 120, 240, 0.5)',
      },
      {
        label: 'Годы в компании',
        data: employees.map(employee => employee.yearsInCompany),
        backgroundColor: 'rgba(55, 0, 97, 0.5)',
      },
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
    const printableElement = document.getElementById('satisfactionYearsChart');
    printableElement.classList.add("print-this");
    window.print();
    printableElement.classList.remove("print-this");
  }

  // Данные о KPI (примерные данные, здесь нужна адаптация под вашу модель данных)
  const kpiData = employees.map(employee => ({
    name: employee.name,
    satisfactionLevel: employee.satisfactionLevel,
    yearsInCompany: employee.yearsInCompany
  }));

  return (
    <div style={{margin: '0px 100px'}}>
      <div id='satisfactionYearsChart' style={{ display: 'flex', justifyContent: 'center',  }}>
      <div style={{ width: '70%' }}>
        <h2>Уровень удовлетворённости и годы в компании</h2>
        <Bar data={data} options={options} />
        <div>
        <h4>Данные о сотрудниках</h4>
      <ul style={{ listStyleType: 'none', textAlign: 'left' }} className="employee-list">
        {employees.map((employee, index) => (
          <li key={index} className="employee-item">
            <strong>{employee.name}</strong>: уровень удовлетворенности: <strong>{employee.satisfactionLevel}%</strong>, годы в компании: <strong>{employee.yearsInCompany}</strong>
          </li>
        ))}
      </ul>
        </div>
      </div>
          </div>
          <button className='print-button' onClick={handlePrint}>Печать</button>

      </div>
  );
}

export default SatisfactionYearsChart;
