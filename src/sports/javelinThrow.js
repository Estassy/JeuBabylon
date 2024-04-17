import { Engine, Scene, Color3, FreeCamera,Quaternion, Tools, MeshBuilder, Vector3, HemisphericLight, SceneLoader, StandardMaterial } from "@babylonjs/core";

class JavelinThrow {
    constructor(game) {
        this.game = game;
        this.launchPower = 10; // Exemple de puissance initiale
        this.launchAngle = 45; // Angle en degrés, idéal pour un début
        this.javelin = null; // Le javelot
    }

    createJavelin() {
        this.javelin = MeshBuilder.CreateCylinder("javelin", { diameterTop: 0.05, diameterBottom: 0.05, height: 2 }, this.game.scene);
        this.javelin.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0); // Oriente le javelot horizontalement
        this.javelin.position = new Vector3(this.game.player.transform.position.x, this.game.player.transform.position.y + 1.5, this.game.player.transform.position.z);
        this.javelin.isVisible = false; // Cachez le javelot jusqu'au lancement
    }

    launch() {
        this.javelin.isVisible = true; // Rendez le javelot visible lors du lancement
        const power = this.launchPower;
        const angleRadians = Tools.ToRadians(this.launchAngle);

        const velocityX = power * Math.cos(angleRadians);
        const velocityY = power * Math.sin(angleRadians);

        this.game.scene.onBeforeRenderObservable.add(() => {
            if (!this.javelin) return;

            const deltaTime = this.game.engine.getDeltaTime() / 1000.0;
            this.javelin.position.x += velocityX * deltaTime;
            this.javelin.position.y += velocityY * deltaTime - (0.5 * 9.81 * Math.pow(deltaTime, 2)); // Inclut la gravité

            if (this.javelin.position.y <= 0) {
                this.game.scene.onBeforeRenderObservable.clear(); // Arrête le lancer lorsque le javelot touche le sol
                console.log(`Distance: ${this.javelin.position.x} meters`);
            }
        });
    }

    setupLaunch(power, angle) {
        this.launchPower = power;
        this.launchAngle = angle;
    }

    async createJavelinScene() {
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95);
        this.scene.ambientColor = new Color3(0.8, 0.8, 1);
        this.scene.gravity = new Vector3(0, -9.81, 0);  // Gravité réaliste pour le javelot
        this.scene.collisionsEnabled = true;
    
        this.camera = new FreeCamera("camera1", new Vector3(0, 2, -10), this.scene);
        this.camera.setTarget(new Vector3(0, 1, 0));
        this.camera.attachControl(this.canvas, true);
    
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;
    
        let ground = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, this.scene);
        var groundMaterial = new StandardMaterial("groundMat", this.scene);
        groundMaterial.diffuseColor = new Color3(0.4, 0.6, 0.3);
        ground.material = groundMaterial;
        ground.receiveShadows = true;
    
        this.player = await this.loadPlayerModel(); // Supposons que cette fonction charge le modèle du joueur
        this.javelinThrow = new JavelinThrow(this);
        this.javelinThrow.createJavelin(); // Créer le javelot et le préparer pour le lancer
    
        this.initJavelinControls(); // Configurer les contrôles pour le lancer de javelot
    }
    
    async loadPlayerModel() {
        let res = await SceneLoader.ImportMeshAsync("", "path_to_models/", "playerModel.glb", this.scene);
        let player = res.meshes[0];
        player.position = new Vector3(0, 0, 0);
        return player;
    }
    
    initJavelinControls() {
        window.addEventListener("keydown", (event) => {
            if (event.key === " ") {  // Utiliser l'espace pour lancer
                this.javelinThrow.setupLaunch(20, 45);  // Puissance et angle prédéfinis
                this.javelinThrow.launch();
            }
        });
    }
    
}

export default JavelinThrow;
