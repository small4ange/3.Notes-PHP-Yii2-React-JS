import React, { useState } from 'react';
import './Modal.css';

//модальное окно для просмотра и редактирования заметок

function Modal({ note, onClose, onSave }) {
    const [editedTitle, setEditedTitle] = useState(note.title);
    const [editedText, setEditedText] = useState(note.note_text);
    const [currentFiles, setCurrentFiles] = useState(note.files || []);
    const [newFiles, setNewFiles] = useState([]);
    const [removedFileIds, setRemovedFileIds] = useState([]);
    const [newTags, setNewTags] = useState([]);
    const [removedTagIds, setRemovedTagIds] = useState([]);
    const [currentTags, setCurrentTags] = useState(note.tags || []);
    const [currentTag, setCurrentTag] = useState('');

    const handleFileChange = (e) => {
        setNewFiles(Array.from(e.target.files));
        console.log(`newFiles: ${newFiles}`);
        console.log(currentFiles[0].url);
    };
    const handleFileDelete = (index) => {
        const deletedFile = currentFiles[index]; //сохранение удаленного файла
        // добавление удаленного файла в массив для удаления на сервере
        if (deletedFile.id) {
            setRemovedFileIds(prev => [...prev, deletedFile.id]);
            //console.log(`removedFiles: ${removedFileIds}`);
        }
        setCurrentFiles(currentFiles.filter((_, i) => i !== index));
    };

    const handleTagDelete = (index) => {
        const deletedTag = currentTags[index];
        if(deletedTag.id) {
            setRemovedTagIds(prev => [...prev, deletedTag.id]);
            console.log(`removedTags: ${removedTagIds}`);
        }
        setCurrentTags(currentTags.filter((_,i) => i != index));
    };

    const handleTagChange = () => {
        if (currentTag.trim()) {
            setCurrentTags([...currentTags, { tag_name: currentTag.trim() }]);
            setNewTags([...newTags,currentTag.trim()]);
            setCurrentTag('');
        }
    }

    const handleSave = () => {
        onSave({ ...note, title: editedTitle, note_text: editedText, files: currentFiles, newFiles: newFiles, removedFiles: removedFileIds, tags: currentTags, newTags: newTags, removedTags: removedTagIds});
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
                <div className="tags-section">
                    {currentTags.length>0 ? (
                        currentTags.map((tag,index) => (
                            <div key={index} className="tag-item">
                                <p className="tag-text">
                                    #{tag.tag_name}
                                </p>
                                <button onClick={() => handleTagDelete(index)}>Удалить</button>
                            </div>
                        ))
                    ): (
                        <p></p>
                    )}
                </div>
                <input type="text" placeholder="Введите тег (например: #покупки, #работа)" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} />
                <button type="button" onClick={handleTagChange} className="add-tag-button">
                    +
                </button>

                <div className="files-section">
                    <h3>Прикрепленные файлы</h3>
                    {currentFiles.length > 0 ? (
                        currentFiles.map((file, index) => (
                            <div key={index} className="file-item">
                                <a href={file.url} download>
                                    {file.name}
                                </a>
                                <button onClick={() => handleFileDelete(index)}>Удалить</button>
                            </div>
                        ))
                    ) : (
                        <p></p>
                    )}
                </div>
                <input type="file" multiple onChange={handleFileChange} placeholder="Выберите файл"/>
                

                <button onClick={handleSave}>Сохранить</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}

export default Modal;