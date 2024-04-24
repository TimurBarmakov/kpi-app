import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Link } from 'react-router-dom';  // Добавьте этот импорт


function Register({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (error) {
      console.error('Registration error:', error.message);
    }
  };

  return (
    <div>
    <header className="App-header">
      <h1>Регистрация</h1>
      <h3>KPI сотрудников предприятия KAZPROM AVTOMATIKA</h3>
      <div>
        <img src="/kpiLogo.svg" alt="Logo" />
      </div>
      <form onSubmit={handleRegister} className="form-container">
        <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
            <label>Пароль:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
        </div>
        <button type="submit" className="form-button">Зарегистрироваться</button>
        <Link to="/login">
            <button className="login-button">У меня уже есть профиль</button>
        </Link>
      </form>

    </header>
    </div>
  );
}

export default Register;
