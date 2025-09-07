import { GameController } from "./GameController.js"
import { Messages } from "../lang/messages/en/user.js"


async function init() 
{
    if (document.readyState === 'loading')
    {
        await new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, { once: true }));
    }

    new GameController(Messages);
}

init();
