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
        for (const color in GameTile.Colors)
        {
            GameTile.COLORS[color] = true;
        }
    }

    /**
     * Filters out the falsy colors and returns a random available color.
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

        const element = document.createElement("button");
        element.textContent        = String(order);
        element.style.width        = "10em";
        element.style.height       = "5em";
        element.style.position     = "absolute";
        element.style.background   = GameTile.getRandomColor();
        element.style.border       = "none";
        element.style.borderRadius = "5px";
        element.style.fontSize     = "2rem";

        this.element  = element;
        this.position = position;
    }

    /**
     * Sets the location of the element within the parent container
     * @param {Position} position - a position object
     */
    setLocation(position)
    {
        this.element.style.left = `${position.x}px`;
        this.element.style.top  = `${position.y}px`;
        this.position = position;
    }

    /**
     * Get the dimensions of the game tile.
     * @returns rectangle object of the button elements dimensions
     */
    getDimensions()
    {
        return this.element.getBoundingClientRect();
    }
}