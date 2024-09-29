export class CanvasManager {
  constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.photonPosition = { x: 0, y: 0 }; // Initial position of the photon
      this.levelData = null; // To store level data for redrawing
      this.arrowStart = { x: 0, y: 0 };
      this.arrowEnd = { x: 0, y: 0 };
      this.isArrowVisible = false;
  }

  // Set canvas size based on level data
  setCanvasSize(dimensions) {
      this.canvas.width = dimensions.width;
      this.canvas.height = dimensions.height;
  }

  // Draw all obstacles (mirrors)
  drawObstacles() {
      if (!this.levelData) return;

      this.levelData.objects.forEach((obstacle) => {
          if (obstacle.type === "mirror") {
              this.ctx.fillStyle = "rgba(0, 255, 0, 0.8)"; // Green color for mirrors

              const mirrorWidth = obstacle.bottomRightPosition.x - obstacle.topLeftPosition.x;
              const mirrorHeight = obstacle.bottomRightPosition.y - obstacle.topLeftPosition.y;

              this.ctx.fillRect(obstacle.topLeftPosition.x, obstacle.topLeftPosition.y, mirrorWidth, mirrorHeight);
          }
      });
  }

  // Draw the photon at specific coordinates
  drawPhoton(x, y) {
      this.clearCanvas(); // Clear the previous frame
      this.drawObstacles(); // Redraw obstacles

      // Draw the photon
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, Math.PI * 2, true); // Photon as a small circle
      this.ctx.fillStyle = "yellow"; // Yellow color for the photon
      this.ctx.fill();
      this.ctx.closePath();

      // Optionally draw the arrow direction
      if (this.isArrowVisible) {
          this.drawArrow(this.arrowStart.x, this.arrowStart.y, this.arrowEnd.x, this.arrowEnd.y);
      }
  }

  // Clear the entire canvas
  clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Update the photon's position and redraw
  updatePhotonPosition(x, y) {
      this.photonPosition.x = x;
      this.photonPosition.y = y;
      this.drawPhoton(this.photonPosition.x, this.photonPosition.y);
  }

  // Draw an arrow representing the direction
  drawArrow(x1, y1, x2, y2) {
      this.ctx.strokeStyle = "red";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      // Draw arrowhead
      const headlen = 10; // length of head in pixels
      const angle = Math.atan2(y2 - y1, x2 - x1);
      this.ctx.beginPath();
      this.ctx.moveTo(x2, y2);
      this.ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
      this.ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
      this.ctx.lineTo(x2, y2);
      this.ctx.closePath();
      this.ctx.fillStyle = "red";
      this.ctx.fill();
  }

  // Handle mouse click to set the arrow direction
handleMouseClick(event, photonPosition) {
  const rect = this.canvas.getBoundingClientRect();

  // Calculate correct mouse coordinates relative to the canvas
  const scaleX = this.canvas.width / rect.width;
  const scaleY = this.canvas.height / rect.height;

  const mouseX = (event.clientX - rect.left) * scaleX;
  const mouseY = (event.clientY - rect.top) * scaleY;

  // Set the start of the arrow to the photon's position
  this.arrowStart.x = photonPosition.x;
  this.arrowStart.y = photonPosition.y;

  // Set the end of the arrow to the clicked position
  this.arrowEnd.x = mouseX;
  this.arrowEnd.y = mouseY;

  // Make the arrow visible
  this.isArrowVisible = true;

  // Redraw with the arrow
  this.updatePhotonPosition(photonPosition.x, photonPosition.y);
}


  // Hide the arrow after launching the photon
  hideArrow() {
      this.isArrowVisible = false;
      this.updatePhotonPosition(this.photonPosition.x, this.photonPosition.y); // Redraw without the arrow
  }

  // Calculate the normalized direction vector based on the arrow
  getLaunchDirection() {
      const dx = this.arrowEnd.x - this.arrowStart.x;
      const dy = this.arrowEnd.y - this.arrowStart.y;

      const magnitude = Math.sqrt(dx * dx + dy * dy);

      return {
          x: dx / magnitude,
          y: dy / magnitude
      };
  }
}
