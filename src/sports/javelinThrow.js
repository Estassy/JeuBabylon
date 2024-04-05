import { Engine, Scene, FreeCamera, Tools, MeshBuilder, Vector3 } from "@babylonjs/core";

class JavelinThrow {
    constructor(game) {
        this.game = game;
        this.launchPower = 0; // Puissance du lancer
        this.launchAngle = 45; // Angle en degrés, idéal pour un début
        this.javelin = null; // Le javelot
    }

    createJavelin() {
        this.javelin = MeshBuilder.CreateCylinder("javelin", {diameterTop: 0.05, diameterBottom: 0.05, height: 2}, this.game.scene);
        this.javelin.rotation.x = Math.PI / 2; // Oriente le javelot horizontalement
        // Position initiale du javelot à ajuster
        this.javelin.position = new Vector3(this.game.player.position.x, this.game.player.position.y + 1, this.game.player.position.z);
    }

    launch() {
        // Simulation simplifiée
        const power = this.launchPower;
        const angleRadians = Tools.ToRadians(this.launchAngle);

        const velocityX = power * Math.cos(angleRadians);
        const velocityY = power * Math.sin(angleRadians);

        // Mise à jour de la position du javelot sur le temps
        this.game.scene.onBeforeRenderObservable.add(() => {
            if (!this.javelin) return;

            const deltaTime = this.game.engine.getDeltaTime() / 1000.0;
            this.javelin.position.x += velocityX * deltaTime;
            this.javelin.position.y += (velocityY - (9.81 * deltaTime)) * deltaTime; // Gravité simplifiée

            if (this.javelin.position.y <= 0) {
                this.game.scene.onBeforeRenderObservable.clear(); // Stop le lancer quand le javelot touche le sol
                console.log(`Distance: ${this.javelin.position.x} meters`);
                // Ici, vous pouvez calculer le score basé sur la distance
            }
        });
    }

    // Méthode pour initialiser la puissance et l'angle, à compléter
    setupLaunch() {
        // Implémentez la logique pour régler la puissance et l'angle
    }
}
