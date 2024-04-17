
import { Engine } from "@babylonjs/core";
import Game from "./game";
import JEU from "./sports/jeu";
import JavelinThrow from "./sports/javelinThrow";

let engine;
let canvas;
let game;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    window.addEventListener("resize", function () {
        engine.resize();
    });

    document.getElementById("playGame").addEventListener("click", function () {
        // Afficher la modal de sélection de jeu
        document.getElementById("gameSelectionModal").style.display = "block";
    });

    document.getElementById("chooseRunning").addEventListener("click", function () {
        initializeGame("running");
    });

    document.getElementById("chooseJeu").addEventListener("click", function () {
        initializeGame("jeu");
    });

    document.getElementById("chooseJavelo").addEventListener("click", function () {
        initializeGame("javelou");
    });

    // Ajouter des gestionnaires pour les autres jeux ici
};

function initializeGame(gameType) {
    switch (gameType) {
        case "running":
            game = new Game(engine, canvas); // La classe Game actuelle est pour la course
            break;
        case "jeu":
            game = new JEU(engine, canvas);
            break;
        case "javelou":
            game = new JavelinThrow(engine, canvas);
            break;
        // Cas pour les autres jeux
        // case "swimming":
        //     game = new SwimmingGame(engine, canvas);
        //     break;
        // case "jumping":
        //     game = new JumpingGame(engine, canvas);
        //     break;
    }
    startGame();
}

function startGame() {
    game.init();
    document.querySelector('.menu').style.display = 'none';
    document.getElementById("gameSelectionModal").style.display = "none";
    canvas.style.display = 'block';
    game.start();
}
