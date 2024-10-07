import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function Auth({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); //true для логина, false для регистрации

    const handleAuth = async (event) => {
        event.preventDefault();
        const url = isLogin ? '/api/login' : '/api/register';
        try {
            let response = await fetch(site.backBaseUrl + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            let data = await response.json();
            if (data.status === 'success') {
                localStorage.setItem('user_id', data.id);
                onLogin();
            } else {
                alert(data.errors || 'Ошибка аутентификации');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
            <form onSubmit={handleAuth}>
                <input
                    type="text"
                    placeholder="Введите email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Перейти к регистрации' : 'Перейти ко входу'}
            </button>
        </div>
    );
}