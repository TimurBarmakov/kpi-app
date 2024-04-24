import React from 'react';

function KPIOverviewTable({ employees }) {
    return (
        <div>
            <h2>KPI работников по месяцам</h2>
            <table className="fullWidthTable">
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Позиция</th>
                        {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => (
                            <th key={month}>{month.toUpperCase()}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.position}</td>
                            {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map(month => (
                                <td key={month}>{employee.kpiRecords ? employee.kpiRecords[month] || "-" : "-"}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default KPIOverviewTable;
