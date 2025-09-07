import { Position } from "./Position.js"

export class LayoutManager {
    /**
     * @param {HTMLElement} gameArea - container where game elements exist
     * @param {number} gap - desired gap between tiles/window bounds
     */
    constructor(gameArea, gap = 7)
    {
        this.gameArea = gameArea;
        this.gap      = gap;
    }

    /**
     * @param {number} ms how long to sleep in milliseconds
     * @returns promise that resolves after ms milliseconds
     */
    sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Layout game tiles in order, wrapping to new rows if browser too thin.
     * @param {GameTile[]} tiles 
     */
    layoutSequential(tiles)
    {
        const bounds = this.gameArea.getBoundingClientRect();
        let x        = this.gap;
        let y        = this.gap;

        for (const tile of tiles)
        {
            const size = tile.getDimensions();
            if (x + size.width > bounds.width - this.gap)
            {
                x = this.gap;
                y += size.height + this.gap;
            }

            tile.setLocation(new Position(x, y));
            x += size.width + this.gap;
        }
    }

    /**
     * Layout tiles randomly across the browser window, ensuring no overlap.
     * @param {GameTile[]} tiles 
     */
    layoutRandom(tiles)
    {
        const containerSize = this.gameArea.getBoundingClientRect();
        const placedTiles   = [];
        const shuffled      = tiles.slice();

        for (let i = shuffled.length - 1; i > 0; --i)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        for (const tile of shuffled)
        {
            const tileSize = tile.getDimensions();
            const maxX     = Math.max(0, Math.floor(containerSize.width - tileSize.width - this.gap));
            const maxY     = Math.max(0, Math.floor(containerSize.height - tileSize.height - this.gap));

            while (true)
            {
                const x = this.gap + Math.floor(Math.random() * (maxX + 1));
                const y = this.gap + Math.floor(Math.random() * (maxY + 1));

                tile.setLocation(new Position(x, y));
                const current = tile.getDimensions();

                const newPosition = { 
                    x: Math.floor(current.left - containerSize.left), 
                    y: Math.floor(current.top - containerSize.top), 
                    width: current.width, 
                    height: current.height 
                };

                let collision = false;

                for (const placed of placedTiles)
                {
                    if (this.isOverlapped(newPosition, placed))
                    {
                        collision = true;

                        break;
                    }
                }

                if (!collision)
                {
                    placedTiles.push(newPosition);
                    tile.setLocation(new Position(newPosition.x, newPosition.y));
                    
                    break;
                }
            }
        }
    }

    /**
     * Checks if two rectangles are overlapping.
     * @param {GameTile} rectA 
     * @param {GameTile} rectB 
     * @returns boolean
     */
    isOverlapped(rectA, rectB)
    {
        const margin = this.gap;
        return !(
            rectA.x + rectA.width + margin <= rectB.x ||
            rectA.x >= rectB.x + rectB.width + margin ||
            rectA.y + rectA.height + margin <= rectB.y ||
            rectA.y >= rectB.y + rectB.height + margin
        );
    }

    /**
     * Moves the game tile to a random location within bounds.
     * @param {GameTile} tile 
     * @returns a Position object of the new random position
     */
    randomLocation(tile)
    {
        const bounds = this.gameArea.getBoundingClientRect();
        const size   = tile.getDimensions();
        const maxX   = Math.max(0, Math.floor(bounds.width - size.width));
        const maxY   = Math.max(0, Math.floor(bounds.height - size.height));
        const x      = Math.floor(Math.random() * (maxX + 1));
        const y      = Math.floor(Math.random() * (maxY + 1));

        return new Position(x, y);
    }

    /**
     * Shuffles the tiles a certain number of times with a delay between each shuffle.
     * @param {GameTile[]} tiles 
     * @param {number} numTimes 
     * @param {number} delayMs 
     */
    async shuffle(tiles, numTimes, delayMs)
    {
        for (let i = 0; i < numTimes; ++i)
        {
            if (i === numTimes - 1) 
            {
                this.layoutRandom(tiles);
            }
            else 
            {
                for (const tile of tiles)
                {
                    const newPosition = this.randomLocation(tile);
                    tile.setLocation(newPosition);
                }
            }

            await this.sleep(delayMs);
        }
    }
}