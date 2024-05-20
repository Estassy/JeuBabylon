
import { Engine } from "@babylonjs/core";
import Game from "./run/game";
import Soccer from "./soccer/game";



let engine;
let canvas;
let game;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    if (!canvas) {
        console.error("Canvas element not found.");
        return;
    }

    engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    window.addEventListener("resize", () => {
        engine.resize();
    });

    setupGameSelectors();
    setupPauseManagement();
};

function setupGameSelectors() {
    document.getElementById("playGame").addEventListener("click", () => {
        document.getElementById("gameSelectionModal").style.display = "block";
    });

    document.getElementById("chooseRunning").addEventListener("click", () => initializeGame("running"));
    document.getElementById("chooseSoccer").addEventListener("click", () => initializeGame("soccer"));
}

function setupPauseManagement() {
    document.getElementById("resumeGame").addEventListener("click", () => {
        if (game && typeof game.resume === 'function') {
            game.resume();
            document.getElementById("pauseMenu").style.display = "none";
        }
    });

    window.addEventListener("keydown", handleEscape);
}

function handleEscape(event) {
    if (event.key === "Escape") {
        const pauseMenu = document.getElementById("pauseMenu");
        if (pauseMenu.style.display === "none" && game && typeof game.pause === 'function') {
            game.pause();
            pauseMenu.style.display = "block";
        } else {
            if (game && typeof game.resume === 'function') {
                game.resume();
                pauseMenu.style.display = "none";
            }
        }
    }
}


function initializeGame(gameType) {
    if (game && typeof game.dispose === 'function') {
        game.dispose();
    }

    switch (gameType) {
        case "running":
            game = new Game(engine, canvas);
            break;
        case "soccer":
            game = new Soccer(canvas, engine);
            break;
        default:
            console.error("Unrecognized game type:", gameType);
            return;
    }
    startGame();
}

function startGame() {
    if (game && typeof game.init === 'function') {
        game.init();
    }
    console.log("Game started, controls enabled.");
    document.querySelector('.menu').style.display = 'none';
    document.getElementById("gameSelectionModal").style.display = "none";
    canvas.style.display = 'block';
    if (game && typeof game.start === 'function') {
        game.start();
    }
}
