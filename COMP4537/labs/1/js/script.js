
import { NoteWriter, NoteReader, Note } from "./NoteHandler.js";

function init()
{
    console.log('alive');
    const writerArea = document.getElementById("writer-area");
    const readerArea = document.getElementById("reader-area");

    if (writerArea)
    {
        console.log('writin notes');
        const addButton  = document.getElementById("btn-add");
        new NoteWriter(writerArea, addButton);
    }
    else if (readerArea)
    {
        console.log('readin notes');
        new NoteReader(readerArea);
    }
    else 
    {
        Note.timestamp();
        window.addEventListener("storage", () => Note.timestamp());
    }
}

if (document.readyState === 'loading')
{
    await new Promise(resolve => document.addEventListener("DOMContentLoaded", init));
}
else 
{
    init();
}