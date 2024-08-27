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

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    if (context) {
        // Canvasのサイズを設定
        canvas.width = 200; // 必要に応じて調整
        canvas.height = 100; // 必要に応じて調整

        // 背景をクリア
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // テキストを描画
        context.font = '48px Arial';
        context.fillStyle = '#000';
        context.fillText(timerDisplay.textContent, 10, 50);
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    totalTimeInSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
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
            if (!video.srcObject) {
                video.srcObject = videoStream;
                video.play();
            }
            await video.requestPictureInPicture();
        } catch (error) {
            console.error('Failed to enter Picture-in-Picture mode:', error);
        }
    } else {
        document.exitPictureInPicture();
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

updateTimerDisplay(); // 初期表示を更新
