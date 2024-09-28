export class CanvasManager {
  constructor(canvasId) {
    // Get the canvas and context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
  }

  // Method to initialize the canvas and load the level data
  initializeLevel(levelJsonPath) {
    this.loadLevelData(levelJsonPath); // Load level data directly
  }

  // Method to load level data from JSON file
  loadLevelData(levelJsonPath) {
    fetch(levelJsonPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((levelData) => {
        console.log("Level data loaded:", levelData); // Debug: Check if level data is loaded
        this.setCanvasSize(levelData.dimensions); // Set the canvas size dynamically
        this.drawObstacles(levelData); // Call to draw obstacles with loaded data
      })
      .catch((error) => {
        console.error("Error loading level data:", error);
      });
  }

  // Method to set canvas width and height from JSON dimensions
  setCanvasSize(dimensions) {
    console.log("Setting canvas size:", dimensions); // Debug: Log canvas size
    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;
  }

  // Method to draw obstacles (mirrors)
  drawObstacles(levelData) {
    levelData.objects.forEach((obstacle) => {
      if (obstacle.type === "mirror") {
        console.log(
          "Drawing mirror at:",
          obstacle.topLeftPosition,
          obstacle.bottomRightPosition
        ); // Debug: Log mirror positions

        this.ctx.fillStyle = "rgba(0, 255, 0, 0.8)"; // Set color for mirrors (make it more visible)

        // Calculate mirror width and height
        const mirrorWidth =
          obstacle.bottomRightPosition.x - obstacle.topLeftPosition.x;
        const mirrorHeight =
          obstacle.bottomRightPosition.y - obstacle.topLeftPosition.y;

        // Draw the mirror as a rectangle on the canvas
        this.ctx.fillRect(
          obstacle.topLeftPosition.x,
          obstacle.topLeftPosition.y,
          mirrorWidth,
          mirrorHeight
        );

        console.log("Mirror drawn with size:", mirrorWidth, mirrorHeight); // Debug: Confirm mirror is drawn
      }
    });
  }
}