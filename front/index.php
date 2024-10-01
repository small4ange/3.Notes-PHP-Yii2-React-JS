<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notes</title>
</head>
<body>

<div id="edit-note-modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="site.closeModal()">&times;</span>
        <h2>Редактировать заметку</h2>
        <input type="text" id="edit-title" placeholder="Введите новый заголовок">
        <textarea id="edit-text" placeholder="Введите новый текст"></textarea>
        <button id="save-button">Сохранить</button>
    </div>
</div>
    <button
            id="api-test-btn"
            type="button"
            onclick="site.apiTest()"
        >api test</button>
    <form id="create-note" onsubmit="site.apiCreateNote(event)" method="post">
        <h1>Новая заметка</h1>
        <input type="text" id="title" placeholder="Введите заголовок">
        <input type="text" id="text" placeholder="Введите текст заметки">
        <button type="submit">Создать</button>
    </form>
    <!-- <form id="all-notes" method="get" action="" onload="site.api">

    </form> -->
    <h2>Список заметок</h2>
    <div id="notes-list" >

    </div>
    <script src="main.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            site.apiGetAllNotes();
        });
    </script>
</body>
</html>