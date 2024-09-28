export class LevelManager {

    loadLevel (filename) {
        fetch(filename)
        .then(response => response.json())  // Parse the JSON file
        .then(levelData => {
            // Now we have the level data
            console.log('Loaded level data:', levelData);
            }
        )
        this.levelData = this.levelData;
    }

    update() {
        //look for collisions
        
    }
}