//Une classe ScoreManager pour gérer le système de scoring.

class ScoreManager {
    constructor() {
        this.scores = {};
    }

    addScore(event, position) {
        let points = 0;
        switch(position) {
            case 1:
                points = 3; // Or pour médaille d'or
                break;
            case 2:
                points = 2; // Argent pour médaille d'argent
                break;
            case 3:
                points = 1; // Bronze pour médaille de bronze
                break;
            default:
                points = 0; // Pas de points
        }
        this.scores[event.name] = points;
    }

    getTotalScore() {
        return Object.values(this.scores).reduce((a, b) => a + b, 0);
    }
}
