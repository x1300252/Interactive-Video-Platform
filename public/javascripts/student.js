var quesptr=0;
var ques = [];
var branch = false;

$(document).ready(function() {
    $.getJSON("/student/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            ques.push(data[i]);
    });

    console.log(ques);

    //disable jwplayer seek function
    playerInstance.on('seek', function (event) {
        if (event.offset <= event.position || branch) {
            branch = false;
        }
        else
            playerInstance.seek(event.position);
    });

    playerInstance.on('time', function(x){
        if(quesptr < ques.length && parseInt(x.position,10)==ques[quesptr].time) {
            playerInstance.pause(true);
            playerInstance.setControls(false);
            popQues(quesptr++);
        }
        for (; quesptr < ques.length && parseInt(x.position,10)<ques[quesptr].time; quesptr++);
    });
});

function popQues(quesptr) {
    console.log(ques[quesptr]);
    $('#QuesBlock, #quesMode').show();
    $('#expMode').hide();

    $('#ques_title').text(ques[quesptr].title);
    $('#ques_des').text(ques[quesptr].des);
    $('#ques_exp').text(ques[quesptr].exp);

    for (var i = 0; i < ques[quesptr].secnum; i++) {
        if (ques[quesptr].type == 'single') {
            $('#ques_secs_blk').append($("<input>", {
                'id': "ques_sec"+i,
                'type': "radio",
                'class': "sectionInput ques_sec",
            })).append($('<label>', {                            
            }).text(" "+ ques[quesptr]["sec"+i]));
        }

        else if (ques[quesptr].type == 'multiple') {
            $('#ques_secs_blk').append($("<input>", {
                'id': "ques_sec"+i,
                'type': "checkbox",
                'class': "sectionInput ques_sec",
            })).append($('<label>', {                            
            }).text(" "+ ques[quesptr]["sec"+i]));
        }

        else {
            $('#submitQues, #resetQues').hide();
            $('#submitGroup').removeClass("btn-group");
            $('#ques_secs_blk').append($("<button>", {
                'id': "ques_sec"+i,
                'class': "sectionInput ques_sec btn w-100",
                'onclick': "branchto("+ques[quesptr]["ans"+i]+")"
            }).text(ques[quesptr]["sec"+i]));
        }
    }
}  

function clzQues() {
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
    clzQues();
}


