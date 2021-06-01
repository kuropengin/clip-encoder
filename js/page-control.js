var page_list = ["edit","encode","result"];
var now_page = 0;

function next_page(){
    if(now_page + 1 < page_list.length){
        now_page += 1;
    }
    else{
        now_page = 0;
    }
    page_list.forEach(function(element){
        document.getElementById(element).classList.add('display-none');
        document.getElementById("progress-bar-" + element).classList.remove('progress-bar-point-focus');
    });
        
    document.getElementById(page_list[now_page]).classList.remove('display-none');
    document.getElementById("progress-bar-" + page_list[now_page]).classList.add('progress-bar-point-focus');

    if(now_page == 2){
        bar.animate(0);
        document.getElementById('encode-percent').textContent = 0;
    }
    
}

document.getElementById('re-edit').addEventListener('click', next_page);
