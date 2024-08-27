const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;
let canvas, context, videoStream, video;

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // PiP用のCanvasに描画
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '48px Arial';
        context.fillStyle = '#000';
        context.fillText(timerDisplay.textContent, 10, 50);
    }
}

function startTimer() {
    if (isRunning) return;

    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalTimeInSeconds = minutes * 60 + seconds;

    if (totalTimeInSeconds <= 0) return;

    isRunning = true;
    timerInterval = setInterval(() => {
        if (totalTimeInSeconds > 0) {
            totalTimeInSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert('タイマー終了');
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalTimeInSeconds = 0;
    updateTimerDisplay();
}

function initPiP() {
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    context = canvas.getContext('2d');

    videoStream = canvas.captureStream();
    video = document.createElement('video');
    video.srcObject = videoStream;
    video.play();
}

pipButton.addEventListener('click', async () => {
    if (!document.pictureInPictureElement) {
        if (!video) {
            initPiP();
        }
        try {
            await video.requestPictureInPicture();
        } catch (error) {
            console.error('PiP failed', error);
        }
    } else {
        document.exitPictureInPicture();
    }
});

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// 初期表示を0:00に設定
updateTimerDisplay();
