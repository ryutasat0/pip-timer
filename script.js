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

// video設定
let video = document.getElementById('video');
let videoStream = canvas.captureStream(60);  // 60FPSでのキャプチャ

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = timeString;

    // canvasに描画
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#FFF';  // 背景を白に設定
    context.fillRect(0, 0, canvas.width, canvas.height);  // 背景色で塗りつぶし

    context.font = '48px Arial';  // フォントサイズを設定
    context.fillStyle = '#000';  // テキスト色を黒に設定
    context.fillText(timeString, 50, 50);  // キャンバスにテキストを描画
}

function startTimer() {
    if (isRunning) return;

    totalTimeInSeconds = parseInt(minutesInput.value || 0) * 60 + parseInt(secondsInput.value || 0);
    if (isNaN(totalTimeInSeconds) || totalTimeInSeconds <= 0) return;

    isRunning = true;
    updateTimerDisplay();

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
        updateTimerDisplay();  // PiP開始前にキャンバスを更新

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

// 初期表示を更新
window.onload = updateTimerDisplay;
