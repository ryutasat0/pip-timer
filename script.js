const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const alarmToggle = document.getElementById('alarmToggle');
const alarmSound = document.getElementById('alarmSound'); // アラーム音要素の取得

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

    totalTimeInSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
    if (isNaN(totalTimeInSeconds) || totalTimeInSeconds <= 0) {
        alert("Please enter a valid time.");
        return;
    }

    isRunning = true;
    timerInterval = setInterval(() => {
        if (totalTimeInSeconds > 0) {
            totalTimeInSeconds--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert("タイマー終了");

            // アラーム音の再生（トグルがオンの時のみ）
            if (alarmToggle.checked) {
                alarmSound.play();
            }
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
};

// アラーム音のロード（初回の再生時の遅延防止）
alarmSound.load();
