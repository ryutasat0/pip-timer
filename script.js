
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const pipButton = document.getElementById('pip');
const timerDisplay = document.getElementById('time');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let timerInterval;
let totalTimeInSeconds = 0;
let isRunning = false;
let isPaused = false;
let canvas, context, videoStream, video;

function updateTimerDisplay() {
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (context) {
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '48px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(timerDisplay.textContent, canvas.width / 2, canvas.height / 2);
    }
}

function startTimer() {
    if (isPaused) {
        isPaused = false;
        isRunning = true;
        stopButton.textContent = "Stop";
        timerInterval = setInterval(() => {
            if (totalTimeInSeconds > 0) {
                totalTimeInSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                stopButton.textContent = "Stop";
                alert("タイマー終了");
            }
        }, 1000);
    } else if (!isRunning) {
        const minutes = parseInt(minutesInput.value);
        const seconds = parseInt(secondsInput.value);

        if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0 || (minutes === 0 && seconds === 0)) {
            alert("Please enter a valid time.");
            return;
        }

        totalTimeInSeconds = minutes * 60 + seconds;
        isRunning = true;
        stopButton.textContent = "Stop";

        timerInterval = setInterval(() => {
            if (totalTimeInSeconds > 0) {
                totalTimeInSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                stopButton.textContent = "Stop";
                alert("タイマー終了");
            }
        }, 1000);
    }
}

function stopTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = true;
        stopButton.textContent = "Restart";
    } else if (isPaused) {
        startTimer();
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = false;
    totalTimeInSeconds = 0;
    updateTimerDisplay();
    stopButton.textContent = "Stop";
}

function togglePiP() {
    if (document.pictureInPictureEnabled) {
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
    } else {
        alert("PiP is not supported on this device.");
    }
}

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
pipButton.addEventListener('click', togglePiP);

window.onload = () => {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    video = document.getElementById('video');
    
    videoStream = canvas.captureStream();
    video.srcObject = videoStream;

    updateTimerDisplay();
};
