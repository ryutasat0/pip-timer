const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('timer');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;
let canvas = document.createElement('canvas');
let context = canvas.getContext('2d');
let videoStream = canvas.captureStream();
let video = document.createElement('video');
video.srcObject = videoStream;
video.play();

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // キャンバスの解像度を調整
    const scaleFactor = 2;  // 解像度を2倍に
    canvas.width = 200 * scaleFactor;
    canvas.height = 100 * scaleFactor;
    context.scale(scaleFactor, scaleFactor);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '48px Arial';
    context.fillStyle = '#000';
    context.fillText(timerDisplay.textContent, 10, 50);
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    totalTimeInSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
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
    totalTimeInSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
    updateTimerDisplay();
}

async function togglePiP() {
    try {
        if (video !== document.pictureInPictureElement) {
            await video.requestPictureInPicture();
        } else {
            await document.exitPictureInPicture();
        }
    } catch (error) {
        console.error('PiPモードの切り替えに失敗しました:', error);
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

resetTimer();  // 初期状態のタイマーをセット
