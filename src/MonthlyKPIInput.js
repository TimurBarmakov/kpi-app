import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

function MonthlyKPIInput({ onUpdate, fetchEmployees }) {
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [kpiData, setKpiData] = useState({
        jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
        jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
    });

    useEffect(() => {
        const fetchEmployeesInternal = async () => {
            const querySnapshot = await getDocs(collection(db, "employees"));
            const employeesData = querySnapshot.docs.map(doc => ({
                id: doc.id, 
                name: doc.data().name, 
                position: doc.data().position,
                kpiRecords: doc.data().kpiRecords || {}
            }));
            setEmployees(employeesData);
            setPositions([...new Set(employeesData.map(employee => employee.position))]);
        };
        fetchEmployeesInternal();
    }, []);

    const handlePositionChange = (e) => {
        setSelectedPosition(e.target.value);
        setSelectedEmployeeId('');
    };

    const handleEmployeeChange = (e) => {
        setSelectedEmployeeId(e.target.value);
        const selectedEmployee = employees.find(employee => employee.id === e.target.value);
        const filledKpiData = Object.keys(kpiData).reduce((acc, month) => {
            acc[month] = selectedEmployee && selectedEmployee.kpiRecords ? (selectedEmployee.kpiRecords[month] || '') : '';
            return acc;
        }, {});
        setKpiData(filledKpiData);
    };

    const handleUpdateKPI = async () => {
        const employeeRef = doc(db, "employees", selectedEmployeeId);
        try {
            await updateDoc(employeeRef, {
                kpiRecords: kpiData
            });
            alert("KPI records updated successfully!");
            fetchEmployees(); // Refresh the employees list
        } catch (error) {
            console.error("Error updating KPI records: ", error);
            alert("Error updating KPI records: " + error.message);
        }
    };

    return (
        <div>
            <h2>Редактирование данных KPI по месяцам</h2>
            <div>
                <label style={{ marginRight: '20px' }}>Выберите должность:</label>
                <select value={selectedPosition} onChange={handlePositionChange} style={{ width: '200px', marginBottom: '10px' }}>
                    <option value="">Выберите должность</option>
                    {positions.map(position => (
                        <option key={position} value={position}>{position}</option>
                    ))}
                </select>
            </div>
            {selectedPosition && (
                <div>
                    <label style={{ marginRight: '20px' }}>Выберите сотрудника:</label>
                    <select value={selectedEmployeeId} onChange={handleEmployeeChange} style={{ width: '200px', marginBottom: '10px' }}>
                        <option value="">Выберите сотрудника</option>
                        {employees.filter(employee => employee.position === selectedPosition).map(filteredEmployee => (
                            <option key={filteredEmployee.id} value={filteredEmployee.id}>{filteredEmployee.name}</option>
                        ))}
                    </select>
                </div>
            )}
            {selectedEmployeeId && Object.keys(kpiData).map(month => (
                <div key={month}>
                    <label style={{ marginRight: '20px' }}>{month.toUpperCase()}:</label>
                    <input
                        type="text"
                        value={kpiData[month]}
                        onChange={e => setKpiData(prev => ({ ...prev, [month]: e.target.value }))}
                        style={{ width: '150px', padding: '4px', marginBottom: '10px' }}
                    />
                </div>
            ))}
            <button onClick={handleUpdateKPI} className='addButton'>Сохранить KPI</button>
        </div>
    );
}

export default MonthlyKPIInput;
