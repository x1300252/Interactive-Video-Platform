$(document).ready(function() {
    $("#quesForm").validate();
    data = $.getJSON("/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            addToList(data[i].time, data[i].id, data[i].title);
    }); 
});

function popBlock() {
    $('.circle').hide();
    $('#QuesBlock').show();
    $('#mini-btn, #back-btn').show();
    $('#submitGroup').show();
    $('#updateGroup, #update-btn, #trash-btn').hide();

    playerInstance.setControls(false);
    playerInstance.pause(true);
    
}

function setTime() {
    $('#time').val(playerInstance.getPosition('VOD'));
}

function closeBlock() {
    resetForm();

    $('#add-btn').show();
    $('#QuesBlock').hide();
    $('#previewMode').hide();
    $('#update-btn, #trash-btn').hide();

    playerInstance.setControls(true);
    playerInstance.play(true);
}

function minimizeBlock() {
    $('#return-ques-btn').show();
    $('#QuesBlock').hide();

    playerInstance.setControls(true);
    playerInstance.play(false);
}

function previousStep() {
    console.log($(".quesSlides").index($(".quesSlides:visible")));
    var curSlide = $(".quesSlides").index($(".quesSlides:visible"));

    if (curSlide != 0) {
        $("#quesSections").find(".section").remove();
        $("#quesForm")[0].reset();

        $(".quesSlides").eq(curSlide-1).show();
        $(".quesSlides").eq(curSlide).hide();
    }
    if ((curSlide-1) == 0)
        $("#back-btn").hide();
}

function selectType(e) {
    $("#back-btn").show();
    
    $("#questype").val($(e.target).attr("id"));

    $("#selectType").hide();
    $("#editMode").show();

    if ($(e.target).attr("id") === String("branch")) {
        $('#addNextQues').addClass("disabled");
    }
    else {
        $('#addNextQues').removeClass("disabled");
    }
}

function addSec(sectext, ans) {
    if ($('#quesSections > .section').length == 4) {
      alert("too many sections!");
      return;
    }
    var container = $("#quesSections");
    
    var row = $("<div>", {
        'class': "row mx-0 my-1 section input-group",
    });
    
    if ($("#questype").val() == "branch") {
      var ansbtn = $("<span>", {
        'class': "input-group-btn"
      }).append($("<button>", {
        'type': "button",
        'class': "btn btn-outline-success goto_btn"+(ans!=-1?" active":""),
        'aria-pressed': "false",
        'onclick': "goTo($(this))"
      }).text(ans==-1 ? "go to" : timeTransfer(ans))).append($("<input>", {
        'name': "ans",
        'type': "hidden",
        'class': "sectionInput",
        'value': ""
      }));
    }
    else {
      var ansbtn = $("<label>", {
        'class': "input-group-addon btn btn-success check_btn"+(ans==1?" active":""),
        'aria-pressed': "true"
      }).text("ans").append($("<input>", {
        'name': "ans",
        'type': ($("#questype").val() == "single") ? "radio" : "checkbox",
        'class': "sectionInput"
      }));
    }

    var secbox = $("<input>", {
        'name': "sec",
        'type': "text",
        'placeholder': "section",
        'class': "form-control sectionInput"
    }).prop('required',true).val(sectext);

    var delbtn = $("<span>", {
      'class': "input-group-btn"
    }).append($("<button>", {
      'type': "button",
      'class': "btn btn-danger delSection",
      'onclick': "$(this).closest('.section').remove()"
    }).append($("<i>", {
      'class': "fa fa-minus",
      'aria-hidden': "true"
    })));

    container.append(row);
    row.append(ansbtn, secbox,delbtn);
  }

function goTo(btn) {
    $('#circle-btn').show()
    $('#branch-goto-btn').show();
    $('#QuesBlock').hide();

    playerInstance.setControls(true);
    playerInstance.play(false);

    console.log(btn);

    $('#branch-goto-btn').click(function() {
        btn.html(timeTransfer(playerInstance.getPosition('VOD')));
        btn.next("input").val(Math.floor(playerInstance.getPosition('VOD')));
        btn.removeClass("btn-outline-success");
        btn.addClass("btn-success active");
    });
}

