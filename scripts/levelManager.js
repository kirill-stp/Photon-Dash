import { Photon, Point } from './photon.js';

export class LevelManager {
    constructor() {
        let point = new Point(0, 0);
        this.photon = new Photon(point, 0.1, -0.3); // Initial speed
        this.levelData = null;
    }

    loadLevel(filename) {
        return fetch(filename)
            .then(response => response.json())
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
    
        // Check if photon is within the object's horizontal and vertical bounds
        return photonX >= objectLeft && photonX <= objectRight &&
               photonY >= objectTop && photonY <= objectBottom;
    }    

    update() {
        if (!this.levelData) return;

        const nextPos = this.photon.probePos();

        // Check collisions with all objects
        for (let object of this.levelData.objects) {
            if (this.detectCollision(object, nextPos)) {
                console.log(`Collision detected with ${object.name}`);
                if (object.type === 'mirror') {
                    handleMirrorCollision(object, nextPos);
                } else {
                    //add other stuff
                }
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

    handleMirrorCollision(object, nextPos) {
        // Determine direction of bounce (horizontal or vertical)
        const objectLeft = object.topLeftPosition.x;
        const objectRight = object.bottomRightPosition.x;
        const objectTop = object.topLeftPosition.y;
        const objectBottom = object.bottomRightPosition.y;

        let dx = 1, dy = 1;

                // Horizontal bounce
                if (nextPos.x <= object.topLeftPosition.x || nextPos.x >= object.bottomRightPosition.x) {
                    dx = -1;
                }

                // Vertical bounce
                if (nextPos.y <= object.topLeftPosition.y || nextPos.y >= object.bottomRightPosition.y) {
                    dy = -1;
                }

                this.photon.bounce(dx, dy);
                break;
            }
        }

        // Update photon's position if no collision detected
        this.photon.updatePos();

        // Check if the photon has reached the finish line
        if (this.detectCollision(this.levelData.finishLine, nextPos)) {
            console.log("Player has reached the finish line!");
            stopTimer();
        }
    }
}
