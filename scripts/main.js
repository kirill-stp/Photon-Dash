import { CanvasManager } from "./canvasManager.js";
import { LevelManager } from "./levelManager.js";

// Initialize the CanvasManager and LevelManager
const canvasManager = new CanvasManager("gameCanvas");
const levelManager = new LevelManager();

// Load the level data and initialize the game
function startGame(levelNumber) {
    const levelJson = `levels/level_${levelNumber}.json`; // Dynamically load the level based on the number
    levelManager.loadLevel(levelJson).then(() => {
        // Set canvas size based on level data
        canvasManager.setCanvasSize(levelManager.levelData.dimensions);

        // Pass level data to CanvasManager to draw obstacles
        canvasManager.levelData = levelManager.levelData;
        canvasManager.drawObstacles();

        // Set the initial photon position on the canvas
        canvasManager.updatePhotonPosition(levelManager.photon.pos.x, levelManager.photon.pos.y);

        // Start the animation loop
        requestAnimationFrame(gameLoop);

        // Start the timer
        startTimer();
    }).catch(error => {
        console.error("Failed to load level:", error);
    });
}

// Animation loop function
function gameLoop() {
    // Update the photon position and handle collisions
    levelManager.update();

    // Update the photon's position on the canvas
    canvasManager.updatePhotonPosition(levelManager.photon.pos.x, levelManager.photon.pos.y);

    // Continue the loop
    requestAnimationFrame(gameLoop);
}

// Timer functionality (same as before)
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