import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import KPIChart from './KPIChart';
import KPIChartDiagramm from './KPIChartDiagramm' ;
import SatisfactionYearsChart from './SatisfactionYearsChart';
import KPISpreadByPosition from './KPISpreadByPosition';
import KPIAndSatisfactionTrendsChart from './KPIAndSatisfactionTrendsChart';
import EditEmployeeModal from './modals/EditModal';
import MonthlyKPIInput from './MonthlyKPIInput';
import KPIOverviewTable from './KPIOverviewTable';
import ProjectAssignment from './ProjectAssignment';
import ProjectsChart from './ProjectsChart';

function KPITable() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('Все');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    kpi: '',
    kpiTarget: '',
    projectsCompleted: '',
    satisfactionLevel: '',
    yearsInCompany: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    const orderIndex = employees.length > 0 ? Math.max(...employees.map(emp => emp.orderIndex)) + 1 : 1;
  
    try {
      await addDoc(collection(db, "employees"), {
        ...newEmployee,
        orderIndex,
        projectsCompleted: parseInt(newEmployee.projectsCompleted, 10),
        satisfactionLevel: parseInt(newEmployee.satisfactionLevel, 10),
        yearsInCompany: parseInt(newEmployee.yearsInCompany, 10),
        kpiRecords: {}
      });
  
      setNewEmployee({ name: '', position: '', kpiRecords: {}, kpiTarget: '', projectsCompleted: '', satisfactionLevel: '', yearsInCompany: '' });
      fetchEmployees(); 
    } catch (error) {
      console.error("Error adding employee: ", error);
    }
  };
  
  const handleEmployeeUpdate = (updatedEmployee) => {
    fetchEmployees();
  };
  

  const handleDeleteEmployee = async (id) => {
    await deleteDoc(doc(db, "employees", id));
    fetchEmployees();
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

const updateEmployeeKPI = async (employeeId, kpiRecords) => {
  const employeeRef = doc(db, "employees", employeeId);
  try {
    await updateDoc(employeeRef, {
      kpiRecords: kpiRecords
    });
    console.log("KPI records updated successfully!");
  } catch (error) {
    console.error("Error updating KPI records: ", error);
  }
};

  
  async function fetchEmployees() {
    setIsLoading(true);
    const q = query(collection(db, "employees"), orderBy("orderIndex", "asc"));
    const querySnapshot = await getDocs(q);
    const loadedEmployees = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmployees(loadedEmployees);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const positions = ['Все', ...new Set(employees.map((employee) => employee.position))];

  const filteredEmployees = selectedPosition === 'Все' ? employees : employees.filter((employee) => employee.position === selectedPosition);



  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ width: '40%', height: '30%', margin: '0 auto' }}>
        <h2>Добавление данных о сотрудниках</h2>
        <input type="text" name="name" placeholder="Имя Фамилия" value={newEmployee.name} onChange={handleChange} />
        <input type="text" name="position" placeholder="Должность" value={newEmployee.position} onChange={handleChange} />
        <input type="text" name="kpi" placeholder="KPI прошлого года" value={newEmployee.kpi} onChange={handleChange} />
        <input type="text" name="kpiTarget" placeholder="Цель KPI" value={newEmployee.kpiTarget} onChange={handleChange} />
        <input type="number" name="projectsCompleted" placeholder="Выполнено проектов" value={newEmployee.projectsCompleted} onChange={handleChange} />
        <input type="number" name="satisfactionLevel" placeholder="Уровень удовлетворенности" value={newEmployee.satisfactionLevel} onChange={handleChange} />
        <input type="number" name="yearsInCompany" placeholder="Лет в компании" value={newEmployee.yearsInCompany} onChange={handleChange} />

        <button onClick={handleAddEmployee} className='addButton'>Добавить</button>
      </div>
    
          
        
      <h2>Выберите отдел</h2>
      <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
        {positions.map((position, index) => (
          <option key={index} value={position}>{position}</option>
        ))}
      </select>
      <table  className="fullWidthTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Позиция</th>
            <th>KPI пр.года</th>
            <th>Цель KPI</th>
            <th>Завершено проектов</th>
            <th>Уровень удовл.</th>
            <th>Лет в компании</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.kpi}</td>
              <td>{employee.kpiTarget}</td>
              <td>{employee.projectsCompleted}</td>
              <td>{employee.satisfactionLevel}%</td>
              <td>{employee.yearsInCompany}</td>
              <td>
                <button onClick={() => handleEditClick(employee)} className='editButton'>Изменить</button>
                <button onClick={() => handleDeleteEmployee(employee.id)} className='deleteButton'>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isLoading && employees.length > 0 && (
    <>
    <ProjectAssignment 
              employees={filteredEmployees}
              fetchEmployees={fetchEmployees}/>
    <ProjectsChart employees={filteredEmployees}/>
    <MonthlyKPIInput
            onUpdate={(employeeId, kpiData) => {
              updateEmployeeKPI(employeeId, kpiData);
            }}
            fetchEmployees={fetchEmployees}
      />
    <KPIOverviewTable employees={filteredEmployees}/>
    <KPIChart employees={filteredEmployees} />
    <KPIChartDiagramm employees={filteredEmployees}/>
    <SatisfactionYearsChart employees={filteredEmployees}/>
    <KPISpreadByPosition employees={filteredEmployees} />
    <KPIAndSatisfactionTrendsChart employees={filteredEmployees} />

    {showEditModal && (
    <EditEmployeeModal
      employee={selectedEmployee}
      onClose={() => setShowEditModal(false)}
      onSave={(updatedEmployee) => {
        handleEmployeeUpdate(updatedEmployee);
        setShowEditModal(false);
        }}
      />
    )}
  
    
    </>
    )}
    </div>
  );

}

export default KPITable;
