const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const pipButton = document.getElementById('pipButton');
const countdownDisplay = document.getElementById('countdown-display');
const pipVideo = document.getElementById('pipVideo');
const pipCanvas = document.getElementById('pipCanvas');
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
            drawOnCanvas();
        }
    }, 1000);

    updateDisplay();
    drawOnCanvas();
});

resetButton.addEventListener('click', () => {
    if (timer) {
        clearInterval(timer);
    }
    remainingTime = totalTime;
    updateDisplay();
    drawOnCanvas();
});

pipButton.addEventListener('click', async () => {
    try {
        pipVideo.srcObject = pipCanvas.captureStream();
        pipVideo.onloadedmetadata = () => {
            pipVideo.play();
            pipVideo.requestPictureInPicture();
        };
    } catch (error) {
        console.error('PiPモードに入れませんでした:', error);
    }
});

function updateDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    countdownDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function drawOnCanvas() {
    const context = pipCanvas.getContext('2d');
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const text = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    pipCanvas.width = 200; // Canvasの幅を設定
    pipCanvas.height = 100; // Canvasの高さを設定

    // 背景をクリア
    context.clearRect(0, 0, pipCanvas.width, pipCanvas.height);

    // 背景色を設定
    context.fillStyle = 'white';
    context.fillRect(0, 0, pipCanvas.width, pipCanvas.height);

    // テキストのスタイルを設定
    context.fillStyle = 'black';
    context.font = '48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // テキストをCanvasに描画
    context.fillText(text, pipCanvas.width / 2, pipCanvas.height / 2);
}

function showEndDialog() {
    alert("終了");
}
