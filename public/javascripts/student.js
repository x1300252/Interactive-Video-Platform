var quesptr=0;
var ques = [];
var branch = false;
var studentAns = [];
var time_cnt=0
var timer;

$(document).ready(function() {
    $.getJSON("/student/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            ques.push(data[i]);
    });

    var playerInstance = jwplayer("myElement");
    playerInstance.setup({
      width: "720",
      height: "480",
      aspectratio: "16:9",
      autostart: "false",
      repeat: "false",
      abouttext: "故宮教育頻道",
      aboutlink: "http://npm.nchc.org.tw",
      sources: [{
        file: "/images/1.mp4",
        label: "1080p_test"
        }, {
        file: "/images/1.mp4",
        label: "480p_test"
        }, {
        file: "/images/1.mp4",
        label: "720p_test",
        'default': 'true'
        }, {
        file: "/images/1.mp4",
        label: "360p_test"
      }]
    });

    console.log(ques);

    //disable jwplayer seek function
    playerInstance.on('seek', function (event) {
        if (event.offset <= event.position || branch)
            branch = false;
        else
            playerInstance.seek(event.position);
    });

    playerInstance.on('time', function(x){
        if(quesptr < ques.length && parseInt(x.position,10)==ques[quesptr].time) {
            playerInstance.pause(true);
            playerInstance.setControls(false);
            popQues(quesptr++);
        }
    });
});

function Timer() {
    time_cnt = time_cnt+1;
    t = setTimeout("Timer()",1000);
}

function popQues(quesptr) {
    console.log(ques[quesptr]);
    $('#QuesBlock, #quesMode').show();
    $('#expMode').hide();

    $('#ques_title').text(ques[quesptr].title);
    $('#ques_des').text(ques[quesptr].des);
    $('#ques_exp').text(ques[quesptr].exp);

    $('#submitQues').attr("onclick", "chkAns("+quesptr+")");

    for (var i = 0; i < ques[quesptr].secnum; i++) {
        if (ques[quesptr].type == 'multiple') {
            $('#ques_secs_blk').append($('<label>', {
                'class': "btn btn-outline-primary w-100",
                'for': "ques_sec"+i                            
            }).text(" "+ ques[quesptr]["sec"+i])
            .append($("<input>", {
                'id': "ques_sec"+i,
                'type': "checkbox",
                'class': "sectionInput ques_sec"
            })));
        }

        else {
            $('#ques_secs_blk').append($('<label>', {
                'class': "btn btn-outline-primary w-100",
                'for': "ques_sec"+i                            
            }).text(" "+ ques[quesptr]["sec"+i])
            .append($("<input>", {
                'id': "ques_sec"+i,
                'type': "radio",
                'class': "sectionInput ques_sec"
            })));
        }
    }
    Timer();
}  

function clzQues() {
    $('#ans_correct').text("");
    $("#ques_secs_blk > .ques_sec, label").remove();
    $('#submitGroup').addClass("btn-group");
    $('#submitQues, #resetQues').show();
    if (quesptr < ques.length && quesptr!=0 && ques[quesptr].time == ques[quesptr-1].time)
        popQues(quesptr++);
    else {
        $('#QuesBlock, #quesMode, #expMode').hide();
        playerInstance.pause(false);
        playerInstance.setControls(true);
    }
}

function branchto(time) {
    branch=true;
    playerInstance.seek(time);
    for (; quesptr < ques.length && time<ques[quesptr].time; quesptr++);
    quesptr++;
    clzQues();
}

function chkAns(quesptr) {
    clearTimeout(t);
    var sec = $('.ques_sec');
    var ans = {'user':"", 'video':ques[quesptr].video, 'id':ques[quesptr].id, 'time':time_cnt};
    var state = "correct";
    var time = 0;
    time_cnt = 0;
    for (var i = 0; i < ques[quesptr].secnum; i++) {
        ans['ans'+i] = ($('#ques_sec'+i).prop('checked')) ? 1 : 0 ;
        if (ans['ans'+i] != ques[quesptr]["ans"+i])
            state = "wrong";
        if (ans['ans'+i])
            time = ques[quesptr]["ans"+i];
    }
    console.log(ans, time);
    $('#quesMode').hide();
    $('#expMode').show();
    if (ques[quesptr]["type"] == "branch")
        $('#expMode').attr("onclick", "branchto("+time+");");
    else {
        $('#expMode').attr("onclick", "clzQues();");
        $('#ans_correct').text(state);
    }
}