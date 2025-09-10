function saveNote()
{
    const text = document.getElementById("note").value;
    localStorage.setItem("myNote", text);
}

function getNote()
{
    const container = document.getElementById("reader-area");
    const note = localStorage.getItem("myNote");
    container.textContent = note    
        ? note
        : "There ain't no note";
}

window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("note")) {
        document.getElementById("btn-add").addEventListener("click", saveNote);
    }

    if (document.getElementById("reader-area")) {
        getNote();
    }
});