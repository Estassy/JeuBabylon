
import { Engine } from "@babylonjs/core";
import Game from "./game";
import JEU from "./sports/jeu";

import JavelinScene from "./sports/JavelinScene";

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
    if (game && game.dispose) { // Assurez-vous de nettoyer la scène précédente si nécessaire
        game.dispose();
    }

    switch (gameType) {
        case "running":
            game = new Game(engine, canvas); // La classe Game pour la course
            break;
        case "jeu":
            game = new JEU(engine, canvas); // La classe JEU pour un autre type de jeu
            break;
        case "javelou":
            game = new JavelinScene(canvas, engine); // Utilisez JavelinScene pour la gestion du lancer de javelot
            break;
        // Ajoutez d'autres jeux si nécessaire
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
