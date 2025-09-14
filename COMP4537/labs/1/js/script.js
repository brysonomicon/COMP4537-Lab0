
import { NoteWriter, NoteReader, Note } from "./NoteHandler.js";
import { Messages } from "../lang/messages/en/user.js";

function init()
{
    const writerArea = document.getElementById("writer-area");
    const readerArea = document.getElementById("reader-area");

    if (writerArea)
    {
        const addButton  = document.getElementById("btn-add");
        new NoteWriter(writerArea, addButton);
    }
    else if (readerArea)
    {
        new NoteReader(readerArea);
    }
    else 
    {
        Note.timestamp();
        window.addEventListener("storage", () => Note.timestamp());
    }

    const labTitle = document.querySelector(".title");
    const readerPage = document.getElementById("reader-page");
    const writerPage = document.getElementById("writer-page"); 
    const backBtn    = document.querySelector(".btn-back");
    const addBtn     = document.getElementById("btn-add");

    if (labTitle) labTitle.textContent     = Messages.LAB_TITLE;
    if (readerPage) readerPage.textContent = Messages.READER_PAGE;
    if (writerPage) writerPage.textContent = Messages.WRITER_PAGE;
    if (backBtn) backBtn.textContent       = Messages.BTN_BACK;
    if (addBtn) addBtn.textContent         = Messages.BTN_ADD;
}

if (document.readyState === 'loading')
{
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", init));
}
else 
{
    init();
}