$.validator.setDefaults({
    rule: {
        input: {required: true}
    },
    messages: {
        required: "請填寫這個欄位"
    },
    submitHandler:function(form, event){
        var status = submitQues();
        if (status) {
            resetForm();
            if ($("input[name='submit']").val() == "save") {
                closeBlock(); 
            } else {
                setTime();
            }
        }
    },
    highlight:function(element, errorClass, validClass){
        $(element).addClass(errorClass).removeClass(validClass);      
    },
    unhighlight:function(element, errorClass, validClass){
        $(element).removeClass(errorClass).addClass(validClass);      
    }
});

function addToList(time, num, title) {
    $('#ques-list').append($("<button>", {
        'id':"quesCard"+num,
        'type': "button",
        'class': "quesCard btn btn-secondary list-group-item",
        'data-time': time,
        'data-num': num,
        'onclick': "preview("+num+")"
    }).text(timeTransfer(time)+" "+title));
}

function sortQuesList() {
    $('#ques-list button').sort(function(a,b){
        return (a.dataset.time == b.dataset.time) ? (a.dataset.num > b.dataset.num) :  (a.dataset.time > b.dataset.time);
    }).appendTo('#ques-list');
}

function timeTransfer(s) {
    var h = Math.floor(s/3600);
    s -= h*3600;
    var m = Math.floor(s/60);
    s -= m*60;
    s = Math.floor(s);
    length = playerInstance.getDuration('VOD');
    if (length < 3600)
        return (m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
    else 
        return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s);
}

function resetForm() {
    $("#quesSections > .section").remove();
    $("#quesForm")[0].reset();
    $("#selectType").show();
    $("#editMode").hide();
    $("#back-btn").hide();
}

function submitQues() {
    if ($('#quesSections > .section').length == 0) {
        alert("please add sections!");
        return false;
    }

    var at = $('#time').val();
    var time = Math.floor(at);

    var quesData = {
        'type': $('#questype').val(),
        'title': $('#title').val(),
        'des': $('#description').val(),
        'exp': $('#explain').val(),
        'secnum': $("input[name='sec']").length,
        'time': time
    }

    var data = $("input[name='sec']");
    var len = data.length;
    var sec = [];
    for(i=0 ; i<len; i++) {
        quesData["sec"+i] = data[i].value;
    }

    data = $("input[name='ans']");
    var len = data.length;
    var ans = [];
    if ($('#questype').val() == "branch") {
        for(i=0 ; i<len; i++) {
            quesData["ans"+i] = data[i].value;
        }
    }
    else {
        for(i=0 ; i<len; i++) {
            quesData["ans"+i] = data[i].checked ? 1 : -1;
        }
    }

    $.ajax({
        url: "addQues/",
        type: 'POST',
        data: quesData,
        success: function(result) {
            addToList(time, result.id, quesData.title);
            sortQuesList();
        }
    });
    console.log(quesData);

    return true;
}

function preview(id) {
    var quesData = {};
    $.ajax({
        url: "preview/"+id,
        type: 'GET',
        data: id,
        success: function(data) {
            quesData = data[0];
            popBlock();
        
            $('#update-btn, #trash-btn').show();
            $('#mini-btn, #back-btn, #selectType, #editMode').hide();

            $('#previewMode').show();

            $('#pre-title').text(quesData.title);
            $('#pre-description').text(quesData.des);
            $('#pre-explain').text(quesData.exp);

            $("#trash-btn, #deleteQues").attr("onclick","delQues("+id+")");
        }
    });

    $("#update-btn").click(function() {
        $('#previewMode, #submitGroup, #trash-btn, #update-btn').hide();
        $('#editMode, #updateGroup, #mini-btn').show();

        $('#questype').val(quesData.type);
        $('#time').val(quesData.time);
        $('#title').val(quesData.title);
        $('#description').val(quesData.des);
        $('#explain').val(quesData.exp);
        $("#quesSections > .section").remove();
        for (var i = 0; i < quesData.secnum; i++) {
            addSec(quesData["sec"+i], quesData["ans"+i]);
        }
    })
}

function delQues(id) {
    $.ajax({
        url: "delete/"+id,
        type: 'DELETE',
        success: function() {
            closeBlock();
            $('#quesCard'+id)[0].remove();
        }
    });
}

function leavePage() {
    $.ajax({
        url: "leave/",
        type: 'PUT',
    });
};