var quesptr=0;
var ques = [];

$(document).ready(function() {
    $.getJSON("/student/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            ques.push(data[i]);
    });

    console.log(ques);

    //disable jwplayer seek function
    var maxPlayPosition = 0;
    var seeking = false;
    playerInstance.onTime(function (event) {
        if (!seeking) 
            maxPlayPosition = Math.max(event.position, maxPlayPosition)
    }).onPlaylistItem(function () {
        maxPlayPosition = 0
    }).onSeek(function (event) {
        if (!seeking) {
            if (event.offset > maxPlayPosition) {
                seeking = true;
                setTimeout(function () {
                    playerInstance.seek(maxPlayPosition)
                }, 100)
            }
        } else seeking = false
    });

    playerInstance.on('time', function(x){
        if(quesptr < ques.length && parseInt(x.position,10)==ques[quesptr].time) {
            playerInstance.pause(true);
            playerInstance.setControls(false);
            popQues(quesptr++);
        }
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
                'onclick': "playerInstance.seek("+ques[quesptr]["ans"+i]+");closeBlock();"
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


