
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



// import { Engine } from "@babylonjs/core";
// import Game from "./run/game";

// import Soccer from "./soccer/game";

// let engine;
// let canvas;
// let game;

// window.onload = () => {
//     canvas = document.getElementById("renderCanvas");
//     engine = new Engine(canvas, true);
//     window.addEventListener("resize", function () {
//         engine.resize();
//     });

//     document.getElementById("playGame").addEventListener("click", function () {
//         // Afficher la modal de sélection de jeu
//         document.getElementById("gameSelectionModal").style.display = "block";
//     });

//     document.getElementById("chooseRunning").addEventListener("click", function () {
//         initializeGame("running");
//     });

//     document.getElementById("chooseSoccer").addEventListener("click", function () {
//         initializeGame("soccer");
//     });

//     // Ajouter des gestionnaires pour les autres jeux ici
//     document.getElementById("resumeGame").addEventListener("click", function() {
//         game.resume();
//         document.getElementById("pauseMenu").style.display = "none";
        
//     });
    
//     // document.getElementById("backToMenu").addEventListener("click", function() {
//     //     if (game && game.dispose) {
//     //         window.removeEventListener("keydown", handleEscape);
//     //         game.dispose();
//     //     }
//     //     document.querySelector('.menu').style.display = 'block';
//     //     document.getElementById("pauseMenu").style.display = "none";
//     //     canvas.style.display = 'none';
//     // });   
    
    
// };


// function handleEscape(event) {
//     if (event.key === "Escape") {
//         const pauseMenu = document.getElementById("pauseMenu");
//         if (pauseMenu.style.display === "none") {
//             game.pause();  // Pause le jeu
//             pauseMenu.style.display = "block";  // Affiche le menu de pause
//         } else {
//             game.resume();  // Reprend le jeu
//             pauseMenu.style.display = "none";  // Cache le menu de pause
//         }
//     }
// }

// function initializeGame(gameType) {
//     if (game && game.dispose) { // Assure-toi de nettoyer la scène précédente si nécessaire
//         window.removeEventListener("keydown", handleEscape); // Retire le gestionnaire précédent si nécessaire
//         game.dispose();
//     }

//     switch (gameType) {
//         case "running":
//             game = new Game(engine, canvas); // La classe Game pour la course
//             window.addEventListener("keydown", handleEscape)
//             break;
//         case "soccer":
//             game = new Soccer(canvas, engine); // Utilisez Soccer pour la gestion du soccer
//             break;
//         default:
//             console.error("Type de jeu non reconnu:", gameType);
//             return;  // Sortie précoce en cas de type non reconnu
//     }
//     startGame();
// }



// function startGame() {
//     if (game && typeof game.init === 'function') {
//         game.init();  // Initialise le jeu si la méthode init est définie
//     }
//     console.log("Début du jeu, activation des contrôles.");
//     document.querySelector('.menu').style.display = 'none';
//     document.getElementById("gameSelectionModal").style.display = "none";
//     canvas.style.display = 'block';
//     game.start();  // Démarre le jeu
// }

