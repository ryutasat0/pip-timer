// 必要な要素を取得
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

// 解像度を調整
canvas.width = 640; // 横幅を640pxに設定
canvas.height = 360; // 高さを360pxに設定

let videoStream = canvas.captureStream();

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (context) {
        // 高解像度で描画
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '96px Arial'; // 大きめのフォントサイズで描画
        context.fillStyle = '#000';
        context.fillText(timerDisplay.textContent, canvas.width / 4, canvas.height / 2);
    }
}

function startTimer() {
    if (isRunning) return;

    totalTimeInSeconds = parseInt(minutesInput.value || 0) * 60 + parseInt(secondsInput.value || 0);
    if (isNaN(totalTimeInSeconds) || totalTimeInSeconds <= 0) return;

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

async function togglePiP() {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else {
        video.srcObject = videoStream;
        await video.play();
        await video.requestPictureInPicture();
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);
