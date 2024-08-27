let timer;
let isRunning = false;
let remainingTime = 0;

const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const pipButton = document.getElementById('pipButton');
const countdownDisplay = document.getElementById('countdown-display');

startButton.addEventListener('click', () => {
    if (isRunning) return;

    const minutes = parseInt(document.getElementById('minutes').value, 10) || 0;
    const seconds = parseInt(document.getElementById('seconds').value, 10) || 0;
    remainingTime = (minutes * 60) + seconds;

    if (remainingTime > 0) {
        isRunning = true;
        startTimer();
    }
});

resetButton.addEventListener('click', () => {
    clearInterval(timer);
    isRunning = false;
    countdownDisplay.textContent = "00:00";
});

pipButton.addEventListener('click', () => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
        countdownDisplay.requestPictureInPicture()
        .catch(error => {
            console.error('PiPにできません:', error);
        });
    }
});

function startTimer() {
    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            isRunning = false;
            alert("Time's up!");
        } else {
            remainingTime--;
            updateDisplay();
        }
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
