const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let video = document.getElementById('video');
let videoStream = canvas.captureStream();

video.srcObject = videoStream;

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "96px Arial";
    context.fillStyle = "#000";
    context.fillText(timerDisplay.textContent, 10, 150);
}

function startTimer() {
    if (isRunning) return;

    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalTimeInSeconds = minutes * 60 + seconds;

    if (totalTimeInSeconds <= 0) return;

    isRunning = true;
    timerInterval = setInterval(() => {
        totalTimeInSeconds--;
        updateTimerDisplay();

        if (totalTimeInSeconds <= 0) {
            clearInterval(timerInterval);
            alert("タイマー終了");
            isRunning = false;
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalTimeInSeconds = 0;
    updateTimerDisplay();
}

async function togglePiP() {
    if (!document.pictureInPictureElement) {
        try {
            await video.play();
            await video.requestPictureInPicture();
        } catch (error) {
            console.error("PiPモードへの切り替えに失敗しました:", error);
        }
    } else {
        document.exitPictureInPicture();
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

updateTimerDisplay();
