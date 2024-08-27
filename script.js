const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('timer');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;

// Canvas設定
let canvas = document.createElement('canvas');
canvas.width = 200;
canvas.height = 100;
let context = canvas.getContext('2d');

// Video設定
let videoStream = canvas.captureStream();
let video = document.createElement('video');
video.srcObject = videoStream;
video.play();

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // タイマー表示を更新
    timerDisplay.textContent = timeString;
    
    // Canvasにタイマーを描画
    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '48px Arial';
        context.fillStyle = '#000';
        context.fillText(timeString, 10, 50);
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    totalTimeInSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
    updateTimerDisplay(); // 初期表示を更新
    timerInterval = setInterval(() => {
        totalTimeInSeconds--;
        updateTimerDisplay();
        if (totalTimeInSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert('終了');
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
            await video.requestPictureInPicture();
        } catch (error) {
            console.error('PiPモードへの切り替えに失敗しました:', error);
        }
    } else {
        document.exitPictureInPicture();
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

updateTimerDisplay(); // 初期表示を更新
