export default function NoteInHtml({id, title, note_text, date}) {
    return (
      <div class="note">
              <div class="title">
                  <p><b>{title}</b></p>
              </div>
              <div class="text">
                  <p>{note_text}</p>
              </div>
              <div class="date">
                  <p>{date}</p>
              </div>
              <button onclick="site.apiUpdateNote(${id})">Изменить</button>
              <button onclick="site.apiDeleteNote(${id})">Удалить</button>
      </div>
    );
  }