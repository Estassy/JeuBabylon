//Une classe EventManager pour gérer toutes les épreuves.

class EventManager {
    constructor() {
        this.events = [];
        this.currentEventIndex = -1;
    }

    addEvent(event) {
        this.events.push(event);
    }

    startNextEvent() {
        this.currentEventIndex++;
        if (this.currentEventIndex < this.events.length) {
            this.events[this.currentEventIndex].start();
        } else {
            console.log("All events have been completed.");
            // Ici, vous pouvez déclencher la fin du jeu ou passer à la phase suivante
        }
    }

    completeCurrentEvent() {
        if (this.currentEventIndex !== -1 && this.currentEventIndex < this.events.length) {
            this.events[this.currentEventIndex].complete();
            this.startNextEvent();
        }
    }
}
