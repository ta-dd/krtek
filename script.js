const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('start-button');
const downloadResultsButton = document.getElementById('download-results-button');
const restartButton = document.getElementById('restart-button');
const moleImage = document.getElementById('mole-image');
const averageReactionTimeDisplay = document.getElementById('average-reaction-time');
const moleContainer = document.getElementById('mole-container');

let currentRound = 0;
let reactionTimes = [];
let timerStart = 0;
let timeoutId;
let gameActive = false;
let clickAllowed = false;

const TOTAL_ROUNDS = 10;
const IMAGE_PATH = 'img/';
const HOLE_IMAGE = IMAGE_PATH + 'dira.png';
const MOLE_SNEAKING_IMAGE = IMAGE_PATH + 'ruce.png';
const MOLE_VISIBLE_IMAGE = IMAGE_PATH + 'krtzmrd.png';

function showScreen(screen) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    endScreen.classList.remove('active');
    screen.classList.add('active');
}

function startGame() {
    currentRound = 0;
    reactionTimes = [];
    gameActive = true;
    showScreen(gameScreen);
    nextRound();
}

function nextRound() {
    if (currentRound < TOTAL_ROUNDS) {
        currentRound++;
        moleImage.src = HOLE_IMAGE;
        clickAllowed = false; // Reset click permission for the new round
        moleContainer.onclick = null; // Remove previous click handler

        // Brief pause (1s) before displaying hole.png (already displayed)
        // Random delay (1-4s) before mole-sneaking.png
        const randomDelay = Math.random() * 3000 + 1000; // 1000ms to 4000ms
        timeoutId = setTimeout(() => {
            moleImage.src = MOLE_SNEAKING_IMAGE;
            // Fixed delay (700ms) before mole-visible.png
            timeoutId = setTimeout(() => {
                moleImage.src = MOLE_VISIBLE_IMAGE;
                timerStart = performance.now();
                clickAllowed = true;
                moleContainer.onclick = recordReaction; // Attach click handler when mole is visible
            }, 50); /* Reduced delay from 100ms to 10ms */
        }, randomDelay);
    } else {
        endGame();
    }
}

function recordReaction(event) {
    if (event.target.src.endsWith(MOLE_VISIBLE_IMAGE)) {
        if (clickAllowed) {
            const reactionTime = performance.now() - timerStart;
            reactionTimes.push(reactionTime);
            clickAllowed = false; // Prevent multiple clicks for the same round
            moleContainer.onclick = null; // Detach click handler immediately

            moleImage.src = MOLE_SNEAKING_IMAGE; // Show ruce.png
            setTimeout(() => {
                moleImage.src = HOLE_IMAGE; // Revert to hole.png
                setTimeout(() => {
                    nextRound(); // Next round after brief pause (500ms)
                }, 500);
            }, 200); // Short delay for ruce.png to be visible (e.g., 200ms)
        }
    } else {
        // If clicked too early, reset the round (as per user flow J -> I)
        clearTimeout(timeoutId); // Clear any pending timeouts
        moleImage.src = HOLE_IMAGE; // Reset image
        setTimeout(() => {
            nextRound(); // Restart the current round
        }, 1000); // Give a moment for the "Too Early!" message to be seen
    }
}

function endGame() {
    gameActive = false;
    clearTimeout(timeoutId);
    moleContainer.onclick = null; // Ensure no lingering click handlers

    const averageReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
    const averageReactionTimeFormatted = averageReactionTime ? averageReactionTime.toFixed(2) : 'N/A';

    // Calculate the reaction time with the largest deviation
    let maxDeviation = 0;
    let maxDeviationTime = null;
    reactionTimes.forEach(time => {
        const deviation = Math.abs(time - averageReactionTime);
        if (deviation > maxDeviation) {
            maxDeviation = deviation;
            maxDeviationTime = time;
        }
    });

    const maxDeviationTimeFormatted = maxDeviationTime !== null ? maxDeviationTime.toFixed(2) : 'N/A';

    averageReactionTimeDisplay.innerHTML = `Průměrná reakční doba: <strong>${averageReactionTimeFormatted} ms</strong>`;
    showScreen(endScreen);
}

function downloadCSV() {
    let csvContent = "Kolo,Reakční doba (ms)\n";
    reactionTimes.forEach((time, index) => {
        csvContent += `${index + 1},${time.toFixed(2)}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'reakcni_doby.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
downloadResultsButton.addEventListener('click', downloadCSV);

// Initial screen setup
showScreen(startScreen);