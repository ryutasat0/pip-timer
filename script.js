document.getElementById('startButton').addEventListener('click', function() {
    const minutes = parseInt(document.getElementById('minutes').value, 10);
    const seconds = parseInt(document.getElementById('seconds').value, 10);

    if (isNaN(minutes) || isNaN(seconds)) {
        alert('Please enter valid numbers for minutes and seconds.');
        return;
    }

    let time = minutes * 60 + seconds;
    const countdownDisplay = document.getElementById('countdown-display');

    const countdownInterval = setInterval(() => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        countdownDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
        
        if (time === 0) {
            clearInterval(countdownInterval);
            alert('タイマー終了');
        }

        time--;
    }, 1000);
});

document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
    document.getElementById('countdown-display').textContent = '00:00';
});

// PiPボタンのイベントリスナー
document.getElementById('pipButton').addEventListener('click', function() {
    const video = document.getElementById('pipVideo');
    if (!document.pictureInPictureElement) {
        video.requestPictureInPicture();
    } else {
        document.exitPictureInPicture();
    }
});

// PiP用のキャンバスをビデオに変換する部分
function updateCanvas() {
    const canvas = document.getElementById('pipCanvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // タイマーの数字をキャンバスに描画
    const countdownDisplay = document.getElementById('countdown-display').textContent;
    context.font = '48px Arial';
    context.fillStyle = 'black';
    context.fillText(countdownDisplay, 10, 50);

    const video = document.getElementById('pipVideo');
    video.srcObject = canvas.captureStream();
}

// PiPの表示を更新するためのインターバル
setInterval(updateCanvas, 1000);
