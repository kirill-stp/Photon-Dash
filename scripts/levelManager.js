import { Photon, Point } from './photon.js';

export class LevelManager {

    constructor(){
        let point = new Point(0,0);
        // TODO: add variable speed
        this.photon = new Photon(point, 1, 1);
        this.levelData = null;
    }

    loadLevel(filename) {
        return fetch(filename)  // Return the fetch promise
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
        return photonX >= objectLeft && photonX <= objectRight &&
               photonY >= objectTop && photonY <= objectBottom;
    }

    update() {
        if (!this.levelData) return; // Ensure level data is loaded
    
        const nextPos = this.photon.probePos(); // Calculate next position
    
        // Check collisions with all objects
        for (let object of this.levelData.objects) {
            if (this.detectCollision(object, nextPos)) {
                console.log(`Collision detected with ${object.name}`);
    
                let dx = 1, dy = 1;
    
                // Convert the object name to lowercase for easier matching
                const objectName = object.name.toLowerCase();
    
                // Reverse horizontal direction if the object is named 'left', 'right', or 'vertical'
                if (objectName.includes('left') || objectName.includes('right') || objectName.includes('vertical')) {
                    dx = -1;
                    console.log('Horizontal bounce detected (left/right/vertical)');
                }
    
                // Reverse vertical direction if the object is named 'top', 'bottom', or 'horizontal'
                if (objectName.includes('top') || objectName.includes('bottom') || objectName.includes('horizontal')) {
                    dy = -1;
                    console.log('Vertical bounce detected (top/bottom/horizontal)');
                }
    
                // Apply the bounce to the photon
                this.photon.bounce(dx, dy);
                break; // Only bounce once per frame
            }
        }
    
        // Update the photon's position if no collision detected
        this.photon.updatePos();
    
        // Check collision with the finish line
        if (this.detectCollision(this.levelData.finishLine, nextPos)) {
            console.log("Player has reached the finish line!");
        }
    }
    
    
    
}
