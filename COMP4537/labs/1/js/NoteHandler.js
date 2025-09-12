export class Note {
    constructor(text = "", readOnly = false)
    {
        this.text     = text;
        this.readOnly = readOnly;
        this.textArea = this.buildTextArea();
    }

    buildTextArea()
    {
        const ta       = document.createElement("textarea");
        ta.className   = "note";
        ta.value       = this.text;
        ta.readOnly    = this.readOnly;
        // TODO: put this in lang
        ta.placeholder = this.readOnly
            ? ""
            : "Write a note...";

        if (!this.readOnly)
        {
            ta.addEventListener("input", () => {
                this.text = ta.value;
            });
        }

        return ta;
    }
}

export class NoteWriter {
    constructor(container, addButton)
    {
        this.container = container;
        this.addButton = addButton;
        this.current   = new Note(); 
        
        this.addButton.addEventListener("click", () => this.add());
        this.display();
    }

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

    remove(key)
    {
        localStorage.removeItem(key);
        this.display();
    }

    display()
    {
        this.container.innerHTML = "";

        for (const key of Object.keys(localStorage))
        {
            const text = localStorage.getItem(key);
            if (!text)
            {
                continue;
            }

            const div = document.createElement("div");
            const note = new Note(text, true);
            const removeBtn = document.createElement("button");

            //TODO => add to lang file
            removeBtn.textContent = "Remove";
            removeBtn.addEventListener("click", () => this.remove(key));
            
            div.appendChild(note.textArea);
            div.appendChild(removeBtn);
            this.container.appendChild(div);
        }

        const currentRow = document.createElement("div");
        currentRow.appendChild(this.current.textArea);
        this.container.appendChild(currentRow);
    }
}

export class NoteReader {
    constructor(container)
    {
        this.container = container;
        this.display();
    }

    display()
    {
        this.container.innerHTML = "";

        for (let i = 0; i < localStorage.length; ++i)
        {
            const key  = localStorage.key(i);
            const text = localStorage.getItem(key);

            if (text) 
            {
                const div = document.createElement("div");
                const note = new Note(text, true);
                div.appendChild(note.textArea);
                this.container.appendChild(div);
            }
        }
    }
}

