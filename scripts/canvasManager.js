class CanvasManager {
  constructor(canvasId) {
    // Get the canvas and context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.photonPosition = { x: 0, y: 0 }; // Initial position of the photon
    this.levelData = null; // To store level data for redrawing
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
        this.levelData = levelData; // Store level data for redrawing
        this.drawObstacles(levelData); // Call to draw obstacles with loaded data
        this.drawPhoton(this.photonPosition.x, this.photonPosition.y); // Draw photon at initial position
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

  // Method to draw the photon at specific coordinates
  drawPhoton(x, y) {
    console.log("Drawing photon at:", x, y); // Debug: Log photon position

    this.clearCanvas(); // Clear the previous frame

    // Redraw obstacles to ensure they appear
    this.drawObstacles(this.levelData);

    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2, true); // Draw a small circle representing the photon
    this.ctx.fillStyle = "yellow"; // Set the color to yellow to represent the photon
    this.ctx.fill();
    this.ctx.closePath();

    console.log("Photon drawn at:", x, y); // Debug: Confirm photon is drawn
  }

  // Method to clear the canvas
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Method to update the position of the photon and redraw it
  updatePhotonPosition(x, y) {
    this.photonPosition.x = x;
    this.photonPosition.y = y;
    this.drawPhoton(this.photonPosition.x, this.photonPosition.y); // Draw the photon at the new position
  }
}

// Initialize the CanvasManager
const canvasManager = new CanvasManager("gameCanvas");

// Start the level and draw obstacles
canvasManager.initializeLevel("levels/level_1.json");

// Example of updating the photon position
canvasManager.updatePhotonPosition(150, 250); // Change this to whatever values you want
