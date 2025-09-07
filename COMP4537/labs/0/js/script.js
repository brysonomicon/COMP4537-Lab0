import { GameController } from "./GameController.js"
import { Messages } from "../lang/messages/en/user.js"

/**
 * Promises to wait for the DOM content to load before initializing the game.
 */
async function init() 
{
    if (document.readyState === 'loading')
    {
        await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
    }

    new GameController(Messages);
}

init();
