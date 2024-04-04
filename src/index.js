import { Engine } from "@babylonjs/core";
import Game from "./game";

let engine;
let canvas;
let game;

window.onload = () => {
    canvas = document.getElementById("renderCanvas");
    engine = new Engine(canvas, true);
    window.addEventListener("resize", function() {
        engine.resize();
    });

    game = new Game(engine, canvas);

    document.getElementById("playGame").addEventListener("click", function() {
        game.init();
        document.querySelector('.menu').style.display = 'none';
        canvas.style.display = 'block';
        game.start();
    });

    
    // Ajoutez des gestionnaires pour les autres options de jeu et la logique pour "Entraînement" si nécessaire
};

/*
  
    document.getElementById("gameOption1").addEventListener("click", function() {
        // Initialisez et démarrez le jeu correspondant à l'option 1
        // game.init(paramètres spécifiques au jeu ou au niveau );
        document.getElementById('gameSelectionMenu').style.display = 'none'; // Cachez le menu de sélection
        canvas.style.display = 'block'; // Affichez le canvas
        game.start();
    });



*/
