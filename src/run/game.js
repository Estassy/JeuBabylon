import { Color3, DefaultRenderingPipeline, FreeCamera, HemisphericLight, KeyboardEventTypes, MeshBuilder, MotionBlurPostProcess, Scalar, Scene, SceneLoader, Sound, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";

const TRACK_WIDTH = 8;
const TRACK_HEIGHT = 0.1;
const TRACK_DEPTH = 3;
const NB_TRACKS = 50;
let NB_OBSTACLES = 10;
const SPAWN_POS_Z = (TRACK_DEPTH * NB_TRACKS);
let SPEED_Z = 30;
const SPEED_X = 10;
const MIN_Z_GAP = 20;  // Espacement minimal sur l'axe z entre deux obstacles
const MAX_Z_GAP = 40;  // Espacement maximal sur l'axe z

let currentLevel = 1;
let levelThresholds = [100, 150, 200, 300, 400]; // Points nécessaires pour chaque niveau




import meshUrl from "../../assets/models/player.glb";
import mountainUrl from "../../assets/models/mount_timpanogos_early_2017.glb";
import roadTextureUrl from "../../assets/textures/dd719e47a144a8ed5f56999b21ffafeb.jpg";

import musicUrl from "../../assets/musics/Cyberpunk Moonlight Sonata v2.mp3";
import hitSoundUrl from "../../assets/sounds/344033__reitanna__cute-impact.wav";

import obstacle1Url from "../../assets/models/ice_cube.glb";
import obstacle2Url from "../../assets/models/Box.glb";


class Game {

    engine;
    canvas;
    scene;

    startTimer;

    player;
    playerBox;
    obstacles = [];
    tracks = [];

    inputMap = {};
    actions = {};

    score = 100;
    scoreDisplay;
    obstacleTypes = [obstacle1Url, obstacle2Url];

    constructor(engine, canvas) {
        this.engine = engine;
        this.canvas = canvas;
        this.scoreDisplay = document.getElementById("scoreDisplay");
    }

    init() {
        this.initializeHUD();
        this.engine.displayLoadingUI();
        this.createScene().then(() => {

            this.scene.onKeyboardObservable.add((kbInfo) => {
                switch (kbInfo.type) {
                    case KeyboardEventTypes.KEYDOWN:
                        this.inputMap[kbInfo.event.code] = true;
                        //console.log(`KEY DOWN: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                        break;
                    case KeyboardEventTypes.KEYUP:
                        this.inputMap[kbInfo.event.code] = false;
                        this.actions[kbInfo.event.code] = true;
                        //console.log(`KEY UP: ${kbInfo.event.code} / ${kbInfo.event.key}`);
                        break;
                }
            });
            this.engine.hideLoadingUI();

            //qdqdInspector.Show(this.scene, {});
        });

    }

    start() {
        this.countdown(3, () => {
            this.engine.runRenderLoop(() => {
                let delta = this.engine.getDeltaTime() / 1000.0;

                this.updateMoves(delta);
                this.update(delta);

                this.scene.render();
            });
        });
    }

    countdown(seconds, callback) {
        let counter = seconds;
        const display = document.getElementById("countdownDisplay");
        display.innerText = `Le jeu commence dans : ${counter} secondes`;
        display.style.display = "block";

        const interval = setInterval(() => {
            console.log(counter + ' secondes restantes');
            counter--;
            display.innerText = `Le jeu commence dans : ${counter} secondes`;
            if (counter < 0) {
                clearInterval(interval);
                display.style.display = "none";
                callback();
                this.engine.resize();  // Force le redimensionnement du moteur après le compte à rebours
            }
        }, 1000);
    }


    initializeObstacles() {
        let lastZ = SPAWN_POS_Z;
        console.log(NB_OBSTACLES)
        for (let i = 0; i < NB_OBSTACLES; i++) {
            let obstacleTypeUrl = this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];
            SceneLoader.ImportMeshAsync("", "", obstacleTypeUrl, this.scene).then((res) => {
                let obstacle = res.meshes[0];
                obstacle.normalizeToUnitCube();
                obstacle.scaling.set(
                    Scalar.RandomRange(0.5, 1.5),
                    Scalar.RandomRange(0.5, 1.5),
                    Scalar.RandomRange(0.5, 1.5)
                );

                let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);

                // Générer le z avec un espacement contrôlé
                let zGap = Scalar.RandomRange(MIN_Z_GAP, MAX_Z_GAP);
                let z = lastZ + zGap;  // Positionner le prochain obstacle à 'zGap' unités derrière le dernier
                lastZ = z;  // Mettre à jour la position z pour le prochain obstacle

                obstacle.position.set(x, 0.5, z);
                obstacle.checkCollisions = true;
                obstacle.collisionGroup = 2;
                obstacle.rotation.y = Math.random() * Math.PI * 2; // Rotation aléatoire
                this.obstacles.push(obstacle);
            });
        }
    }


    update(delta) {
        this.obstacles.forEach(obstacle => {
            obstacle.position.z -= SPEED_Z * delta;
            if (obstacle.position.z < 0) {
                if (!obstacle.touched) {
                    this.score += 2;
                    this.updateScore();
                    this.updateLevel();
                }
                // Réinitialiser l'obstacle
                this.resetObstacle(obstacle);
            } else if (this.playerBox.intersectsMesh(obstacle, false) && !obstacle.touched) {
                obstacle.touched = true;
                this.score -= 5;
                this.updateScore();
                this.aie.play();

                if (this.score === 0) {
                    this.endGame();
                    return; // Arrêter la boucle d'actualisation si le jeu se termine
                }
            }
        });


        // Mise à jour de la position des pistes
        for (let i = 0; i < this.tracks.length; i++) {
            let track = this.tracks[i];
            track.position.z -= SPEED_Z / 3 * delta;
            if (track.position.z <= 0) {
                let nextTrackIdx = (i + this.tracks.length - 1) % this.tracks.length;
                track.position.z = this.tracks[nextTrackIdx].position.z + TRACK_DEPTH;
            }
        }

        this.startTimer += delta;
    }

    resetObstacle(obstacle) {
        let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);
        let z = SPAWN_POS_Z + Scalar.RandomRange(MIN_Z_GAP, MAX_Z_GAP); // Assurez-vous que SPAWN_POS_Z est bien au-delà de la vue initiale du joueur
        obstacle.position.set(x, 0.5, z);
        obstacle.touched = false;
    }



    updateMoves(delta) {
        if (this.inputMap["KeyA"]) {
            this.player.position.x -= SPEED_X * delta;
            if (this.player.position.x < -3.75)
                this.player.position.x = -3.75;
        }
        else if (this.inputMap["KeyD"]) {
            this.player.position.x += SPEED_X * delta;
            if (this.player.position.x > 3.75)
                this.player.position.x = 3.75;
        }

        if (this.actions["Space"]) {
            if (!this.isJumping) {
                this.isJumping = true;
                // Exemple simple de saut
                this.player.position.y += 1; // Hauteur du saut
                setTimeout(() => {
                    this.player.position.y -= 1; // Retour au sol
                    this.isJumping = false;
                }, 500); // Durée du saut
            }
            this.actions["Space"] = false; // Reset l'action de saut
        }
    }

    updateLevel() {
        if (currentLevel - 1 < levelThresholds.length && this.score >= levelThresholds[currentLevel - 1]) {
            currentLevel++;
            SPEED_Z += 10; // Augmenter la vitesse de base des obstacles à chaque niveau
            NB_OBSTACLES += 4;
            console.log(`Level Up! Welcome to Level ${currentLevel}`);
            this.showLevelUpMessage(currentLevel); // Afficher le message de niveau sur l'écran
        }
    }

    showLevelUpMessage(level) {
        // Supposons que vous avez un élément HTML pour afficher les messages
        const levelUpDiv = document.getElementById('levelUpMessage');
        levelUpDiv.innerText = `Level ${level}!`;
        levelUpDiv.style.display = 'block';
        setTimeout(() => levelUpDiv.style.display = 'none', 3000); // Le message disparaît après 3 secondes
    }

    endGame() {
        // Arrêter la boucle de rendu
        this.engine.stopRenderLoop();

        // Afficher un message de perte
        const gameOverMessage = document.createElement("div");
        gameOverMessage.id = "gameOver";
        gameOverMessage.style.position = "fixed";
        gameOverMessage.style.top = "50%";
        gameOverMessage.style.left = "50%";
        gameOverMessage.style.transform = "translate(-50%, -50%)";
        gameOverMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        gameOverMessage.style.color = "white";
        gameOverMessage.style.padding = "20px";
        gameOverMessage.style.fontSize = "24px";
        gameOverMessage.style.borderRadius = "10px";
        gameOverMessage.innerText = "Game Over! Cliquez pour recommencer.";
        document.body.appendChild(gameOverMessage);

        // Ajouter un écouteur d'événements pour redémarrer le jeu
        gameOverMessage.addEventListener("click", () => {
            // Retirer le message de perte
            document.body.removeChild(gameOverMessage);

            // Réinitialiser le jeu
            this.resetGame();
        });
    }

    resetGame() {
        // Réinitialiser le score
        this.score = 0;
        this.updateScore();

        // Réinitialiser la position du joueur
        this.player.position.set(0, TRACK_HEIGHT / 2, 6);

        // Réinitialiser les positions des obstacles
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];
            let x = Scalar.RandomRange(-TRACK_WIDTH / 2, TRACK_WIDTH / 2);
            let z = Scalar.RandomRange(SPAWN_POS_Z - 15, SPAWN_POS_Z + 15);
            obstacle.position.set(x, 0.5, z);
        }

        // Redémarrer la boucle de rendu
        this.engine.runRenderLoop(() => this.scene.render());
    }

    async createScene() {

        // This creates a basic Babylon Scene object (non-mesh)
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color3(0.7, 0.7, 0.95);
        this.scene.ambientColor = new Color3(0.8, 0.8, 1);
        this.scene.fogMode = Scene.FOGMODE_LINEAR;
        this.scene.fogStart = SPAWN_POS_Z - 30;
        this.scene.fogEnd = SPAWN_POS_Z;
        this.scene.fogColor = new Color3(0.6, 0.6, 0.85);
        this.scene.collisionsEnabled = true;
        this.scene.gravity = new Vector3(0, -0.15, 0);


        // This creates and positions a free camera (non-mesh)
        this.camera = new FreeCamera("camera1", new Vector3(0, 3.8, 0), this.scene);

        // This targets the camera to scene origin
        this.camera.setTarget(new Vector3(0, 3, 3));

        // This attaches the camera to the canvas
        this.camera.attachControl(this.canvas, true);

        // Set up new rendering pipeline
        var pipeline = new DefaultRenderingPipeline("default", true, this.scene, [this.camera]);

        pipeline.glowLayerEnabled = true;
        pipeline.glowLayer.intensity = 0.35;
        pipeline.glowLayer.blurKernelSize = 16;
        pipeline.glowLayer.ldrMerge = true;


        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);

        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        // Finally create the motion blur effect :)
        var mb = new MotionBlurPostProcess('mb', this.scene, 1.0, this.camera);
        mb.motionStrength = 1;

        // Our built-in 'ground' shape.
        //var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);


        let res = await SceneLoader.ImportMeshAsync("", "", meshUrl, this.scene);

        // Set the target of the camera to the first imported mesh
        this.player = res.meshes[0];
        //mb.excludeSkinnedMesh(this.player);
        res.meshes[0].name = "Player";
        res.meshes[0].scaling = new Vector3(1, 1, 1);
        res.meshes[0].position.set(0, TRACK_HEIGHT / 2, 6);
        res.meshes[0].rotation = new Vector3(0, 0, 0);
        res.animationGroups[0].stop();
        res.animationGroups[1].play(true);

        this.playerBox = MeshBuilder.CreateCapsule("playerCap", { width: 0.4, height: 1.7 });
        this.playerBox.position.y = 1.7 / 2;
        this.playerBox.parent = this.player;
        this.playerBox.checkCollisions = true;
        this.playerBox.collisionGroup = 1;
        this.playerBox.visibility = 0;
        //this.playerBox.showBoundingBox = true;


        let mainTrack = MeshBuilder.CreateBox("trackmiddle", { width: TRACK_WIDTH, height: TRACK_HEIGHT, depth: TRACK_DEPTH });
        mainTrack.position = new Vector3(0, 0, 0);
        let matRoad = new StandardMaterial("road");
        let tex = new Texture(roadTextureUrl);
        matRoad.diffuseTexture = tex;
        mainTrack.material = matRoad;
        for (let i = 0; i < NB_TRACKS; i++) {
            let newTrack = mainTrack.clone();
            newTrack.position.z = TRACK_DEPTH * i;
            this.tracks.push(newTrack);
        }
        mainTrack.dispose();

        res = await SceneLoader.ImportMeshAsync("", "", mountainUrl, this.scene);
        // Set the target of the camera to the first imported mesh
        res.meshes[0].name = "mountain";
        res.meshes[0].position = new Vector3(-18, -31.3, 123.2);
        res.meshes[0].rotation = new Vector3(0, Math.PI / 2, 0);
        res.meshes[0].scaling = new Vector3(2, 2, 2);

        //ici obst

        this.initializeObstacles();


        this.music = new Sound("music", musicUrl, this.scene, undefined, { loop: true, autoplay: true, volume: 0.4 });
        this.aie = new Sound("aie", hitSoundUrl, this.scene);
        this.scoreDisplay = document.getElementById("scoreDisplay");

    }
    pause() {
        this.engine.stopRenderLoop();
        if (this.music && this.music.isPlaying) {
            this.music.pause();
        }
    }

    resume() {
        this.engine.runRenderLoop(() => this.scene.render());
        if (this.music && !this.music.isPlaying) {
            this.music.play();
        }
    }

    dispose() {
        if (this.scene) {
            this.scene.dispose();
        }
        if (this.music) {
            this.music.stop();
            this.music.dispose();
        }
    }
    // Fonction d'initialisation des obstacles




    // Mise à jour du score
    updateScore() {
        this.scoreDisplay.innerText = `Score: ${this.score}`;
    }
    // Fonction d'initialisation du HUD
    initializeHUD() {
        // Assurez-vous d'avoir un élément `div` avec l'id `scoreDisplay`
        let hud = document.createElement("div");
        hud.id = "scoreDisplay";
        hud.style.position = "fixed";
        hud.style.top = "10px";
        hud.style.left = "10px";
        hud.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        hud.style.color = "white";
        hud.style.padding = "10px";
        document.body.appendChild(hud);
    }

}

export default Game;