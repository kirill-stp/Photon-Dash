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
  fetch("levels/level_1.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((levelData) => {
      console.log("Level data loaded:", levelData); // Debug: Check if level data is loaded
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
  console.log("Setting canvas size:", dimensions); // Debug: Log canvas size
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
}

// Function to draw the background image on the canvas
function drawBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  console.log("Background drawn"); // Debug: Confirm background drawn
}

// Function to draw obstacles (mirrors)
function drawObstacles(levelData) {
  levelData.objects.forEach((obstacle) => {
    if (obstacle.type === "mirror") {
      console.log(
        "Drawing mirror at:",
        obstacle.topLeftPosition,
        obstacle.bottomRightPosition
      ); // Debug: Log mirror positions

      ctx.fillStyle = "rgba(0, 255, 0, 0.8)"; // Set color for mirrors (make it more visible)

      // Calculate mirror width and height
      const mirrorWidth =
        obstacle.bottomRightPosition.x - obstacle.topLeftPosition.x;
      const mirrorHeight =
        obstacle.bottomRightPosition.y - obstacle.topLeftPosition.y;

      // Draw the mirror as a rectangle on the canvas
      ctx.fillRect(
        obstacle.topLeftPosition.x,
        obstacle.topLeftPosition.y,
        mirrorWidth,
        mirrorHeight
      );

      console.log("Mirror drawn with size:", mirrorWidth, mirrorHeight); // Debug: Confirm mirror is drawn
    }
  });
}
