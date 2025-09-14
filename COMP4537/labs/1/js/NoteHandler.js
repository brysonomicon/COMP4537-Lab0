import { Messages } from "../lang/messages/en/user.js"
export class Note {
    constructor(text = "", timestamp = Date.now())
    {
        this.text      = text;
        this.timestamp = Number(timestamp);
    }

    /**
     * Retrieves a note from local storage by the passed key.
     * @param {string} key - date as a string
     * @returns - localStorage contents as a Note object
     */
    static fromStorage(key)
    {
        const note = localStorage.getItem(key);
        if (note === null)
        {
            return null;
        }

        return new Note(note, Number(key));
    }

    /**
     * Updates the timestamp based on the relative order of the numeric dates.
     */
    static timestamp()
    {
        const span = document.querySelector(".timestamp");
        const keys = Object.keys(localStorage);
        const latest = keys.sort((a, b) => Number(a) - Number(b))[keys.length - 1];

        span.textContent = latest 
            ? `${Messages.LATEST_NOTE} ${new Date(Number(latest)).toLocaleString()}`
            : "";
    }
}

export class NoteWriter {
    constructor(container, addButton)
    {
        this.container = container;
        this.addButton = addButton;
        this.current   = new Note(); 
        
        this.addButton.addEventListener("click", () => this.add());
        window.addEventListener("storage", () => this.display());

        this.display();
    }

    /**
     * Adds the current note to localStorage
     */
    add()
    { 
        const text = this.current.text.trim();
        if (!text)
        {
            return;
        }

        const key = Date.now().toString();
        localStorage.setItem(key, text);

        this.current = new Note();
        this.display();
    }

    /**
     * Removes the localStorage entry for hte passed key.
     * @param {string} key 
     */
    remove(key)
    {
        localStorage.removeItem(key);
        this.display();
    }

    /**
     * For each entry in localStorage, build a Note from the data and handles
     * the creation of the DOM elements to manage them.
     */
    display()
    {
        Note.timestamp();
        this.container.innerHTML = "";

        const keys = Object.keys(localStorage).sort((a, b) => Number(a) - Number(b));

        for (const key of keys)
        {
            const note = Note.fromStorage(key);
            if (!note)
            {
                continue;
            }

            const div = document.createElement("div");

            const textArea = document.createElement("textarea");
            textArea.className = "note";
            textArea.value = note.text;
            textArea.readOnly = false;
            textArea.addEventListener("input", () => { note.text = textArea.value; });
            textArea.addEventListener("blur", () => { localStorage.setItem(key, note.text); });

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = Messages.BTN_REMOVE;
            removeBtn.addEventListener("click", () => this.remove(key));

            div.appendChild(textArea);
            div.appendChild(removeBtn);
            this.container.appendChild(div);
        }

        const emptyDiv = document.createElement("div");

        const emptyNote = document.createElement("textarea");
        emptyNote.className = "note";
        emptyNote.placeholder = Messages.PLACEHOLDER;
        emptyNote.value = this.current.text;
        emptyNote.addEventListener("input", () => { this.current.text = emptyNote.value; });

        emptyDiv.appendChild(emptyNote);
        this.container.appendChild(emptyDiv);
    }
}

export class NoteReader {
    constructor(container)
    {
        this.container = container;
        window.addEventListener("storage", () => this.display());
        this.display();
    }

    /**
     * For each entry in localStorage, build a Note from the contents and handles
     * the DOM elements to manage them.
     */
    display()
    {
        Note.timestamp();
        this.container.innerHTML = "";

        const keys = Object.keys(localStorage).sort((a, b) => Number(a) - Number(b));

        for (const key of keys)
        {
            const note = Note.fromStorage(key);
            if (!note)
            {
                continue;
            }

            const div = document.createElement("div");

            const textArea     = document.createElement("textarea");
            textArea.className = "note";
            textArea.readOnly  = true;
            textArea.value     = note.text;

            div.appendChild(textArea);
            this.container.appendChild(div);
        }
    }
}

