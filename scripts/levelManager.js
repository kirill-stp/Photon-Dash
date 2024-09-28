import { Photon, Point } from './photon.js';

export class LevelManager {

    constructor(){
        let point = new Point(0,0);
        // TODO: add variable speed
        this.photon = new Photon(point,1,1);
    }

    loadLevel(filename) {
        fetch(filename)
            .then(response => response.json())  // Parse the JSON file
            .then(levelData => {
                this.levelData = levelData;

                // Set photon start position
                this.photon.pos.x = this.levelData.playerStart.x;
                this.photon.pos.y = this.levelData.playerStart.y;
            });
    }

    detectCollision(object, nextPos) {
        // Object boundaries
        const objectLeft = object.topLeftPosition.x;
        const objectRight = object.bottomRightPosition.x;
        const objectTop = object.topLeftPosition.y;
        const objectBottom = object.bottomRightPosition.y;

        // Photon next position
        const photonX = nextPos.x;
        const photonY = nextPos.y;

        // Check if photon is inside the object’s boundaries
        return photonX > objectLeft && photonX < objectRight &&
               photonY > objectTop && photonY < objectBottom;
    }

    update() {
        if (!this.levelData) return; // Ensure level data is loaded

        // Get the photon's next position
        const nextPos = this.photon.probePos();

        // Check collisions with all objects
        for (let object of this.levelData.objects) {
            if (this.detectCollision(object, nextPos)) {
                console.log(`Collision detected with ${object.name}`);
                
                // Determine direction of bounce (horizontal or vertical)
                const objectLeft = object.topLeftPosition.x;
                const objectRight = object.bottomRightPosition.x;
                const objectTop = object.topLeftPosition.y;
                const objectBottom = object.bottomRightPosition.y;

                let dx = 1, dy = 1;

                // Horizontal bounce (left or right edge)
                if (nextPos.x <= objectLeft || nextPos.x >= objectRight) {
                    dx = -1;  // Reverse horizontal direction
                }

                // Vertical bounce (top or bottom edge)
                if (nextPos.y <= objectTop || nextPos.y >= objectBottom) {
                    dy = -1;  // Reverse vertical direction
                }

                // Bounce the photon with the appropriate direction
                this.photon.bounce(dx, dy);
                break;
            }
        }

        // Update photon's position if no collision detected
        this.photon.updatePos();

        // Check collision with finish line
        if (this.detectCollision(this.levelData.finishLine, nextPos)) {
            console.log("Player has reached the finish line!");
        }
    }
}