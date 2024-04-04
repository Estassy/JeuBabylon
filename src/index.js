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


