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
        this.drawScene(); // Draw the initial scene with obstacles and photon
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

  // Method to draw the entire scene (mirrors and photon)
  drawScene() {
    this.clearCanvas(); // Clear the previous frame
    this.drawObstacles(this.levelData); // Draw obstacles
    this.drawPhoton(this.photonPosition.x, this.photonPosition.y); // Draw photon at its position
    // Example arrow drawing from photon to a specific point
    this.drawArrow(this.photonPosition.x, this.photonPosition.y, 200, 300); // Modify endpoint as needed
  }

  // Method to draw obstacles (mirrors)
  drawObstacles(levelData) {
    if (!levelData || !levelData.objects) {
      console.warn("No obstacles to draw."); // Debug: Warn if no obstacles
      return;
    }

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

  // Method to update the position of the photon and redraw the scene
  updatePhotonPosition(x, y) {
    this.photonPosition.x = x;
    this.photonPosition.y = y;
    this.drawScene(); // Redraw the entire scene with updated photon position
  }

  // Method to draw an arrow from (x0, y0) to (x1, y1)
  drawArrow(x0, y0, x1, y1) {
    console.log(`Drawing arrow from (${x0}, ${y0}) to (${x1}, ${y1})`); // Debug: Log arrow drawing

    const headLength = 10; // Length of the arrow head

    // Draw the line
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0); // Starting point
    this.ctx.lineTo(x1, y1); // End point
    this.ctx.lineWidth = 2; // Arrow line width
    this.ctx.strokeStyle = "blue"; // Arrow color
    this.ctx.stroke();

    // Draw the arrow head
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(
      x1 - headLength * Math.cos(Math.atan2(y1 - y0, x1 - x0) - Math.PI / 6),
      y1 - headLength * Math.sin(Math.atan2(y1 - y0, x1 - x0) - Math.PI / 6)
    );
    this.ctx.lineTo(
      x1 - headLength * Math.cos(Math.atan2(y1 - y0, x1 - x0) + Math.PI / 6),
      y1 - headLength * Math.sin(Math.atan2(y1 - y0, x1 - x0) + Math.PI / 6)
    );
    this.ctx.lineTo(x1, y1);
    this.ctx.fillStyle = "blue"; // Arrow head color
    this.ctx.fill();
    this.ctx.closePath();

    console.log(`Arrow drawn from (${x0}, ${y0}) to (${x1}, ${y1})`); // Debug: Confirm arrow is drawn
  }
}

// Initialize the CanvasManager
const canvasManager = new CanvasManager("gameCanvas");

// Start the level and draw obstacles
canvasManager.initializeLevel("levels/level_1.json");

// Example of updating the photon position
canvasManager.updatePhotonPosition(450, 350); // Change this to whatever values you want
