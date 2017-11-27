$(document).ready(function() {
    var ques = [];
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

    var quesptr=0;
    playerInstance.on('time', function(x){
        if(parseInt(x.position,10)==ques[quesptr].time && quesptr < ques.length) {
                playerInstance.pause(true);
                playerInstance.setControls(false);
                quesptr++;
        }
    });
});

