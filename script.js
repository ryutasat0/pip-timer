const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');  // IDが 'time' であることを確認
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;
let canvas, context, videoStream, video;

function updateTimerDisplay() {
    if (timerDisplay) {  // timerDisplay が null でないかチェック
        const minutes = Math.floor(totalTimeInSeconds / 60);
        const seconds = totalTimeInSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = '48px Arial';
            context.fillStyle = '#000';
            context.fillText(timerDisplay.textContent, 10, 50);
        }
    } else {
        console.error('Timer display element not found');
    }
}

function startTimer() {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalTimeInSeconds = (minutes * 60) + seconds;

    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = 'Start';
    } else {
        if (totalTimeInSeconds > 0) {
            timerInterval = setInterval(() => {
                if (totalTimeInSeconds > 0) {
                    totalTimeInSeconds--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startButton.textContent = 'Start';
                    alert('タイマー終了');
                }
            }, 1000);
            isRunning = true;
            startButton.textContent = 'Stop';
        }
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startButton.textContent = 'Start';
    totalTimeInSeconds = 0;
    updateTimerDisplay();
}

function setupCanvasForPiP() {
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 100;
    context = canvas.getContext('2d');

    video = document.createElement('video');
    video.hidden = true;
    document.body.appendChild(video);

    videoStream = canvas.captureStream();
    video.srcObject = videoStream;
}

function togglePiP() {
    try {
        if (video && !document.pictureInPictureElement) {
            video.play().then(() => {
                return video.requestPictureInPicture();
            }).catch(error => {
                console.error('Failed to enable Picture-in-Picture mode:', error);
            });
        } else if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        }
    } catch (error) {
        console.error('Error in PiP:', error);
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

setupCanvasForPiP();  // 初期化時にキャンバスをセットアップ

updateTimerDisplay();  // 初期化時にタイマー表示をリセット
