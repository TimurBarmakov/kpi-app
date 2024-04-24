import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import KPITable from './KPITable';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onAuthSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register onAuthSuccess={() => setIsAuthenticated(true)} />} />
          <Route path="/" element={
            isAuthenticated ? (
              <div>
                <header className="App-header">
                  <h1>Добро пожаловать!</h1>
                  <h3>KPI сотрудников предприятия KAZPROM AVTOMATIKA</h3>
                  <img src="/kpiLogo.svg" alt="Logo" />
                  <button onClick={handleLogout} className="logout-button">Выход</button>
                </header>
                <KPITable />
              </div>
            ) : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
