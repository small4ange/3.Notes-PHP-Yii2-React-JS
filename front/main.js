
const site = {
    backBaseUrl: 'http://localhost/3_тестовое/back/web',

    apiTest: async () => {
        
        console.group('site.apiTest')
        
        let response = await fetch(site.backBaseUrl + '/api/test')
        //console.log('response = %o', response)
        
        let responseDataObject = await response.json()
        console.log(responseDataObject)
        
        console.groupEnd()
        
    },

    closeEditModal: () => {
        document.getElementById('editModal').style.display = 'none';
    },

    openEditModal: (id, currentTitle, currentText) => {
        document.getElementById('edit-note-id').value = id;
        document.getElementById('edit-title').value = currentTitle;
        document.getElementById('edit-text').value = currentText;

        document.getElementById('editModal').style.display = 'flex';
    },

    apiCreateNote: async(event) => {
        event.preventDefault();
        console.log("Внутри apiCreateNote");

        console.group('site.apiCreateNote')
        
        const title = document.getElementById('title').value;
        const text = document.getElementById('text').value;

        console.log(JSON.stringify({
            title: title,
            text: text,
        }));

        try {
            let response = await fetch(site.backBaseUrl + '/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'title': title,
                    'text': text,
                })
            });
            let responseDataObject = await response.json()
        console.log(responseDataObject)
        
        if (!responseDataObject.errors) {
            site.apiGetAllNotes();
        } else {
            alert('Ошибка при создании заметки', responseDataObject.errors);
        }
        } catch (error) {
            console.error("Ошибка при ввполнении запроса POST", error);
        }
        

        console.groupEnd()
    },

    apiGetAllNotes: async() => {
        console.group('site.apiGetAllNotes')
        
        let response = await fetch(site.backBaseUrl + '/api/index')
        //console.log('response = %o', response)
        
        let responseDataObject = await response.json()
        console.log(responseDataObject)
        
        if (responseDataObject.allNotes) {
            const notesContainer = document.getElementById('notes-list');
            notesContainer.innerHTML = '';
            responseDataObject.allNotes.forEach(note => {
                const noteHtml = site.noteInHtml(note);
                notesContainer.innerHTML += noteHtml;
            });
        }

        console.groupEnd()
    },

    apiUpdateNote: async(id) => {

        console.group('site.apiUpdateNote');
        
        let response = await fetch(site.backBaseUrl + '/api/get-note?id=' + id);

        let note = await response.json();

        document.getElementById('edit-title').value = note.note.title;
        document.getElementById('edit-text').value = note.note.text;


        document.getElementById('edit-note-modal').style.display = 'block';
        
        document.getElementById('save-button').onclick = () => site.saveNote(id);
        
        console.groupEnd();
    },



    saveNote: async (id) => {
        const note_title = document.getElementById('edit-title').value;
        const note_text = document.getElementById('edit-text').value;

        console.log(JSON.stringify({
            'title': note_title,
            'text': note_text,
        }));
    
        let response = await fetch(site.backBaseUrl + `/api/update?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'title': note_title,
                'text': note_text,
            }),
        });
    
        let responseDataObject = await response.json();
        console.log(responseDataObject);
    
        if (!responseDataObject.errors) {
            site.apiGetAllNotes();
        }

        site.closeModal();
    },

    closeModal() {
        document.getElementById('edit-note-modal').style.display = 'none';
    },

    apiDeleteNote: async(id) => {
        console.group('site.apiDeleteNote')
        
        let response = await fetch(site.backBaseUrl + '/api/delete?id=' + id, {
            method: 'DELETE',
        });
        //console.log('response = %o', response)
        
        let responseDataObject = await response.json()
        console.log(responseDataObject)
        
        if (!responseDataObject.errors) {
            site.apiGetAllNotes();
        }

        console.groupEnd()
    },

    noteInHtml: (note)=> {
        return `
        <div class="note">
            <div class="title">
                <p><b>${note.title}</b></p>
            </div>
            <div class="text">
                <p>${note.note_text}</p>
            </div>
            <div class="date">
                <p>${note.date}</p>
            </div>
            <button onclick="site.apiUpdateNote(${note.id})">Изменить</button>
            <button onclick="site.apiDeleteNote(${note.id})">Удалить</button>
        </div>
        `;
    }
}