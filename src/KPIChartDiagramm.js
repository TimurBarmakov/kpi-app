import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function PositionsPieChart({ employees }) {
  const data = useMemo(() => {
    const positionsCount = employees.reduce((acc, { position }) => {
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {});

    const colors = ['#f27c95', '#6a9aba', '#FFCE56', '#c391db', '#de7462', '#79b877', '#f0a54f', '#3d66a8']; // Example colors

    return {
      labels: Object.keys(positionsCount).map((position, index) => `${position} (${positionsCount[position]})`),
      datasets: [{
        label: 'Количество сотрудников по должностям',
        data: Object.values(positionsCount),
        backgroundColor: colors,
        hoverOffset: 4
      }]
    };
  }, [employees]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
          }
        }
      }
    }
  };

  const handlePrint = () => {
    const printableElement = document.getElementById('kpiChartDiagramm');
    printableElement.classList.add("print-this");
    window.print();
    printableElement.classList.remove("print-this");
  }

  return (
    <div>
      <div id='kpiChartDiagramm' style={{ width: '30%', height: '30%', margin: '0 auto' }}>
        <h2>Диаграмма количества сотрудников по должностям</h2>
        <Doughnut data={data} options={options} />
      </div>
      <button className='print-button' onClick={handlePrint}>Печать</button>
    </div>
  );
}

export default PositionsPieChart;
