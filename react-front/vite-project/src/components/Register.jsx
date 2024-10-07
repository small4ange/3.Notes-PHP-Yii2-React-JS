import React, { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const apiRegisterUser = async ({ email, password }) => {
    console.group('RegisterUser');

    try {
      let response = await fetch('http://localhost/3_тестовое/back/web/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let responseDataObject = await response.json();
      console.log(responseDataObject);

      if (responseDataObject.errors) {
        alert('Ошибка при регистрации пользователя: ' + responseDataObject.errors);
      } else {
        alert('Пользователь успешно зарегистрирован!');
      }
    } catch (error) {
      console.log('Ошибка запроса:', error);
    }

    console.groupEnd();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiRegisterUser({ email, password });
  };

  return (
    <form id="register-user" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Регистрация</h2>
      <input type="text" id="user-register-email" placeholder="Введите email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" id="user-register-password" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" style={{ marginTop: '10px' }}>Зарегистрироваться</button>
    </form>
  );
}
