/*
import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

window.onload = () => {
    console.log('Hello World!');

    const canvas = document.getElementById("renderCanvas");
    let engine = new Engine(canvas, true);

    const createScene = function () {
        const scene = new Scene(engine);
        const camera = new FreeCamera("camera1",
            new Vector3(0, 5, -10), scene);
        camera.setTarget(Vector3.Zero());
        camera.attachControl(canvas, true);
        const light = new HemisphericLight("light",
            new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        const sphere = MeshBuilder.CreateSphere("sphere",
            { diameter: 2, segments: 32 }, scene);
        sphere.position.y = 1;
        const ground = MeshBuilder.CreateGround("ground",
            { width: 6, height: 6 }, scene);
        return scene;
    };
    const scene = createScene();
    engine.runRenderLoop(function () {
        scene.render();
    });
    window.addEventListener("resize", function () {
        engine.resize();
    });
};



// Création des managers
let eventManager = new EventManager();
let scoreManager = new ScoreManager();

// Ajout des épreuves
eventManager.addEvent(new Event("100m Sprint"));
eventManager.addEvent(new Event("Long Jump"));
eventManager.addEvent(new Event("High Jump"));

// Démarrer la première épreuve
eventManager.startNextEvent();

// À la fin de l'épreuve, ajoutez le score
scoreManager.addScore(eventManager.events[eventManager.currentEventIndex], 1); // Si le joueur est premier

// Marquer l'épreuve comme complète et passer à la suivante
eventManager.completeCurrentEvent();

// Obtenir le score total
let totalScore = scoreManager.getTotalScore();
console.log(`Total score: ${totalScore}`);


  <div id="loadingScreen" style="position: absolute; width: 100%; height: 100%; background: black; display: flex; justify-content: center; align-items: center;">
    <div style="width: 50%; background: grey;">
        <div id="loadingBar" style="height: 20px; width: 0%; background: green;"></div>
    </div>
    <p id="loadingText" style="color: white; margin-top: 20px;">Chargement...</p>
  </div>

  État du jeu** : Implémentez un système d'état pour gérer différents états de jeu (par exemple, début, en cours, pause, fin). Cela rendra votre jeu plus structuré et facilitera l'ajout de nouvelles fonctionnalités.

*/