import Game from "./game/game.js";

class Main {
    constructor() {
        this.Game = new Game();
    }
}

$(document).ready(() => {

    document.addEventListener('contextmenu', event => {
        event.preventDefault();
    });

    const main = new Main();


});