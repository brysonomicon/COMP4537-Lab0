import { GameTile } from "./GameTile.js";
import { Position } from "./Position.js";

export class GameController {
    constructor(messages) {
        this.messages  = messages;
        this.container = document.querySelector(".game-play-area");
        this.label     = document.querySelector('label[for="input"]');
        this.input     = document.getElementById("input");
        this.goBtn     = document.getElementById("go-btn");
        this.status    = document.getElementById("status");

        this.label.textContent = this.messages.LABEL_HOW_MANY;
        this.goBtn.addEventListener("click", () => this.startNewGame());

        this.tiles = [];
    }

    startNewGame()
    {
        const num = Number(this.input.value);

        if (!Number.isInteger(num) || num < 3 || num > 7)
        {
            this.setStatus(this.messages.ERROR_INVALID_INPUT);
            return;
        }

        this.container.innerHTML = "";
        this.tiles = [];

        this.setStatus(this.messages.STATUS_CREATING(num));

        GameTile.resetColors();

        this.createTiles(num);
        this.preShuffleLayout();
    }

    createTiles(num)
    {
        for (let i = 1; i <= num; ++i)
        {
            const tile = new GameTile(i, new Position(0, 0));
            this.tiles.push(tile);
            this.container.appendChild(tile.element);
        }
    }

    preShuffleLayout()
    {
        const bounds = this.container.getBoundingClientRect();
        const gap    = 7;
        let x        = gap;
        let y        = gap;

        for (const tile of this.tiles)
        {
            const rectangle = tile.getDimensions();
            
            if (x + rectangle.width > bounds.width - gap)
            {
                x = gap;
                y += rectangle.height + gap;
            }

            tile.setLocation(new Position(x, y));
            x += rectangle.width + gap;
        }
    }

    setStatus(text)
    {
        if (this.status)
        {
            this.status.textContent = text;
        }
    }
}
