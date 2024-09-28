let startTime;
let elapsedTime = 0; //in nanoseconds
const timerElement = document.getElementById('timer');

function startTimer() {
    startTime = performance.now();
    let timerInterval;
    timerInterval = setInterval(updateTimer);
}

function updateTimer() {
    const currentTime = performance.now();
    elapsedTime = (currentTime - startTime) * 1e6; // Time in nanoseconds
    timerElement.textContent = formatTime(elapsedTime);
}

function formatTime(ns) {
    const seconds = Math.floor((ns / 1e9) % 60);
    const minutes = Math.floor((ns / (1e9 * 60)) % 60);
    const milliseconds = Math.floor((ns % 1e9) / 1e6);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds < 100 ? '0' : ''}${milliseconds}`;
    // return `${ns.toFixed(0)} ns`;
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

function startLevel(levelNumber) {
    // Load the level data and start the game logic
    console.log(`Starting level ${levelNumber}`);
    startTimer(); // Start the timer when the level starts
}

function endLevel() {
    // Logic to handle level completion
    stopTimer();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.level-btn').forEach(button => {
      button.addEventListener('click', () => {
        const level = button.getAttribute('data-level');
        startLevel(level); 
      });
    });
  });

//   function gameLoop() {
//     // game logic
// }

// gameLoop();

startTimer();