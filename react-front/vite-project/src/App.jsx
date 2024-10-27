import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import './styles/Notes.css';
import './components/CreateNote';
import CreateNote from './components/CreateNote';
import Modal from './components/Modal';


//вся логика работы с заметками
function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [selectedNote, setSelectedNote] = useState(null); //выбранная заметка для редактирования или просмотра
    const [files, setFiles] = useState([]);

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


    //редактирование заметки
    const updateNote = async (updatedNote) => {
        try {
            const formData = new FormData();
            formData.append('title', updatedNote.title);
            formData.append('text', updatedNote.note_text);

            updatedNote.newFiles.forEach((file) => {
                formData.append('newFiles[]', file);
            });

            // удаление убранных файлов
            const removedFileIds = updatedNote.removedFiles;
            console.log(`removedFileIds:${removedFileIds}`);
            formData.append('removedFiles', JSON.stringify(removedFileIds));

            // updatedNote.newTags.forEach((tag) => {
            //     formData.append('newTags[]', tag);
            // });
            formData.append('newTags', JSON.stringify(updatedNote.newTags));
            
            const removedTagIds = updatedNote.removedTags;
            console.log(`removedTagIds:${removedTagIds}`);
            formData.append('removedTags', JSON.stringify(removedTagIds));

            let response = await fetch('http://localhost/3_тестовое/back/web' + '/api/update?id=' + updatedNote.id , {
                method: 'POST',
                body: formData,
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

            <div className="createnote-div">
                <CreateNote></CreateNote>
            </div>
            

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
                                <ReactMarkdown>{note.title}</ReactMarkdown>
                            </div>
                            <div className="text">
                                <ReactMarkdown>{note.note_text}</ReactMarkdown>
                            </div>
                            {note.files && note.files.length > 0 && (
                                <div className="files">
                                    <h3>Прикрепленные файлы:</h3>
                                    {note.files.map((file, index) => {
                                         const fileName = file.url.split('/').pop();
                                         const downloadUrl = `http://localhost/3_тестовое/back/web/api/download-file?fileName=${fileName}`;
                                         return (
                                            <div key={index} className="file">
                                                <a href={downloadUrl} download>
                                                    {file.name}
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            <div className="tags-section">
                                {note.tags.length>0 ? (
                                    note.tags.map((tag,index) => (
                                        <div key={index} className="tag-item">
                                            <p className="tag-text">
                                                #{tag.tag_name}
                                            </p>
                                        </div>
                                    ))
                                ): (
                                    <p></p>
                                )}
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
