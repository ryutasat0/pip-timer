const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('timer'); 
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

    if (totalTimeInSeconds > 0) {
        isRunning = true;
        timerInterval = setInterval(() => {
            totalTimeInSeconds--;
            updateTimerDisplay();

            if (totalTimeInSeconds <= 0) {
                clearInterval(timerInterval);
                isRunning = false;
                alert('タイマー終了');
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalTimeInSeconds = 0;
    updateTimerDisplay();
}

function initPiP() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 100;

    video = document.createElement('video');
    video.srcObject = canvas.captureStream();
    video.play();

    pipButton.addEventListener('click', async () => {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else if (video.requestPictureInPicture) {
                await video.requestPictureInPicture();
            } else {
                alert('このブラウザはPiPをサポートしていません');
            }
        } catch (error) {
            console.error('PiPの起動に失敗しました:', error);
        }
    });

    updateTimerDisplay();  // 初期表示を更新
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
document.addEventListener('DOMContentLoaded', initPiP);
