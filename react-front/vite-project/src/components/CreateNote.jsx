import React, { useState } from 'react';
import './CreateNote.css'

const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [files, setFiles] = useState(null);  //массив выбранных файлов
    const [tags, setTags] = useState([]); //массив тегов
    const [currentTag, setCurrentTag] = useState('');

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleAddTag = () => {
        if(currentTag.trim()){
            setTags([ ...tags, currentTag.trim()])
            setCurrentTag('');
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert('Пользователь не авторизован');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('text', text);
        formData.append('tags', JSON.stringify(tags));

        if (files) {
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
            }
        }

        try {
            const response = await fetch(`http://localhost/3_тестовое/back/web/api/create?userId=${userId}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Ошибка создания заметки:', error);
        }

        window.location.reload();
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            <h2 className="form-title">Создать новую заметку</h2>
            <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="note-input title-input"
            />
            <textarea
                placeholder="Текст заметки"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="note-input text-input"
            ></textarea>

            <div className="file-input-wrapper">
                <label className="file-input-label">Выбрать файлы</label>
                <input type="file" multiple onChange={handleFileChange} className="file-input" />
            </div>

            <div className="tags-container">
                {tags.map((tag, index) => (
                        <div key={index} className="tag">
                            #{tag}
                        </div>
                    ))}
            </div>
            <div className="tag-input-wrapper">
                <input
                    type="text"
                    placeholder="Введите тег (например: #покупки, #работа)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    className="tag-input"
                />
                <button type="button" onClick={handleAddTag} className="add-tag-button">
                    +
                </button>
            </div>
            {/* <input type="text" placeholder="Введите тег (например: #покупки, #работа)" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} /> */}
            {/* <button type="button" onClick={handleAddTag} className="add-tag-button">
                Добавить тег
            </button> */}
            <div className="button-container">
                <button type="submit" className="submit-button">Создать заметку</button>
            </div>
        </form>
    );
};

export default CreateNote;
