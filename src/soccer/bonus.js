import { MeshBuilder, StandardMaterial, Color3, Vector3, Scene } from '@babylonjs/core';

import { GlobalManager } from "./globalmanager";

class Bonus {
    constructor(scene) {
        this.scene = scene;
        this.bonusMesh = null;
        this.isActive = false;
    }

    createBonus() {
        this.bonusMesh = MeshBuilder.CreateSphere('bonus', { diameter: 1 }, this.scene);
        this.bonusMesh.position = new Vector3(Math.random() * 50 - 25, 1, Math.random() * 50 - 25);
        const bonusMaterial = new StandardMaterial('bonusMaterial', this.scene);
        bonusMaterial.diffuseColor = new Color3(1, 0, 0); // Red color
        this.bonusMesh.material = bonusMaterial;
        this.isActive = true;

        // Automatically hide the bonus after 10 seconds
        setTimeout(() => {
            this.removeBonus();
        }, 10000);
    }

    removeBonus() {
        if (this.bonusMesh) {
            this.bonusMesh.dispose();
            this.isActive = false;
        }
    }

    checkCollision(playerMesh) {
        if (this.bonusMesh.intersectsMesh(playerMesh, false)) {
            this.activateEffect();
            this.removeBonus();
        }
    }

    activateEffect() {
        // Implement the effect, like increasing player speed
        console.log('Bonus activated! Speed increased.');
        // Assuming the player has a method to set speed
        GlobalManager.player.setSpeed(GlobalManager.player.getSpeed() * 1.5); 
        setTimeout(() => {
            GlobalManager.player.setSpeed(GlobalManager.player.getSpeed() / 1.5);
        }, 5000); // Effect lasts for 5 seconds
    }
}

export default Bonus;