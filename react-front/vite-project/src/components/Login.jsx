import React, { useState } from 'react';
import GetAllNotes from './ApiCRUDNote';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const apiLoginUser = async ({ email, password }) => {
    console.group('LoginUser');

    try {
      const response = await fetch('http://localhost/3_тестовое/back/web/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const responseDataObject = await response.json();
      console.log(responseDataObject);

      if ((!responseDataObject.errors) && (responseDataObject.status === 'success')) {
        localStorage.setItem('user_id', responseDataObject.id);
        GetAllNotes();
      } else {
        alert('Ошибка при аутентификации пользователя: ' + responseDataObject.errors);
      }
    } catch (error) {
      console.error('Ошибка соединения с сервером:', error);
    }

    console.groupEnd();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiLoginUser({ email, password });
  };

  return (
    <form id="login-user" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Вход</h2>
      <input type="text" id="user-login-email" placeholder="Введите email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" id="user-login-password" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" style={{ marginTop: '10px' }}>Войти</button>
    </form>
  );
}
