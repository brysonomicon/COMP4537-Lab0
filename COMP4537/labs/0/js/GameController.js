import { GameTile } from "./GameTile.js";
import { Position } from "./Position.js";
import { LayoutManager } from "./LayoutManager.js"

/**
 * GameController controls the phases of game logic and calls on 
 * GameTile to create tiles and LayoutManager to handle movement logic.
 */
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
     * Sets up the game area for play. 
     * 
     * Clears the old state. Creates the buttons with visible numbers.
     * Hides the numbers and shuffles according to the assignment specs.
     * Passes off to the play phase function.
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

    /**
     * Enables the game area for play.
     * 
     * Resets the expected order. Enables isPlaying flag. Updates status.
     * Enables all tiles.
     */
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

    /**
     * Creates the required number of tiles and assigns the game logic
     * event listener.
     * @param {number} num the number of tiles to create
     */
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

    /**
     * Sets the isPlaying flag to false, shows and disables all tiles, adjusts the 
     * status messages to display the win/loss message and prompt to play again.
     * @param {*} outcome 
     */
    async handleEndGame(outcome)
    {
        this.isPlaying = false;

        for (const tile of this.tiles)
        {
            tile.showNumber();
            tile.disable();
        }

        this.setStatus(outcome 
            ? this.messages.STATUS_EXCELLENT 
            : this.messages.STATUS_WRONG);
        this.goButton.disabled = false;

        await this.layout.sleep(2000);

        this.setStatus(this.messages.STATUS_PLAY_AGAIN);
    }

    /**
     * Sets the text of the status span
     * @param {string} text 
     */
    setStatus(text)
    {
        if (this.status)
        {
            this.status.textContent = text;
        }
    }
}
