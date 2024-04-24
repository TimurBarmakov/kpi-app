import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

function EditEmployeeModal({ employee, onClose, onSave }) {
  const [updatedEmployee, setUpdatedEmployee] = useState(employee);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const employeeRef = doc(db, "employees", updatedEmployee.id);
    try {
      await updateDoc(employeeRef, {
        name: updatedEmployee.name,
        position: updatedEmployee.position,
        kpi: updatedEmployee.kpi,
        kpiTarget: updatedEmployee.kpiTarget,
        projectsCompleted: parseInt(updatedEmployee.projectsCompleted, 10),
        satisfactionLevel: parseInt(updatedEmployee.satisfactionLevel, 10),
        yearsInCompany: parseInt(updatedEmployee.yearsInCompany, 10),
      });
      onSave(updatedEmployee);
      onClose();
    } catch (error) {
      console.error("Error updating employee: ", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Редактирование сотрудника</h2>
        <input type="text" name="name" value={updatedEmployee.name} onChange={handleChange} placeholder="Name" />
        <input type="text" name="position" value={updatedEmployee.position} onChange={handleChange} placeholder="Position" />
        <input type="text" name="kpi" value={updatedEmployee.kpi} onChange={handleChange} placeholder="KPI" />
        <input type="text" name="kpiTarget" value={updatedEmployee.kpiTarget} onChange={handleChange} placeholder="KPI Target" />
        <input type="number" name="projectsCompleted" value={updatedEmployee.projectsCompleted} onChange={handleChange} placeholder="Projects Completed" />
        <input type="number" name="satisfactionLevel" value={updatedEmployee.satisfactionLevel} onChange={handleChange} placeholder="Satisfaction Level" />
        <input type="number" name="yearsInCompany" value={updatedEmployee.yearsInCompany} onChange={handleChange} placeholder="Years in Company" />
        <button onClick={handleSave}>Сохранить изменения</button>
      </div>
    </div>
  );
}


export default EditEmployeeModal;
