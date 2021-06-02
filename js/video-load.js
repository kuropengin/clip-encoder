const input_video_preview = document.getElementById('input-video-preview');
const output_video_preview = document.getElementById('output-video-preview');
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
var config_check = false;
var input_video_file = null;
var input_video_time = null;
var output_video_time = null;
var start_video_time = null;
var stop_video_time = null;
var resolution = null;
var file_size = null;
var video_bitrate = null;
var audio_bitrate = null;
var framerate = null;
var start_encode_time = null;





async function load_video({ target: { files } }) {
    input_video_file = files;
    input_video_preview.src = URL.createObjectURL(
        new Blob(
            [input_video_file[0]],
            { type: 'video/mp4' }
        )
    );
    await sleep(1000);
    input_video_time = input_video_preview.duration;

    var mr = document.querySelector("multi-range");
    mr.step = 100 / (input_video_time * 100);
    console.log(input_video_time);
    change_multi_range();

    input_video_preview.currentTime = 0;
}


async function drop_load_video({ dataTransfer: { files } }) {
    input_video_file = files;
    input_video_preview.src = URL.createObjectURL(
        new Blob(
            [input_video_file[0]],
            { type: 'video/mp4' }
        )
    );
    await sleep(1000);
    input_video_time = input_video_preview.duration;

    var mr = document.querySelector("multi-range");
    mr.step = 100 / (input_video_time * 100);
    console.log(input_video_time);
    change_multi_range();

    input_video_preview.currentTime = 0;
}




const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
    log: false,
    logger: log => show_log(log),
});





function show_log(log) {
    let temp = log["message"];
    let frame = null;
    if (temp.indexOf("frame") != -1 && temp.indexOf("fps") != -1 && temp.indexOf("speed") != -1) {
        frame = parseInt(temp.replace(/(\s|&nbsp;)+/g, " ").split(" ")[1]);
        let progress = parseInt((frame / Math.ceil(output_video_time * framerate)) * 100);
        bar.animate(progress / 100);
        document.getElementById('encode-percent').textContent = progress;
    }
    //console.log(log);


}
function calculation_remaining_time(progress) {
    let elapsed_time = new Date().getTime() - start_encode_time;
    elapsed_time = elapsed_time / 1000;
    return (elapsed_time / progress) * (100 - progress)
}

function calculation_resolution(bitrate) {
    bitrate = parseFloat(bitrate);
    const resolution_list = {
        400: "480x270",
        800: "640x360",
        1200: "960x540",
        1500: "1280x720",
        4000: "1920x1080"
    }
    let result = "480x270";
    for (let key in resolution_list) {
        if (key < bitrate) {
            result = resolution_list[key];
        }
    }
    return result;

}
function calculation_bitrate(file_size, video_time) {
    file_size = parseFloat(file_size);
    video_time = parseFloat(video_time);
    return parseInt((file_size * 8192) / video_time);
}

function get_encode_setting() {

    const _start = document.getElementById("start_time").value.split(":");
    const _stop = document.getElementById("stop_time").value.split(":");
    start_video_time = parseInt(_start[0] * 60 * 60) + parseInt(_start[1] * 60) + parseFloat(_start[2]);
    stop_video_time = parseInt(_stop[0] * 60 * 60) + parseInt(_stop[1] * 60) + parseFloat(_stop[2]);
    output_video_time = stop_video_time - start_video_time;

    let _message = "";
    config_check = false;
    if (input_video_time === null) {
        _message = "エラー:動画を選択してください\n";
        error_display_on(_message);
    }
    else if (start_video_time < 0 || start_video_time > input_video_time) {
        _message = "エラー:切り抜き開始時刻が不正です\n";
        error_display_on(_message);
    }
    else if (stop_video_time < 0 || stop_video_time > input_video_time) {
        _message = "エラー:切り抜き終了時刻が不正です\n";
        error_display_on(_message);
    }
    else if ((stop_video_time - start_video_time) < 0) {
        _message = "エラー:切り出し範囲が不正です\n";
        error_display_on(_message);
    }
    else if ((stop_video_time - start_video_time) < 0.1) {
        _message = "エラー:切り出し範囲が小さすぎます\n";
        error_display_on(_message);
    }
    else {
        _message = "設定が完了したら、「エンコードを開始」をクリックしてください\n";
        config_check = true;
        error_display_off();
    }
    //ビットレート計算
    let temp = null;

    //ファイルサイズ取得
    filesize = parseFloat(document.getElementById("filesize").value);

    //音声ビットレート取得
    temp = document.getElementById("audio-bitrate").value;
    if (temp == "auto" || temp == "" || temp == "0") {
        audio_bitrate = 64;
    } else {
        audio_bitrate = parseInt(temp);
    }

    //映像ビットレート計算
    temp = document.getElementById("video-bitrate").value;
    if (temp == "auto" || temp == "" || temp == "0") {
        video_bitrate = calculation_bitrate(filesize, output_video_time) - audio_bitrate;
    } else {
        video_bitrate = parseInt(temp);
    }

    //解像度計算
    temp = document.getElementById("resolution").value;
    if (temp == "auto") {
        resolution = calculation_resolution(video_bitrate);
    } else {
        resolution = temp;
    }

    //フレームレート読み込み
    framerate = parseInt(document.getElementById("framerate").value);
    console.log(_message);
}


async function encode() {
    //設定状況の読み込み
    get_encode_setting();
    if (!config_check) {
        return
    }
    console.log('エンコードを開始します');
    next_page();
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }
    const input_video_file_name = "input"
    ffmpeg.FS(
        "writeFile",
        input_video_file_name,
        await fetchFile(input_video_file[0])
    );
    start_encode_time = new Date().getTime();
    await ffmpeg.run(
        '-ss', "" + start_video_time,
        '-to', "" + stop_video_time,
        '-i', input_video_file_name,
        '-s', resolution,
        '-b:v', video_bitrate + 'k',
        '-bufsize', (file_size + 1) + 'M',
        '-ab', audio_bitrate + 'k',
        '-vf', 'framerate=' + framerate,
        'output.mp4'
    );
    start_encode_time = null;
    console.log('エンコードが完了しました。「エンコード済みの動画」を確認してください');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    let output_blob = new Blob([data.buffer], { type: 'video/mp4' });
    let url = URL.createObjectURL(output_blob);
    output_video_preview.src = url;
    var a = document.getElementById('a_download');
    a.href = url;
    a.download = "(エンコード済み)" + input_video_file[0].name;
    ffmpeg.FS("unlink", input_video_file_name);
    ffmpeg.FS("unlink", "output.mp4");

    await sleep(1000);
    next_page();
}
document.getElementById('uploader').addEventListener('change', load_video);
document.getElementById('drag-area').addEventListener('drop', drop_load_video);
document.getElementById('start_time').addEventListener('change', get_encode_setting);
document.getElementById('stop_time').addEventListener('change', get_encode_setting);
document.getElementById('start-encode').addEventListener('click', encode);


input_video_preview.controls = false;
input_video_preview.addEventListener("mouseover", function (event) {
    input_video_preview.controls = true;
});

input_video_preview.addEventListener("mouseout", function (event) {
    input_video_preview.controls = false;
});