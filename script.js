const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;

// canvasとcontextの設定
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

// canvasのサイズを調整
canvas.width = 640;  // PiPモードでも高解像度に対応
canvas.height = 360;

// video設定
let video = document.getElementById('video');
let videoStream = canvas.captureStream(30);  // 30FPSでのキャプチャ

// 初期表示の描画
function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = timeString;

    // canvasに描画
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '96px Arial';  // フォントサイズを大きくして、画質を向上
    context.fillStyle = '#000';
    context.fillText(timeString, 120, 200);  // 中央に描画するために位置を調整
}

function startTimer() {
    if (isRunning) return;

    totalTimeInSeconds = parseInt(minutesInput.value || 0) * 60 + parseInt(secondsInput.value || 0);
    if (isNaN(totalTimeInSeconds) || totalTimeInSeconds <= 0) return;

    isRunning = true;
    updateTimerDisplay(); // タイマーをスタートするときに一度表示を更新

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
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            video.srcObject = videoStream;
            await video.play();
            await video.requestPictureInPicture();
        }
    } catch (error) {
        console.error('PiPモードへの切り替えに失敗しました:', error);
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

// ページがロードされたときに初期描画を行う
window.onload = updateTimerDisplay;
