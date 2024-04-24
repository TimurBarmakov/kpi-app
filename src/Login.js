import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from 'react-router-dom';  // Добавьте этот импорт

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Вы вошли успешно!");
      // Перенаправление пользователя или обновление UI
    } catch (error) {
      setError("Не удалось войти: " + error.message);
    }
  };

  return (
    <div>
      <header className="App-header">
        <h1>Авторизация</h1>
        <h3>KPI сотрудников предприятия KAZPROM AVTOMATIKA</h3>
        <img src="/kpiLogo.svg" alt="Logo" />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin} className="form-container">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="form-button">Войти</button>
          <Link to="/register">
            <button className="register-button">Создать профиль</button>
          </Link>
        </form>
      </header>
    </div>
  );
}

export default Login;
