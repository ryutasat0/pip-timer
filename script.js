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
    isRunning = true;

    totalTimeInSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        totalTimeInSeconds--;
        updateTimerDisplay();

        if (totalTimeInSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            alert("タイマーが終了しました！");
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
    if (!video) {
        video = document.createElement('video');
        video.style.display = 'none';
        document.body.appendChild(video);

        canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        context = canvas.getContext('2d');

        videoStream = canvas.captureStream();
        video.srcObject = videoStream;
    }

    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
        video.play().then(() => {
            video.requestPictureInPicture().catch(error => {
                console.error('PiPの開始に失敗しました:', error);
            });
        });
    }
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

updateTimerDisplay();
