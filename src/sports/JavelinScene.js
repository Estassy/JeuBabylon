import { Engine, Texture, Scene, Color3, FreeCamera, MeshBuilder, Vector3, HemisphericLight, SceneLoader, StandardMaterial } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock,StackPanel, Control } from "@babylonjs/gui";

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

        this.scene = new Scene(this.engine);
        // Configurations de la scène ici...

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

        // Configuration du sol avec une texture plus réaliste
        let ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, this.scene);
        let groundMaterial = new StandardMaterial("groundMat", this.scene);
        let groundTexture = new Texture("path/to/realistic_ground_texture.jpg", this.scene);
        groundTexture.uScale = 6; // Répétition de la texture sur l'axe U
        groundTexture.vScale = 6; // Répétition de la texture sur l'axe V
        groundMaterial.diffuseTexture = groundTexture;
        ground.material = groundMaterial;
        ground.receiveShadows = true;

        // Chargement du modèle du joueur
        this.player = await this.loadPlayerModel();

        // Initialisation du lancer de javelot
        this.javelinThrow = new JavelinThrow(this.scene);
        this.javelinThrow.createJavelin();

        // Ajout d'arbres pour l'environnement
        await this.loadEnvironment();
        this.createSpectators();

        // Interface utilisateur
        this.createUI();

        // Prépare les contrôles de jeu
        this.initJavelinControls();

    }

    async loadPlayerModel() {
        let res = await SceneLoader.ImportMeshAsync("", "../../assets/models/", "player.glb", this.scene);
        let player = res.meshes[0];
        player.position = new Vector3(0, 0, 0);
        return player;
    }

    async loadEnvironment() {
        let treeResult = await SceneLoader.ImportMeshAsync("", "../../assets/models/", "tree_model.glb", this.scene);
        let tree = treeResult.meshes[0];
        tree.position = new Vector3(-5, 0, 5);
        tree.scaling = new Vector3(2, 2, 2);

        for (let i = 0; i < 5; i++) {
            let clone = tree.clone("treeClone" + i);
            clone.position.x += i * 4;
        }
    }

    createSpectators() {
        for (let i = 0; i < 10; i++) {
            let spectator = MeshBuilder.CreateBox("spectator" + i, { height: 1.8, width: 0.6, depth: 0.4 }, this.scene);
            spectator.position = new Vector3(-10 + i * 2, 0.9, 10);
            let material = new StandardMaterial("spectatorMat" + i, this.scene);
            material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
            spectator.material = material;
        }
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
    createUI() {
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        const panel = new StackPanel();
        panel.width = "220px";
        panel.fontSize = "14px";
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        advancedTexture.addControl(panel);

        const scoreText = new TextBlock();
        scoreText.text = "Score: 0";
        scoreText.height = "30px";
        scoreText.color = "white";
        panel.addControl(scoreText);

        this.scoreText = scoreText; // Conservez une référence pour mettre à jour le score plus tard
    }

    updateScore(score) {
        this.scoreText.text = "Score: " + score;
    }

}

export default JavelinScene;
