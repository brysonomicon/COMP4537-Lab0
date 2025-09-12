
import { NoteWriter, NoteReader } from "./NoteHandler.js";

function init()
{
    console.log('alive');
    const writerArea = document.getElementById("writer-area");
    const readerArea = document.getElementById("reader-area");
    const addButton  = document.getElementById("btn-add");

    if (writerArea)
    {
        console.log('Creating NoteWriter...');
        new NoteWriter(writerArea, addButton);
    }
    
    if (readerArea)
    {
        console.log('Creating NoteReader...');
        new NoteReader(readerArea);
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