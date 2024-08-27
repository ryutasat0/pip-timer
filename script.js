document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const pipButton = document.getElementById('pip');
    const timeDisplay = document.getElementById('time');
    const canvas = document.getElementById('canvas');
    const video = document.getElementById('video');
    const ctx = canvas.getContext('2d');

    let interval;
    let totalTime;

    startButton.addEventListener('click', function() {
        let minutes = parseInt(document.getElementById('minutes').value, 10);
        let seconds = parseInt(document.getElementById('seconds').value, 10);

        // NaNの場合は0に設定
        if (isNaN(minutes)) {
            minutes = 0;
        }
        if (isNaN(seconds)) {
            seconds = 0;
        }

        totalTime = (minutes * 60) + seconds;
        startTimer(totalTime);
    });

    resetButton.addEventListener('click', function() {
        clearInterval(interval);
        timeDisplay.textContent = "00:00";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "48px Arial";
        ctx.fillText("00:00", 50, 50);
    });

    pipButton.addEventListener('click', function() {
        video.srcObject = canvas.captureStream();
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            video.requestPictureInPicture();
        }
    });

    function startTimer(duration) {
        clearInterval(interval); // 既存のタイマーをリセット
        interval = setInterval(function() {
            let minutes = parseInt(duration / 60, 10);
            let seconds = parseInt(duration % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timeDisplay.textContent = minutes + ":" + seconds;

            // Canvasに時間を描画
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "48px Arial";
            ctx.fillText(minutes + ":" + seconds, 50, 50);

            if (--duration < 0) {
                clearInterval(interval);
                alert("タイマー終了");
            }
        }, 1000);
    }
});
