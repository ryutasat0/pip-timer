const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const pipButton = document.getElementById('pipButton');
const countdownDisplay = document.getElementById('countdown-display');
let timer;
let totalTime;
let remainingTime;

startButton.addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes').value, 10);
    const seconds = parseInt(document.getElementById('seconds').value, 10);
    totalTime = (minutes * 60) + seconds;
    remainingTime = totalTime;

    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            showEndDialog();
        } else {
            remainingTime--;
            updateDisplay();
        }
    }, 1000);

    updateDisplay();
});

resetButton.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
    }
    remainingTime = totalTime;
    updateDisplay();
});

pipButton.addEventListener('click', async () => {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else {
        try {
            await countdownDisplay.requestPictureInPicture();
        } catch (error) {
            console.error('PiPモードに入れませんでした:', error);
        }
    }
});

function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showEndDialog() {
    alert("終了");
}
