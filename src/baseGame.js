// BaseGame.js
import { Engine, Scene, FreeCamera, HemisphericLight, Color3, Vector3 } from "@babylonjs/core";

class BaseGame {
    constructor(engine, canvas) {
        if (!engine || !canvas) {
            console.error("Engine and canvas must be provided");
            return;
        }

        this.engine = engine;
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.initialize();
    }
 
    async initialize() {
        // Creating the scene
        await this.createScene();

        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95); // Background color
        this.scene.ambientColor = new Color3(0.8, 0.8, 1); // Ambient color

        // Adding a camera
        this.camera = new FreeCamera("camera1", new Vector3(0, 3.8, -10), this.scene);
        this.camera.setTarget(Vector3.Zero());
        this.camera.attachControl(this.canvas, true);

        // Adding a light
        this.light = new HemisphericLight("light1", new Vector3(0, 1, 0), this.scene);
        this.light.intensity = 0.7;

       
    }

    async createScene() {
        // Intended to be overridden by derived classes to add specific game elements
    }

    start() {
        // Start the game loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
}

export default BaseGame;
