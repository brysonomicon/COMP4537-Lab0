import { GameTile } from "./GameTile.js";
import { Position } from "./Position.js";
import { LayoutManager } from "./LayoutManager.js"

export class GameController {
    constructor(messages) {
        this.messages = messages;
        this.gameArea = document.querySelector(".game-play-area");        
        this.input    = document.getElementById("input");        
        this.status   = document.getElementById("status");

        this.inputLabel             = document.querySelector('label[for="input"]');
        this.inputLabel.textContent = this.messages.HOW_MANY_BUTTONS;

        this.goButton = document.getElementById("go-btn");
        this.goButton.addEventListener("click", () => this.prepareGameArea());

        this.tiles  = [];
        this.layout = new LayoutManager(this.gameArea);

        this.expectedOrder = 1;
        this.isPlaying     = false;
    }

    /**
     * 
     */
    async prepareGameArea()
    {
        const num = Number(this.input.value);
        const CONVERT_TO_SEC    = 1000;
        const PER_SHUFFLE_DELAY = 2000;

        if (!Number.isInteger(num) || num < 3 || num > 7)
        {
            this.setStatus(this.messages.ERROR_INVALID_INPUT);
            return;
        }

        this.goButton.disabled = true;
        this.gameArea.innerHTML = "";
        this.tiles = [];

        this.setStatus(this.messages.STATUS_CREATING(num));

        GameTile.resetColors();

        this.createTiles(num);
        this.layout.layoutSequential(this.tiles);

        await this.layout.sleep(num * CONVERT_TO_SEC);

        for (const tile of this.tiles)
        {
            tile.hideNumber();
        }

        this.setStatus(this.messages.STATUS_SHUFFLE);

        await this.layout.shuffle(this.tiles, num, PER_SHUFFLE_DELAY);

        this.startPlayPhase();
    }

    startPlayPhase()
    {
        this.expectedOrder = 1;
        this.isPlaying     = true;
        this.setStatus(this.messages.STATUS_READY);

        for (const tile of this.tiles)
        {
            tile.enable();
        }
    }

    createTiles(num)
    {
        for (let i = 1; i <= num; ++i)
        {
            const tile = new GameTile(i, new Position(0, 0));
            this.tiles.push(tile);
            this.gameArea.appendChild(tile.tile);

            tile.disable();

            const handler = () => {
                tile.showNumber();
                tile.disable();

                tile.tile.removeEventListener('click', handler);

                if (i === this.expectedOrder)
                {
                    this.expectedOrder++;

                    if (this.expectedOrder > this.tiles.length)
                    {
                        this.handleEndGame(true);
                    }
                }
                else // guessed incorrectly
                {
                    this.handleEndGame(false);
                }
            };

            tile.tile.addEventListener('click', handler);
        }
    }

    handleEndGame(outcome)
    {
        this.isPlaying = false;

        for (const tile of this.tiles)
        {
            tile.showNumber();
            tile.disable();
        }

        this.setStatus(outcome ? this.messages.STATUS_EXCELLENT : this.messages.STATUS_WRONG);
        this.goButton.disabled = false;
    }

    setStatus(text)
    {
        if (this.status)
        {
            this.status.textContent = text;
        }
    }
}
