import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function KPISpreadByPosition({ employees }) {
  const positions = [...new Set(employees.map(employee => employee.position))];

  const { averageKPIByPosition, averageMonthlyKPIByPosition } = useMemo(() => {
    const kpiByPosition = positions.map(position => {
      const positionEmployees = employees.filter(e => e.position === position);
      const kpis = positionEmployees.map(e => parseFloat(e.kpi));
      const monthlyKpis = positionEmployees.flatMap(e => Object.values(e.kpiRecords || {}).map(kpi => parseFloat(kpi)));
      return {
        kpis: kpis.filter(kpi => !isNaN(kpi)),
        monthlyKpis: monthlyKpis.filter(kpi => !isNaN(kpi))
      };
    });

    const averageKPIByPosition = kpiByPosition.map(data => data.kpis.reduce((sum, kpi) => sum + kpi, 0) / data.kpis.length);
    const averageMonthlyKPIByPosition = kpiByPosition.map(data => data.monthlyKpis.reduce((sum, kpi) => sum + kpi, 0) / data.monthlyKpis.length);

    return { averageKPIByPosition, averageMonthlyKPIByPosition };
  }, [employees, positions]);

  // Создание градации одного цвета
  const getColor = intensity => `rgba(0, 123, 255, ${intensity})`;

  const positionData = {
    labels: positions,
    datasets: [{
      label: 'Средний KPI по должностям',
      data: averageKPIByPosition,
      backgroundColor: averageKPIByPosition.map(kpi => getColor(Math.min(1, kpi / 100))),
    }]
  };

  const monthlyData = {
    labels: positions,
    datasets: [{
      label: 'Средний месячный KPI по должностям',
      data: averageMonthlyKPIByPosition,
      backgroundColor: averageMonthlyKPIByPosition.map(kpi => getColor(Math.min(1, kpi / 100))),
    }]
  };

  const handlePrint = () => {
    const printableElement = document.getElementById('kpiSpreadByPosition');
    printableElement.classList.add("print-this");
    window.print();
    printableElement.classList.remove("print-this");
}

  return (
      <div style={{margin: '0px 100px'}}>
         <div id='kpiSpreadByPosition' style={{ display: 'flex', justifyContent: 'center',  }}>
        <div style={{ width: '30%' }}>
          <h2>Прошлогодний KPI по должностям</h2>
          <Doughnut data={positionData} />
        </div>
        <div style={{ width: '30%' }}>
          <h2>Средний KPI по должностям текущего года</h2>
          <Doughnut data={monthlyData} />
        </div>
        <div>
      <h4>Данные о KPI</h4>
      <ul style={{ listStyleType: 'none', textAlign: 'left' }} className="employee-list">
        {positions.map((position, index) => (
          <li key={position} className="employee-item">
            <strong>{position}</strong>: прошлогодний KPI: <strong>{averageKPIByPosition[index].toFixed(2)}%</strong>, средний KPI: <strong>{averageMonthlyKPIByPosition[index].toFixed(2)}%</strong>
          </li>
        ))}
      </ul>
    </div>
      </div>
      <button style={{ marginTop: '50px' }} className='print-button' onClick={handlePrint} >Печать</button>
      </div>


  );
}

export default KPISpreadByPosition;
