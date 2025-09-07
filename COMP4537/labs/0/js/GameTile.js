/**
 * GameTile is the basic component of the memory game.
 */
export class GameTile {
    static COLORS = {
        "#7FFF00": true,
        "#FF6FFF": true,
        "#FFD700": true,
        "#40E0D0": true,
        "#9932CC": true,
        "#CD853F": true,
        "#FF0461": true
    };

    /**
     * Resets availability of colors to true.
     */
    static resetColors()
    {
        for (const color in GameTile.COLORS)
        {
            GameTile.COLORS[color] = true;
        }
    }

    /**
     * Filters out the false colors and returns a random available color.
     */
    static getRandomColor()
    {
        const available = Object.keys(GameTile.COLORS)
                                .filter(color => GameTile.COLORS[color]);
        
        const randomColor      = Math.floor(Math.random() * available.length);
        const color            = available[randomColor];
        GameTile.COLORS[color] = false;

        return color;
    }

    /**
     * @param {number} order - the tile's order number
     * @param {Position} position - starting position
     */
    constructor(order, position)
    {
        this.order = order;

        const tile = document.createElement("button");
        tile.textContent        = String(order);
        tile.style.width        = "10em";
        tile.style.height       = "5em";
        tile.style.position     = "absolute";
        tile.style.background   = GameTile.getRandomColor();
        tile.style.border       = "none";
        tile.style.borderRadius = "5px";
        tile.style.fontSize     = "1rem";
        tile.classList.add('game-tile');

        this.tile     = tile;
        this.position = position;
    }

    /**
     * Sets the location of the element within the parent container
     * @param {Position} position - a position object
     */
    setLocation(position)
    {
        this.tile.style.left = `${position.x}px`;
        this.tile.style.top  = `${position.y}px`;
        this.position = position;
    }

    /**
     * @returns rectangle of the game tile
     */
    getDimensions()
    {
        return this.tile.getBoundingClientRect();
    }

    /**
     * Hides the order number.
     */
    hideNumber()
    {
        this.tile.textContent = "";
    }

    /**
     * Shows the order number.
     */
    showNumber()
    {
        this.tile.textContent = String(this.order);
    }

    /**
     * Enables the tile.
     * @returns the tile to enable chaining
     */
    enable()
    {
        this.tile.disabled = false;
        return this;
    }

    /**
     * Disables the tile.
     * @returns the tile to enable chaining
     */
    disable()
    {
        this.tile.disabled = true;
        return this;
    }
}