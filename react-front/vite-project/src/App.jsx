import React, { useState, useEffect } from 'react';

//модальное окно для просмотра и редактирования заметок
function Modal({ note, onClose, onSave }) {
    const [editedTitle, setEditedTitle] = useState(note.title);
    const [editedText, setEditedText] = useState(note.note_text);

    const handleSave = () => {
        onSave({ ...note, title: editedTitle, note_text: editedText });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Редактировать заметку</h2>
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}

//вся логика работы с заметками
function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedNote, setSelectedNote] = useState(null); //выбранная заметка для редактирования или просмотра

    useEffect(() => {
        fetchNotes();
    }, []);

    //получение заметок от back
    const fetchNotes = async () => {
        try {
            let response = await fetch('http://localhost/3_тестовое/back/web' + '/api/index?user_id=' + localStorage.getItem('user_id'));
            let data = await response.json();
            setNotes(data.allNotes || []);
        } catch (error) {
            console.error('Ошибка получения заметок:', error);
        }
    };

    //создание заметки
    const createNote = async (event) => {
        event.preventDefault();
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          alert('Пользователь не авторизован');
          return;
      } else {
        console.log("userId" + userId);
      }
      console.log("userId" + userId);
        try {
            let response = await fetch('http://localhost/3_тестовое/back/web' + '/api/create?userId=' + userId, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  'title': title,
                  'text': text,
              }),
            });
            let data = await response.json();
            console.log(data);
            
            if(!data.errors) {
              fetchNotes();
              setTitle('');
              setText('');
            }
            

        } catch (error) {
            console.error('Ошибка создания заметки:', error);
        }
    };

    //редактирование заметки
    const updateNote = async (updatedNote) => {
        try {
            console.log(updatedNote.id, updatedNote.note_text, updatedNote.title)
            let response = await fetch('http://localhost/3_тестовое/back/web' + '/api/update?id=' + updatedNote.id , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: updatedNote.title, text: updatedNote.note_text }),
            });
            let data = await response.json();
            if (!data.errors) {
                fetchNotes();
                setSelectedNote(null); //закрыть модальное окно после сохранения
            } else {
                alert('Ошибка при обновлении заметки');
            }
        } catch (error) {
            console.error('Ошибка обновления заметки:', error);
        }
    };

     //удаление заметки
     const deleteNote = async (noteId) => {
      try {
          let response = await fetch('http://localhost/3_тестовое/back/web' + '/api/delete?id=' + noteId, {
              method: 'DELETE',
          });

          let data = await response.json();
          console.log(data);

          if (data.msg === 'Note deleted successfully') {
              fetchNotes();
          } else {
              alert('Ошибка удаления заметки');
          }
      } catch (error) {
          console.error('Ошибка удаления заметки:', error);
      }
  };

    //выход пользователя
    const logout = () => {
        localStorage.removeItem('user_id');
        window.location.reload();
    };

    return (
        <div>
            <div className="header">
                <h1>Заметки</h1>
                <button onClick={logout}>Выйти</button>
            </div>

            <form onSubmit={createNote}>
                <h2>Новая заметка</h2>
                <input
                    type="text"
                    placeholder="Введите заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    placeholder="Введите текст"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Создать</button>
            </form>

            <h2>Список заметок</h2>
            <div id="notes-list">
                {notes.length > 0 ? (
                    notes.map((note) => (
                      <div>
                        <div
                            key={note.id}
                            className="note"
                            onClick={() => setSelectedNote(note)}
                        >
                            <div className="title">
                                <p><b>{note.title}</b></p>
                            </div>
                            <div className="text">
                                <p>{note.note_text}</p>
                            </div>
                            <div className="date">
                                <p>{note.date}</p>
                            </div>
                            
                        </div>
                        <button onClick={() => deleteNote(note.id)}>Удалить</button>
                      </div>
                    ))
                ) : (
                    <p>Заметок не найдено</p>
                )}
            </div>

            {selectedNote && (
                <Modal
                    note={selectedNote}
                    onClose={() => setSelectedNote(null)}
                    onSave={updateNote}
                />
            )}
        </div>
    );
}

function Auth({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); //true для логина, false для регистрации

    //авторизация пользователя
    const handleAuth = async (event) => {
        event.preventDefault();

        const url = isLogin ? '/api/login' : '/api/register';

        try {
            let response = await fetch('http://localhost/3_тестовое/back/web' + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  'email': email,
                  'password': password,
              }),
            });

            let responseData = await response.json();
            if (responseData.status === 'success') {
                localStorage.setItem('user_id', responseData.id);
                if (isLogin) {
                  onLogin(); //для загрузки заметок при входе
                } else {
                  setIsLogin(true);
                }
                
            } else {

                alert(responseData.errors || 'Ошибка аутентификации');
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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user_id')) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            {isAuthenticated ? <Notes /> : <Auth onLogin={handleLogin} />}
        </div>
    );
}

export default App;
