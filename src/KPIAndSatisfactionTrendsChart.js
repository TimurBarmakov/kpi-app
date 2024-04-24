import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

function KPIAndSatisfactionTrendsChart({ employees }) {
  const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

  const prepareChartData = () => {
    let totalKpiTarget = employees.reduce((acc, cur) => acc + parseFloat(cur.kpiTarget), 0) / employees.length;
    let kpiData = months.map(month => ({
      values: [],
      sum: 0
    }));

    employees.forEach(employee => {
      months.forEach((month, index) => {
        const kpi = employee.kpiRecords && employee.kpiRecords[month] ? parseFloat(employee.kpiRecords[month]) : null;
        if (kpi) {
          kpiData[index].values.push(kpi);
          kpiData[index].sum += kpi;
        }
      });
    });

    let kpiAverages = kpiData.map(data => data.values.length > 0 ? data.sum / data.values.length : null);
    let cumulativeKPI = kpiAverages.reduce((acc, cur) => cur !== null ? acc + cur : acc, 0);
    let monthsWithData = kpiAverages.filter(kpi => kpi !== null).length;
    let remainingMonths = months.length - monthsWithData;
    let predictedKPI = kpiAverages.slice(); // Copy the averages for modification

    if (remainingMonths > 0) {
      let requiredKPI = (totalKpiTarget * months.length - cumulativeKPI) / remainingMonths;
      for (let i = monthsWithData; i < months.length; i++) {
        predictedKPI[i] = requiredKPI;
      }
    }

    return {
      kpiAverages,
      predictedKPI
    };
  };

  const { kpiAverages, predictedKPI } = prepareChartData();

  const data = {
    labels: months.map(month => month.charAt(0).toUpperCase() + month.slice(1)),
    datasets: [
      {
        label: 'Средний KPI',
        data: kpiAverages,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Предсказанный KPI',
        data: predictedKPI,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    }
  };

  const handlePrint = () => {
    const printableElement = document.getElementById('kpiAndSatisfactionChart');
    printableElement.classList.add("print-this");
    window.print();
    printableElement.classList.remove("print-this");
  }

  return (
    <div>
      <div id='kpiAndSatisfactionChart' style={{ width: '70%', height: '30%', margin: '0 auto' }}>
      <h2>График KPI</h2>
      <Line data={data} options={options} />
      </div>
      <button className='print-button' onClick={handlePrint}>Печать</button>
    </div>

  );
}

export default KPIAndSatisfactionTrendsChart;
