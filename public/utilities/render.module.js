window.RENDER_MODULE = {
  renderNotesList,
  renderNoteDetails,
  renderEditableNote
};

function renderNotesList(notes) {
  const notesHtml = notes.map(noteToHtml).join("<hr/>");
  $("#note-list").html(notesHtml);

  function noteToHtml(note) {
    let noteSummary = note.content;
    if (noteSummary.length > 120) {
      noteSummary = `${note.content.substring(0, 120)}...`;
    }
    return `
        <div class="card text-center" id="note-card" data-note-id="${note.id}">
            <h3 class="card-header">${note.title}<br>
            <button id="edit-note-btn" class="btn btn-warning">Edit</button>
            <button id="delete-note-btn" class="btn btn-danger">Delete</button></h3>
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
        <br/>

        <button class="btn btn-primary" id="edit-note-btn">Edit Note</button>
		<h1>${note.title}</h1>
		<i>${note.user.name} | ${new Date(note.updateDate).toLocaleString()}</i>
		<p>${note.content}</p>
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
