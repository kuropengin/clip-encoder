
const v = document.getElementById('input-video-preview');

const start_time = document.getElementById('start_time');
const stop_time = document.getElementById('stop_time');


const start_range = document.getElementById('start-range');
const stop_range = document.getElementById('stop-range');

var v_min = 0;
var v_max = 100;

function change_start_range(){
    this.value=Math.min(this.value,this.parentNode.childNodes[5].value-1);
    var value=(100/(parseFloat(this.max)-parseInt(this.min)))*parseFloat(this.value)-(100/(parseFloat(this.max)-parseInt(this.min)))*parseFloat(this.min);
    var children = this.parentNode.childNodes[1].childNodes;
    children[1].style.width=value+'%';
    children[5].style.left=value+'%';
    children[7].style.left=value+'%';
}

function change_stop_range(){
    this.value=Math.max(this.value,this.parentNode.childNodes[3].value-(-1));
    var value=(100/(parseFloat(this.max)-parseInt(this.min)))*parseFloat(this.value)-(100/(parseFloat(this.max)-parseInt(this.min)))*parseFloat(this.min);
    var children = this.parentNode.childNodes[1].childNodes;
    children[3].style.width=(100-value)+'%';
    children[5].style.right=(100-value)+'%';
    children[9].style.left=value+'%';
}

start_range.addEventListener('input', change_start_range);
stop_range.addEventListener('input', change_stop_range);
start_range.addEventListener('input', change_multi_range);
stop_range.addEventListener('input', change_multi_range);


function set_value_multi_range(set_min,set_max){
    var set_value = Math.min(set_min,set_max);
    start_range.value = set_value;
    var children = start_range.parentNode.childNodes[1].childNodes;
    children[1].style.width=set_value+'%';
    children[5].style.left=set_value+'%';
    children[7].style.left=set_value+'%';

    v_min = set_value;


    set_value = Math.max(set_min,set_max);
    stop_range.value = set_value;
    children = stop_range.parentNode.childNodes[1].childNodes;
    children[3].style.width=(100-set_value)+'%';
    children[5].style.right=(100-set_value)+'%';
    children[9].style.left=set_value+'%';

    v_max = set_value;

}


function set_step_multi_range(set_step){
    start_range.step = set_step;
    stop_range.step = set_step;
}



function change_multi_range() {
    if(v_min != start_range.value){
        v.currentTime = v.duration * (start_range.value / 100);
    }
    else{
        v.currentTime = v.duration * (stop_range.value / 100);
    }
	v_min = start_range.value; 
    v_max = stop_range.value;

    var inSec = v.duration * (start_range.value / 100);
    if(String(inSec).indexOf( '.' ) != -1){
        var tmsec = (String(inSec).split(".")[1] + "000");
        var msec = ("0" + Math.round(tmsec.slice(0, 2) + "." + tmsec.slice(2))).slice(-2);
    }
    else{
        var msec = "00";
    }
    inSec = Math.round(inSec * 1000) / 1000;
    var sec = ('0' + parseInt(inSec%60)).slice(-2);
    var min = ('0' + parseInt(inSec/60)).slice(-2);
    var hour = ('0' + parseInt(inSec/(60 * 60))).slice(-2);

    //document.getElementById('start_time').value = min + ":" + sec + ":" + con;
    start_time.value = hour + ":" + min + ":" + sec + "." + msec;


    inSec = v.duration * (stop_range.value / 100);
    inSec = Math.round(inSec * 1000) / 1000;
    if(String(inSec).indexOf( '.' ) != -1){
        var tmsec = (String(inSec).split(".")[1] + "000");
        var msec = ("0" + Math.round(tmsec.slice(0, 2) + "." + tmsec.slice(2))).slice(-2);
    }
    else{
        msec = "00";
    }
    sec = ('0' + parseInt(inSec%60)).slice(-2);
    min = ('0' + parseInt(inSec/60)).slice(-2);
    hour = ('0' + parseInt(inSec/(60 * 60))).slice(-2);
    //document.getElementById('stop_time').value = min + ":" + sec + ":" + con;
    stop_time.value = hour + ":" + min + ":" + sec + "." + msec;

    get_encode_setting();
}

function change_start_stop_time(){
    if(isNaN(v.duration)){
        return;
    }

    var tatime = "";
    if(this.id == "start_time"){
        tatime = stop_time.value.split(":"); 
    }
    else{
        tatime = start_time.value.split(":");
    }
    var atime = ( parseInt(tatime[0]*60*60) + parseInt(tatime[1]*60) + parseFloat(tatime[2]) );
    
    var ttime = this.value;
    var rtime = 0;
    if(!(isNaN(ttime))){
        rtime = parseFloat(ttime);
    }
    if(ttime.indexOf( ':' ) != -1 ){
        var temp_time = ttime.split(":");
        if(temp_time.length == 3){
            rtime = ( parseInt(temp_time[0]*60*60) + parseInt(temp_time[1]*60) + parseFloat(temp_time[2]) );
        }
    }

    var up_percent = (rtime / v.duration) * 100;
    if(up_percent <= 100){
        set_value_multi_range(((atime / v.duration) * 100),up_percent);
    }
    else{
        set_value_multi_range(100,up_percent);
    }

    change_multi_range();

    v.currentTime = rtime;


}

start_time.addEventListener('change', change_start_stop_time);
stop_time.addEventListener('change', change_start_stop_time);
