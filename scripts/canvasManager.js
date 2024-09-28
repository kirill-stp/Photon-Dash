// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load background image
const backgroundImage = new Image();
backgroundImage.src = "space-image.jpg"; // Replace with your image path

backgroundImage.onload = () => {
  // Draw the background image once it's loaded
  loadLevelData(); // Load level data after background is drawn
};

// Function to load level data from JSON file
function loadLevelData() {
  fetch("level_1.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((levelData) => {
      setCanvasSize(levelData.dimensions); // Set the canvas size dynamically
      drawBackground();
      drawObstacles(levelData); // Call to draw obstacles with loaded data
    })
    .catch((error) => {
      console.error("Error loading level data:", error);
    });
}

// Function to set canvas width and height from JSON dimensions
function setCanvasSize(dimensions) {
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
}

// Function to draw the background image on the canvas
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Function to draw obstacles
function drawObstacles(levelData) {
  levelData.objects.forEach((obstacle) => {
    if (obstacle.type === "mirror") {
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)"; // Set color for mirrors
      ctx.fillRect(
        obstacle.topLeftPosition.x,
        obstacle.topLeftPosition.y,
        obstacle.bottomRightPosition.x - obstacle.topLeftPosition.x,
        obstacle.bottomRightPosition.y - obstacle.topLeftPosition.y
      );
    }
  });
}
