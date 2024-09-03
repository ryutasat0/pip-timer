const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');
const minutesSelect = document.getElementById('minutes');
const secondsSelect = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;
let canvas, context, videoStream, video;

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height); // 画面をクリア
        context.font = '48px Arial';
        context.fillStyle = '#FFF'; // 色を白に変更
        context.fillText(timerDisplay.textContent, 10, 50); // テキストを描画
    }
}

function startTimer() {
    if (isRunning) return;

    const minutes = parseInt(minutesSelect.value);
    const seconds = parseInt(secondsSelect.value);

    if ((minutes === 0 && seconds === 0)) {
        alert("Please select a valid time.");
        return;
    }

    totalTimeInSeconds = minutes * 60 + seconds;
    isRunning = true;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (totalTimeInSeconds > 0) {
            totalTimeInSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert("タイマー終了");
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    totalTimeInSeconds = 0;
    updateTimerDisplay();
}

function togglePiP() {
    if (!document.pictureInPictureElement) {
        video.play().then(() => {
            video.requestPictureInPicture().catch(error => {
                console.error("PiP failed: ", error);
            });
        }).catch(error => {
            console.error("Video play failed: ", error);
        });
    } else {
        document.exitPictureInPicture();
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

window.onload = () => {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    video = document.getElementById('video');
    
    videoStream = canvas.captureStream();
    video.srcObject = videoStream;

    // 初期状態でCanvasにタイマーの初期値を表示
    updateTimerDisplay();
};
