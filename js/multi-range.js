customElements.define("multi-range", class extends HTMLElement {
    connectedCallback() {
        if (this.shadowRoot) return
        
        this.attachShadow({mode: "open"}).innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: 100%;
                    --line-inactive: #ddd;
                    --line-active: #78b551;
                    --thumb: #78b551;
                }
                input[type="range"] {
                    width: calc(100% - 20px);
                    height: 10px;
                    cursor: pointer;
                    outline: none;
                    -webkit-appearance: none;
                }
                input[type="range"]::-webkit-slider-runnable-track {
                    height: 10px;
                }
                input[type="range"]::-webkit-slider-thumb {
                    height: 30px;
                    width: 15px;
                    margin-top: -10px;
                    background: var(--thumb);
                    border-radius: 10px;
                    box-shadow: 0 0 5px 0 #0003;
                    -webkit-appearance: none;
                }

                input[type="range" i]{
                    margin: 2px 10px;
                }
                
                .container {
                    width: 100%;
                    position: relative;
                }
                #back, #front {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                #back::-webkit-slider-thumb,
                #front::-webkit-slider-thumb {
                    position: relative;
                    z-index: 1;
                }
                #back::-webkit-slider-runnable-track {
                    background: linear-gradient(to right, var(--line-inactive) 0% var(--min),
                        var(--line-active) var(--min) var(--max),
                        var(--line-inactive) var(--max) 100%);
                }
                #front,
                #front::-webkit-slider-runnable-track {
                    background: transparent;
                }
            </style>

            <div class="container">
                <input id="back" type="range" min="0" max="100" value="0" step="1"/>
                <input id="front" type="range" min="0" max="100" value="100" step="1"/>
            </div>
        `
        
        this._elems = {
            back: this.shadowRoot.getElementById("back"),
            front: this.shadowRoot.getElementById("front"),
        }
        
        this._elems.back.addEventListener("input", () => { this._redraw() })
        this._elems.front.addEventListener("input", () => { this._redraw() })
        this._redraw()
    }
    
    _redraw() {
        const { min, max, from, to } = this
        const x = (from - min) / (max - min) * 100
        const y = (to - min) / (max - min) * 100

        this._elems.back.style.setProperty("--min", x + "%")
        this._elems.back.style.setProperty("--max", y + "%")
    }
    
    get min() {
        return this._elems.back.min
    }
    
    set min(value) {
        const [min, max] = [+value || 0, this.max].sort((a, b) => a - b)
        this._elems.back.min = min
        this._elems.back.max = max
        this._elems.front.min = min
        this._elems.front.max = max
        this._redraw()
    }
    
    get max() {
        return this._elems.back.max
    }
    
    set max(value) {
        const [min, max] = [this.min, +value || 0].sort((a, b) => a - b)
        this._elems.back.min = min
        this._elems.back.max = max
        this._elems.front.min = min
        this._elems.front.max = max
        this._redraw()
    }
    
    get from() {
        return Math.min(this._elems.back.value, this._elems.front.value)
    }
    
    set from(value) {
        const [min, max] = [+value || 0, this.to].sort((a, b) => a - b)
        this._elems.back.value = min
        this._elems.front.value = max
        this._redraw()
    }
    
    get to() {
        return Math.max(this._elems.back.value, this._elems.front.value)
    }
    
    set to(value) {
        const [min, max] = [this.from, +value || 0].sort((a, b) => a - b)
        this._elems.back.value = min
        this._elems.front.value = max
        this._redraw()
    }
    
    get value() {
        return [this._elems.back.value, this._elems.front.value].sort((a, b) => a - b).join(",")
    }
    
    set value(value) {
        const [min, max] = value.split(",").slice(0, 2).sort((a, b) => a - b)
        this._elems.back.value = min
        this._elems.front.value = max
        this._redraw()
    }

    set step(value) {
        this._elems.back.step = value
        this._elems.front.step = value
    }

    get step() {
        return Math.max(this._elems.back.step, this._elems.front.step)
    }
})

var mr = document.querySelector("multi-range");
var v_min = mr.from; 
var v_max = mr.to;

const v = document.getElementById('input-video-preview');

const start_time = document.getElementById('start_time');
const stop_time = document.getElementById('stop_time');



function change_multi_range() {
    if(v_min != mr.from){
        v.currentTime = v.duration * (mr.from / 100);
    }
    else{
        v.currentTime = v.duration * (mr.to / 100);
    }
	v_min = mr.from; 
    v_max = mr.to;

    var inSec = v.duration * (mr.from / 100);
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


    inSec = v.duration * (mr.to / 100);
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
        mr.value = ((atime / v.duration) * 100) + "," + up_percent;
    }

    change_multi_range();

    v.currentTime = rtime;


}

mr.addEventListener('input', change_multi_range);
start_time.addEventListener('change', change_start_stop_time);
stop_time.addEventListener('change', change_start_stop_time);
