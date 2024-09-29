import { CanvasManager } from "./canvasManager.js";
import { LevelManager } from "./levelManager.js";

// Initialize the CanvasManager and LevelManager
const canvasManager = new CanvasManager("gameCanvas");
const levelManager = new LevelManager();

let isLaunchConfirmed = false; // Track if launch is confirmed

// Load the level data and initialize the game
function startGame(levelNumber) {
    const levelJson = `levels/level_${levelNumber}.json`;
    levelManager.loadLevel(levelJson).then(() => {
        canvasManager.setCanvasSize(levelManager.levelData.dimensions);
        canvasManager.levelData = levelManager.levelData;
        canvasManager.updatePhotonPosition(levelManager.photon.pos.x, levelManager.photon.pos.y);

        // Listen for mouse clicks to set the launch direction
        canvasManager.canvas.addEventListener('click', handleMouseClick);

        // Listen for spacebar to confirm launch
        document.addEventListener('keydown', handleSpacebarPress);
    }).catch(error => {
        console.error("Failed to load level:", error);
    });
}

// Handle mouse click to calculate the launch direction
function handleMouseClick(event) {
    // Delegate the arrow drawing and direction handling to the CanvasManager
    canvasManager.handleMouseClick(event, levelManager.photon.pos);
}

// Handle spacebar press to confirm the launch
function handleSpacebarPress(event) {
    if (event.code === 'Space' && !isLaunchConfirmed) {
        isLaunchConfirmed = true;

        // Set the photon's speed based on the calculated launch direction (constant magnitude)
        const direction = canvasManager.getLaunchDirection();
        const speed = 2; // Constant speed
        levelManager.photon.xspeed = direction.x * speed;
        levelManager.photon.yspeed = direction.y * speed;

        console.log("Launch confirmed. Photon speed set.");

        // Hide the arrow after launching
        canvasManager.hideArrow();

        // Start the timer
        startTimer();

        // Remove event listeners after the launch
        canvasManager.canvas.removeEventListener('click', handleMouseClick);
        document.removeEventListener('keydown', handleSpacebarPress);

        // Start the animation loop
        requestAnimationFrame(gameLoop);
    }
}

// Animation loop function
function gameLoop() {
    // Update the photon position and handle collisions
    levelManager.update();

    // Update the photon's position on the canvas
    canvasManager.updatePhotonPosition(levelManager.photon.pos.x, levelManager.photon.pos.y);

    // Continue the loop if the photon is launched
    if (isLaunchConfirmed) {
        requestAnimationFrame(gameLoop);
    }
}

// Timer functionality (starts after pressing spacebar)
let startTime;
let timerInterval;
const timerElement = document.getElementById('timer');

function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(updateTimer, 100); // Update every 100ms
}

function updateTimer() {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime) * 1e6; // Time in nanoseconds
    timerElement.textContent = formatTime(elapsedTime);
}

function formatTime(ns) {
    const seconds = Math.floor((ns / 1e9) % 60);
    const minutes = Math.floor((ns / (1e9 * 60)) % 60);
    const milliseconds = Math.floor((ns % 1e9) / 1e6);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 100 ? '0' : ''}${milliseconds}`;
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

// Add event listeners for level buttons
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.level-selection button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const levelId = button.id; // e.g., "level1", "level2"
            const levelNumber = levelId.replace('level', ''); // Extract the number (e.g., "1")
            console.log(`Loading level ${levelNumber}`);
            startGame(levelNumber); // Start the selected level
        });
    });
});
