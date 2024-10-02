
const site = {
    backBaseUrl: 'http://localhost/3_тестовое/back/web',

    apiTest: async () => {
        
        console.group('site.apiTest')
        
        let response = await fetch(site.backBaseUrl + '/api/test')
        
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

        console.group('site.apiCreateNote')
        
        const userId = localStorage.getItem('user_id');
        console.log(userId);

        if (userId == null) {
            alert('Пользователь не авторизован');
            return;
        }

        const title = document.getElementById('title').value;
        const text = document.getElementById('text').value;

        try {
            let response = await fetch(site.backBaseUrl + '/api/create?userId=' + userId, {
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
        if(localStorage.getItem('user_id') != null){
            document.getElementById("logout-button").style = "display: block;"

            console.group('site.apiGetAllNotes')

            console.log(localStorage.getItem('user_id'));
            let response = await fetch(site.backBaseUrl + '/api/index?user_id=' + localStorage.getItem('user_id'))
            
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
        } else {
            document.getElementById('notes-list').innerHTML='';
        }
        
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
    },

    apiRegisterUser: async(event) => {
        event.preventDefault();

        console.group('site.apiRegisterUser');

        const email = document.getElementById("user-register-email").value;
        const password = document.getElementById("user-register-password").value;

        console.log(email, password);

        let response = await fetch(site.backBaseUrl + '/api/register', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password,
                })
        })
        let responseDataObject = await response.json()
            console.log(responseDataObject)
            
        if (responseDataObject.errors){
            alert('Ошибка при регистрации пользователя', responseDataObject.errors);
        }
    },

    apiLoginUser: async(event) => {
        event.preventDefault();

        console.group('site.apiLoginUser');

        const email = document.getElementById("user-login-email").value;
        const password = document.getElementById("user-login-password").value;

        console.log(email, password);

        let response = await fetch(site.backBaseUrl + '/api/login', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password,
                })
        })
        let responseDataObject = await response.json()
            console.log(responseDataObject)
            
            if ((!responseDataObject.errors) && (responseDataObject.status == 'success')) {
                localStorage.setItem('user_id', responseDataObject.id);
                
                site.apiGetAllNotes();
            } else {
                alert('Ошибка при аутентификации пользователя', responseDataObject.errors);
            }
    },

    logout: () => {
        localStorage.removeItem('user_id');
        document.getElementById('logout-button').style = "display:none;";
        site.apiGetAllNotes();
    }
}