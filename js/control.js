var fileArea = document.getElementById('drag-area');
var fileInput = document.getElementById('uploader');

fileArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    fileArea.classList.add('dragover');
});

fileArea.addEventListener('dragleave', function (e) {
    e.preventDefault();
    fileArea.classList.remove('dragover');
});


fileArea.addEventListener('drop', function (e) {
    e.preventDefault();
    fileArea.classList.remove('dragover');

    var files = e.dataTransfer.files;

    fileInput.files = files;
    var file = files[0];
    if (typeof e.dataTransfer.files[0] !== 'undefined') {
        if (file.type.match("video.*") || file.type.match("image.gif")) {
            cutRange.classList.remove('display-none');
            error_display_off();
        }
        else {
            cutRange.classList.add('display-none');
            error_display_on("動画を選択してください");
        }
    } else {
        cutRange.classList.add('display-none');
        error_display_on("ファイルが選択されませんでした");
    }

});


var cutRange = document.getElementById('cut-slider');
var message = document.getElementById('message');
var message_text = document.getElementById('message-text');

fileInput.addEventListener('change', function (e) {
    var file = e.target.files[0];

    if (typeof e.target.files[0] !== 'undefined') {
        if (file.type.match("video.*") || file.type.match("image.gif")) {
            cutRange.classList.remove('display-none');
            error_display_off();
        }
        else {
            cutRange.classList.add('display-none');
            error_display_on("動画を選択してください");
        }
    } else {
        cutRange.classList.add('display-none');
        error_display_on("ファイルが選択されませんでした");
    }
});


var bitRate = document.getElementById('video-bitrate');
bitRate.addEventListener('change', function () {
    if (bitRate.value != "" && parseFloat(bitRate.value) > 0) {
        document.getElementById('filesize-area').classList.add('input-readonly');
        document.getElementById('filesize').classList.add('input-readonly');
        document.getElementById('filesize').readOnly = true;
    }
    else {
        document.getElementById('filesize-area').classList.remove('input-readonly');
        document.getElementById('filesize').classList.remove('input-readonly');
        document.getElementById('filesize').readOnly = false;
    }
});

var elm_do_encode = document.getElementById('do-encode');
elm_do_encode.addEventListener('change', function () {
    if (elm_do_encode.value == "true") {
        document.getElementById('resolution').classList.remove('input-readonly');
        document.getElementById('framerate').classList.remove('input-readonly');
        document.getElementById('filesize-area').classList.remove('input-readonly');
        document.getElementById('filesize').classList.remove('input-readonly');
        document.getElementById('video-bitrate').classList.remove('input-readonly');
        document.getElementById('audio-bitrate').classList.remove('input-readonly');
        document.getElementById('resolution').disabled = false;
        document.getElementById('framerate').readOnly = false;
        document.getElementById('filesize-area').readOnly = false;
        document.getElementById('filesize').readOnly = false;
        document.getElementById('video-bitrate').readOnly = false;
        document.getElementById('audio-bitrate').readOnly = false;
        document.getElementById("predicted_filesize").value = "エンコードをしない場合に表示";
    }
    else {
        document.getElementById('resolution').classList.add('input-readonly');
        document.getElementById('framerate').classList.add('input-readonly');
        document.getElementById('filesize-area').classList.add('input-readonly');
        document.getElementById('filesize').classList.add('input-readonly');
        document.getElementById('video-bitrate').classList.add('input-readonly');
        document.getElementById('audio-bitrate').classList.add('input-readonly');
        document.getElementById('resolution').disabled = true;
        document.getElementById('framerate').readOnly = true;
        document.getElementById('filesize-area').readOnly = true;
        document.getElementById('filesize').readOnly = true;
        document.getElementById('video-bitrate').readOnly = true;
        document.getElementById('audio-bitrate').readOnly = true;
        document.getElementById("predicted_filesize").value = ((input_video_file.size / (1024 ** 2)) / input_video_time) * output_video_time;

    }
});

function error_display_on(text) {
    message_text.textContent = text;
    message.classList.remove('display-none');
}

function error_display_off() {
    message.classList.add('display-none');
}

