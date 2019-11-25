window.RENDER_MODULE = {
  renderNotesList,
  renderNoteDetails,
  renderEditableNote
};

function renderNotesList(notes) {
  const notesHtml = notes.map(noteToHtml).join();
  $("#note-list").html(notesHtml);

  function noteToHtml(note) {
    let noteSummary = note.content;
    if (noteSummary.length > 120) {
      noteSummary = `${note.content.substring(0, 120)}...`;
    }
    return `
        <div class="card border-info mb-3 content-align-center text-center" style="max-width: 30rem;" id="note-card" data-note-id="${
          note.id
        }">
            <h3 class="card-header">${note.title}<br>
            <button id="edit-note-btn" class="btn btn-outline-warning">Edit</button>
            <button id="-note-btn" class="btn btn-outline-danger">Delete</button></h3>
            <p class="card-body card-content">${noteSummary}</p>
            <div class="card-footer text-muted card-info">
                <i>${note.user.name} | Last updated on ${new Date(
      note.updateDate
    ).toLocaleDateString()}</i>
            </div>
        </div>
        `;
  }
}

function renderNoteDetails(note) {
  $("#note-details").html(`
  <div class="card text-center">
  <div class="card-body">
    <h5 class="card-title">${note.title}</h5>
    <p class="card-text">${note.content}</p>
    <button class="btn btn-outline-primary" id="edit-note-btn">Edit Note</button>
  </div>
  <div class="card-footer text-muted">
  <i>${note.user.name} | ${new Date(note.updateDate).toLocaleString()}</i>
  </div>
</div>  
	`);
}

function renderEditableNote(note) {
  $("#title-txt")
    .prop("disabled", false)
    .val(note.title);
  $("#content-txt")
    .prop("disabled", false)
    .val(note.content);
}
