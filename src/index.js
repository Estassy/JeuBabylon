
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
    setupReturnToMainMenu(); 
    setupPauseManagement();
};

function setupGameSelectors() {
    document.getElementById("playGame").addEventListener("click", () => {
        document.getElementById("gameSelectionModal").style.display = "block";
    });

    document.getElementById("chooseRunning").addEventListener("click", () => initializeGame("running"));
    document.getElementById("chooseSoccer").addEventListener("click", () => initializeGame("soccer"));
}


function setupReturnToMainMenu() {
    document.getElementById("backToMenu").addEventListener("click", returnToMainMenu);
}

// Fonction pour retourner au menu principal
function returnToMainMenu() {
    // if (game && typeof game.endGame === 'function') {
    //     game.endGame();
    // }
    // Rediriger vers le menu principal ou la page d'accueil
    
    window.location.href = "./index.html"; // Modifie cette ligne selon l'URL de ton menu principal

}

// Fonction pour mettre le jeu en pause
function pauseGame() {
    if (game && typeof game.pause === 'function') {
        game.pause();
        document.getElementById("pauseMenu").style.display = "block";
    }
}

// Gestionnaire d'événements pour la gestion de la pause
function setupPauseManagement() {
    document.getElementById("resumeGame").addEventListener("click", resumeGameClicked);
    window.addEventListener("keydown", handleEscape);
}

// Gestion de la touche "Échap"
function handleEscape(event) {
    if (event.key === "Escape") {
        pauseGame();
    }
}


// Fonction appelée lorsque le bouton "Reprendre" est cliqué
function resumeGameClicked() {
    if (game && typeof game.resume === 'function') {
        game.resume();
        document.getElementById("pauseMenu").style.display = "none";
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
