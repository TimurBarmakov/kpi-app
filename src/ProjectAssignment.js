import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc, query, getDocs } from 'firebase/firestore';

function ProjectAssignment({ employees = [], fetchEmployees }) {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [completionMonth, setCompletionMonth] = useState({});

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const projectsCollection = query(collection(db, "projects"));
        const querySnapshot = await getDocs(projectsCollection);
        const loadedProjects = [];
        for (const docSnapshot of querySnapshot.docs) {
            const project = { id: docSnapshot.id, ...docSnapshot.data() };
            project.employeesDetails = await Promise.all(
                project.employees.map(async id => {
                    const empRef = doc(db, "employees", id);
                    const empDoc = await getDoc(empRef);
                    return empDoc.exists() ? { id: empDoc.id, ...empDoc.data() } : null;
                })
            );
            loadedProjects.push(project);
        }
        setProjects(loadedProjects);
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedEmployees([...selectedEmployees, value]);
        } else {
            setSelectedEmployees(selectedEmployees.filter(id => id !== value));
        }
    };

    const handleCreateProject = async () => {
        if (!newProjectName || selectedEmployees.length === 0) {
            alert("Please enter a project name and select at least one employee.");
            return;
        }
        await addDoc(collection(db, "projects"), {
            projectName: newProjectName,
            employees: selectedEmployees,
            status: 'Active',
            impactOnKpi: 5
        });
        setNewProjectName('');
        setSelectedEmployees([]);
        fetchProjects();
        alert("Project added successfully!");
    };

    const handleCompleteProject = async (projectId) => {
        const month = completionMonth[projectId];
        if (!month) {
            alert("Please select the completion month before marking as completed.");
            return;
        }
        const projectRef = doc(db, "projects", projectId);
        const projectDoc = await getDoc(projectRef);
        const project = projectDoc.data();
    
        if (project && project.employees) {
            const updates = project.employees.map(async (employeeId) => {
                const empRef = doc(db, "employees", employeeId);
                const empDoc = await getDoc(empRef);
                const employee = empDoc.data();
                
                if (employee) {
                    // Calculate new KPI impact
                    const newKPI = (employee.kpiRecords && employee.kpiRecords[month] ? parseFloat(employee.kpiRecords[month]) : 0) + 2; // Assuming each project adds 5% to the KPI
                    const newProjectsCompleted = (employee.projectsCompleted || 0) + 1;
    
                    // Update employee data
                    await updateDoc(empRef, {
                        [`kpiRecords.${month}`]: newKPI.toString(),
                        projectsCompleted: newProjectsCompleted
                    });
                }
            });
            await Promise.all(updates); // Ensure all updates are applied
            fetchEmployees(); // Refresh the employees list

        }
    
        // Mark the project as completed
        await updateDoc(projectRef, {
            status: 'Completed',
            completionMonth: month
        });
    
        fetchProjects();
        alert(`Project marked as completed in ${month}`);
    };
    

    const handleMonthChange = (projectId, month) => {
        setCompletionMonth(prev => ({ ...prev, [projectId]: month }));
    };

    const handleDeleteProject = async (projectId) => {
        await deleteDoc(doc(db, "projects", projectId));
        fetchProjects();
    };

    return (
        <div className="container">
            <h2>Добавить проект</h2>
            <input
                type="text"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                className="input-field"
                placeholder="Название нового проекта"
            />
            <div className="checkbox-container">
                {employees.map(employee => (
                    <label key={employee.id} className="checkbox-label">
                        <input
                            type="checkbox"
                            value={employee.id}
                            onChange={handleCheckboxChange}
                            checked={selectedEmployees.includes(employee.id)}
                        />
                        {employee.name}
                    </label>
                ))}
            </div>
            <button className="button" onClick={handleCreateProject}>Добавить проект</button>

            <h2>Текущие проекты</h2>
            <div className="projects-list">
                {projects.map(project => (
                    <div key={project.id} className="project-entry">
                        <p>Название проекта: {project.projectName}</p>
                        <p>Статус: {project.status}</p>
                        <p>Участники: {project.employeesDetails.map(emp => emp ? emp.name : "Unknown").join(", ")}</p>
                        {project.status === 'Active' && (
                            <>
                                <p>Месяц завершения:</p>
                                <select value={completionMonth[project.id] || ''}
                                        onChange={(e) => handleMonthChange(project.id, e.target.value)}
                                        style={{marginRight: '10px'}}>
                                    <option value="">Выберите месяц</option>
                                    <option value="jan">Январь</option>
                                    <option value="feb">Февраль</option>
                                    <option value="mar">Март</option>
                                    <option value="apr">Апрель</option>
                                    <option value="may">Май</option>
                                    <option value="jun">Июнь</option>
                                    <option value="jul">Июль</option>
                                    <option value="aug">Август</option>
                                    <option value="sep">Сентябрь</option>
                                    <option value="oct">Октябрь</option>
                                    <option value="nov">Ноябрь</option>
                                    <option value="dec">Декабрь</option>
                                </select>
                                <button onClick={() => handleCompleteProject(project.id)}>Завершить</button>
                            </>
                        )}
                        {project.status === 'Completed' && <p>Завершено в {project.completionMonth}</p>}
                        <button onClick={() => handleDeleteProject(project.id)} style={{marginLeft: '10px'}}>Удалить</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectAssignment;
