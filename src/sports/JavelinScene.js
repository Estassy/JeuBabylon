import { Engine, Scene, Color3, FreeCamera, Quaternion, MeshBuilder, Vector3, HemisphericLight, SceneLoader, StandardMaterial } from "@babylonjs/core";

import JavelinThrow from "./javelinThrow";

class JavelinScene {
    constructor(canvas, engine) {
        this.canvas = canvas;
        this.engine = engine;
        this.scene = null;
        this.camera = null;
        this.player = null;
        this.javelinThrow = null;
    }

    async init() {
        // Création de la scène
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95);
        this.scene.ambientColor = new Color3(0.8, 0.8, 1);
        this.scene.gravity = new Vector3(0, -9.81, 0);
        this.scene.collisionsEnabled = true;
    
        // Configuration de la caméra
        this.camera = new FreeCamera("camera1", new Vector3(0, 2, -10), this.scene);
        this.camera.setTarget(new Vector3(0, 1, 0));
        this.camera.attachControl(this.canvas, true);
    
        // Configuration de la lumière
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    
        // Configuration du sol
        let ground = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, this.scene);
        var groundMaterial = new StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseColor = new Color3(0.4, 0.6, 0.3);
        ground.material = groundMaterial;
        ground.receiveShadows = true;
    
        // Chargement du modèle du joueur
        this.player = await this.loadPlayerModel();
        // Initialisation du lancer de javelot
        this.javelinThrow = new JavelinThrow(this.scene);
        this.javelinThrow.createJavelin();
    }

    async loadPlayerModel() {
        let res = await SceneLoader.ImportMeshAsync("", "../../assets/models/", "player.glb", this.scene);
        let player = res.meshes[0];
        player.position = new Vector3(0, 0, 0);
        return player;
    }

    start() {
        // Ajout des contrôles pour le lancer de javelot
        this.initJavelinControls();
        this.scene.onBeforeRenderObservable.add(() => {
            // Ajoutez ici d'autres actions à exécuter à chaque frame
        });
    }

    initJavelinControls() {
        window.addEventListener("keydown", (event) => {
            if (event.key === " ") {  
                this.javelinThrow.setupLaunch(20, 45);  
                this.javelinThrow.launch();
            }
        });
    }
}

export default JavelinScene;
