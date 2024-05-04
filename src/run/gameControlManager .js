class GameControlManager {
    constructor(engine, game, canvas) {
        this.engine = engine;
        this.game = game;
        this.canvas = canvas;
        this.pauseMenu = document.getElementById("pauseMenu");
        this.handleEscape = this.handleEscape.bind(this); // Bind the method to maintain 'this' context
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener("keydown", this.handleEscape);
        document.getElementById("resumeGame").addEventListener("click", this.resumeGame.bind(this));
        document.getElementById("backToMenu").addEventListener("click", this.backToMenu.bind(this));
    }

    handleEscape(event) {
        if (event.key === "Escape") {
            const pauseMenuVisible = this.pauseMenu.style.display !== "none";
            pauseMenuVisible ? this.resumeGame() : this.pauseGame();
        }
    }


    pauseGame() {
        this.game.pause();
        this.pauseMenu.style.display = "block";
    }

    resumeGame() {
        this.game.resume();
        this.pauseMenu.style.display = "none";
    }

    backToMenu() {
        this.dispose(); // Always clean up before switching
        document.querySelector('.menu').style.display = 'block';
        this.canvas.style.display = 'none';
        this.pauseMenu.style.display = "none";
    }

    dispose() {
        window.removeEventListener("keydown", this.handleEscape);
        // Clean up other event listeners if needed
    }
}

export default GameControlManager;