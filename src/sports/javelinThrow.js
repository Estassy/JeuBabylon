import { MeshBuilder, Quaternion, Tools, Vector3 } from "@babylonjs/core";

class JavelinThrow {
    constructor(scene) {
        this.scene = scene;  // La scène où le javelot sera utilisé
        this.launchPower = 10; // Puissance initiale du lancer
        this.launchAngle = 45; // Angle de lancement en degrés
        this.javelin = null; // L'objet du javelot
    }

    createJavelin() {
        // Création du javelot en tant que cylindre
        this.javelin = MeshBuilder.CreateCylinder("javelin", {
            diameterTop: 0.05,
            diameterBottom: 0.05,
            height: 2
        }, this.scene);

        // Orientation initiale du javelot pour qu'il soit horizontal
        this.javelin.rotationQuaternion = Quaternion.FromEulerAngles(Math.PI / 2, 0, 0);
        
        // Positionnement initial du javelot à une position fictive, ajustez selon le besoin
        this.javelin.position = new Vector3(0, 1.5, 0);
        
        // Le javelot est initialement invisible
        this.javelin.isVisible = false;
    }

    setupLaunch(power, angle) {
        // Configuration de la puissance et de l'angle de lancement
        this.launchPower = power;
        this.launchAngle = angle;
    }

    launch() {
        // Rendre le javelot visible au lancement
        this.javelin.isVisible = true;
        
        // Calcul des composantes de la vitesse initiale
        const angleRadians = Tools.ToRadians(this.launchAngle);
        const velocityX = this.launchPower * Math.cos(angleRadians);
        const velocityY = this.launchPower * Math.sin(angleRadians);

        // Ajout d'une routine de mise à jour pour la dynamique du javelot
        this.scene.onBeforeRenderObservable.add(() => {
            if (!this.javelin) return;

            const deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
            this.javelin.position.x += velocityX * deltaTime;
            this.javelin.position.y += velocityY * deltaTime - (0.5 * 9.81 * deltaTime * deltaTime); // Application de la gravité

            // Arrêter le lancer lorsque le javelot touche le sol
            if (this.javelin.position.y <= 0) {
                this.scene.onBeforeRenderObservable.clear();
                this.javelin.isVisible = false; // Rendre à nouveau le javelot invisible
                console.log(`Distance parcourue: ${this.javelin.position.x} mètres`);
            }
        });
    }
    
}

export default JavelinThrow;
