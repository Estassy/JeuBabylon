//Une classe Event pour représenter une épreuve individuelle.

class Event {
    constructor(name, isCompleted = false) {
        this.name = name;
        this.isCompleted = isCompleted;
    }

    start() {
        // Logique pour démarrer l'épreuve
        console.log(`${this.name} has started.`);
        // Ici, vous pouvez initialiser les conditions de début de l'épreuve
    }

    complete() {
        // Logique pour terminer l'épreuve
        this.isCompleted = true;
        console.log(`${this.name} is completed.`);
        // Ici, vous pouvez appeler la logique de scoring
    }
}
