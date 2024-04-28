import { MeshBuilder, Quaternion, Tools, Vector3 } from "@babylonjs/core";

class JavelinThrow {
    constructor(scene) {
        this.scene = scene;
        this.launchPower = 10;
        this.launchAngle = 45;
        this.javelin = null;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    start() {
        this.initJavelinControls();  // Assurez-vous que cette ligne est bien présente
        // Ajoutez toute autre logique nécessaire pour démarrer le jeu
    }
    

    createJavelin() {
        // Création du javelot en tant que cylindre
        this.javelin = MeshBuilder.CreateCylinder("javelin", {
            diameterTop: 0.05,
            diameterBottom: 0.05,
            height: 2
        }, this.scene);
    
        // Étant donné que les vitesses initiales sont zéro, cette rotation initiale serait indéfinie.
        // Nous initialisons donc le javelot avec une rotation neutre ou une orientation de base.
        this.javelin.rotationQuaternion = Quaternion.Identity();  // Quaternion neutre
    
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

    initJavelinControls() {
        window.addEventListener("keydown", (event) => {
            if (event.key === " ") {
                this.setupLaunch(20, 45);  // Configurez directement dans cette classe
                this.launch();  // Déclenche le lancement également dans cette classe
            }
        });
    }
    

    launch() {
        // Rendre le javelot visible au lancement
        this.javelin.isVisible = true;
    
        // Calcul des composantes de la vitesse initiale basées sur la puissance et l'angle de lancement
        const angleRadians = Tools.ToRadians(this.launchAngle);
        this.velocityX = this.launchPower * Math.cos(angleRadians);
        this.velocityY = this.launchPower * Math.sin(angleRadians);
    
        // Mise à jour initiale de la rotation du javelot pour qu'il pointe dans la direction de son mouvement
        this.javelin.rotationQuaternion = Quaternion.FromEulerAngles(Math.atan2(this.velocityY, this.velocityX), 0, 0);
    
        // Ajouter un observateur pour la mise à jour de la position et de la rotation du javelot avant chaque rendu
        this.onBeforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.javelin) return;
    
            const deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
    
            // Mise à jour de la position du javelot
            this.javelin.position.x += this.velocityX * deltaTime;
            this.velocityY -= 9.81 * deltaTime; // mise à jour de la vitesse verticale due à la gravité
            this.javelin.position.y += this.velocityY * deltaTime;
    
            // Mise à jour de la rotation du javelot en fonction de la nouvelle trajectoire
            this.javelin.rotationQuaternion = Quaternion.FromEulerAngles(Math.atan2(this.velocityY, this.velocityX), 0, 0);
    
            // Arrêter le lancer lorsque le javelot touche le sol
            if (this.javelin.position.y <= 0) {
                this.javelin.position.y = 0;
                this.javelin.isVisible = false;
                this.scene.onBeforeRenderObservable.remove(this.onBeforeRenderObserver); // Suppression de l'observateur pour éviter les fuites de mémoire
                console.log(`Distance parcourue: ${this.javelin.position.x} mètres`);
            }
        });
    }
    

}

export default JavelinThrow;
