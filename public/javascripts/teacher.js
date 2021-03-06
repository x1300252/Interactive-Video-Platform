$(document).ready(function() {
    resetForm();
    data = $.getJSON("/teacher/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            addToList(data[i].time, data[i].id, data[i].title);
    });
});
$.validator.setDefaults({
    rules:{
        secnum: {
            min: 1
        }},
    submitHandler:function(form, event){
        return false;
    },
    errorPlacement: function(error, element) {
        return false;
    },
    errorClass: "errorInput",
    highlight:function(element, errorClass, validClass){
        if ($(element).is(':radio') || $(element).is(':checkbox')) {
            $(element.form).find('span').addClass(errorClass);       
        }
        $(element).addClass(errorClass);
    },
    unhighlight:function(element, errorClass, validClass){
        if ($(element).is(':radio') || $(element).is(':checkbox')) {
            $(element.form).find('span').removeClass(errorClass);       
        }
        $(element).removeClass(errorClass);
    }
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

function maxBlock() {
    $('.circle').hide();
    $('#QuesBlock').show();

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
    addSecBtnStatus();

    if ($(e.target).attr("id") === String("branch")) {
        $('#addNextQues').addClass("disabled");
    }
    else {
        $('#addNextQues').removeClass("disabled");
    }
}

function addSecBtnStatus() {
    $("#addSection").val($('.section').length);

    if ($('#quesSections > .section').length == 4) {
        $('#addSection').prop("disabled", true);
    }
    else {
        $('#addSection').prop("disabled", false);
    }
}

function addSec(sectext, ans) {
    $('#addSection').removeClass('errorInput');
    $("#addSection").val(Number($("#addSection").val()+1));
    if ($("#questype").val() == "branch") {
      var ansbtn = $("<span>", {
        'class': "input-group-btn"
      }).append($("<button>", {
        'aria-pressed': "false",
        'name': "ans"+$("#addSection").attr("cnt"),
        'type': "button",
        'class': "sectionInput required btn btn-outline-success goto_btn"+(ans!=-1?" active":""),
        'value': ans==-1 ? "" : ans,
        'onclick': "goTo("+$("#addSection").attr("cnt")+")"
      }).text(ans==-1 ? "go to" : timeTransfer(ans)));
    }
    else {
        var ansbtn = $("<span>", {
          'class': "input-group-addon btn btn-outline-success check_btn"+(ans==1?" active":""),
          'aria-pressed': "true",
          'onclick': "$('.check_btn, .check_btn > input').removeClass('errorInput')"
        }).text("ans").append($("<input>", {
          'name': "ans",
          'type': ($("#questype").val() == "single") ? "radio" : "checkbox",
          'class': "sectionInput required"
        }).attr("checked",(ans==1)?true:false));
      }

    var secbox = $("<input>", {
        'name': "sec"+$("#addSection").attr("cnt"),
        'type': "text",
        'placeholder': "section",
        'class': "form-control sectionInput required"
    }).val(sectext);

    var delbtn = $("<span>", {
      'class': "input-group-btn"
    }).append($("<button>", {
      'type': "button",
      'class': "btn btn-danger delSection",
      'onclick': "$(this).closest('.section').remove(); addSecBtnStatus();"
    }).append($("<i>", {
      'class': "fa fa-minus",
      'aria-hidden': "true"
    })));

    $("#quesSections").append($("<div>", {
        'class': "row mx-0 my-1 section input-group",
    }).append(ansbtn, secbox, delbtn));
    
    $("#addSection").attr("cnt", Number($("#addSection").attr("cnt"))+1);
    addSecBtnStatus();
  }

function goTo(btnIndex) {
    selectBtn = $("button[name='"+'ans'+btnIndex+"']");
    $('#circle-btn').show()
    $('#branch-goto-btn').show();
    $('#QuesBlock').hide();

    playerInstance.setControls(true);
    playerInstance.play(false);

    $('#branch-goto-btn').click(function() {
        console.log(selectBtn);
        selectBtn.text(timeTransfer(playerInstance.getPosition('VOD')));
        selectBtn.val(Math.floor(playerInstance.getPosition('VOD')));
        selectBtn.removeClass("btn-outline-success errorInput");
        selectBtn.addClass("btn-success active");
        //playerInstance.seek($('#time').val());
    });
}

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
    var validator = $('#quesForm').validate();
    validator.resetForm();
    $("#quesSections > .section").remove();
    $("#quesForm")[0].reset();
    $("#selectType").show();
    $("#editMode, #back-btn").hide();
    $("#addSection").attr("cnt", "0");
}

function quesSerialize() {
    var quesData = {
        'type': $('#questype').val(),
        'title': $('#title').val(),
        'des': $('#description').val(),
        'exp': $('#explain').val(),
        'secnum': $('#addSection').val(),
        'time': Math.floor($('#time').val())
    }

    var data = $("input[name^='sec']");
    var len = data.length;
    var sec = [];
    for(i=0 ; i<len; i++) {
        quesData["sec"+i] = data[i].value;
    }

    data = (quesData['type'] == 'branch')?$("button[name^='ans']"):$("input[name='ans']");
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
    console.log(quesData);

    return quesData;
}

function submitQues() {
 /*    if ($('#quesSections > .section').length == 0) {
        return false;
    } */
    var quesData = quesSerialize();

    $.ajax({
        url: "/teacher/addQues/",
        type: 'POST',
        data: quesData,
        success: function(result) {
            addToList(quesData.time, result.id, quesData.title);
            sortQuesList();
        }
    });

    return true;
}

function preview(id) {
    resetForm();
    var oldData = {};
    $.ajax({
        url: "/teacher/preview/"+id,
        type: 'GET',
        data: id,
        success: function(data) {
            oldData = data[0];
            popBlock();
        
            $('#update-btn, #trash-btn').show();
            $('#back-btn, #selectType, #editMode').hide();
            $("#pre-secs-blk > .pre-sec").remove();
            $("#pre-secs-blk > label").remove();

            $('#previewMode').show();

            $('#pre-title').text(oldData.title);
            $('#pre-description').text(oldData.des);
            $('#pre-explain').text(oldData.exp);
            for (var i = 0; i < oldData.secnum; i++) {
                if (oldData.type == 'single') {
                    $('#pre-secs-blk').append($("<input />", {
                        'id': "pre-sec"+i,
                        'type': "radio",
                        'class': "sectionInput pre-sec",
                    })).append($('<label />', {                            
                    }).text(" "+ oldData["sec"+i]));
                }

                else if (oldData.type == 'multiple') {
                    $('#pre-secs-blk').append($("<input />", {
                        'id': "pre-sec"+i,
                        'type': "checkbox",
                        'class': "sectionInput pre-sec",
                    })).append($('<label />', {                            
                    }).text(" "+ oldData["sec"+i]));
                }

                else {
                    $('#pre-secs-blk').append($("<button>", {
                        'id': "pre-sec"+i,
                        'class': "sectionInput pre-sec btn w-100",
                        'onclick': "playerInstance.seek("+oldData["ans"+i]+");closeBlock();"
                    }).text(oldData["sec"+i]));
                }
            }

            $("#trash-btn, #deleteQues").attr("onclick","delQues("+id+")");
        }
    });

    $("#update-btn").click(function() {
        $('#previewMode, #submitGroup, #trash-btn, #update-btn').hide();
        $('#editMode, #updateGroup').show();

        $('#questype').val(oldData.type);
        $('#time').val(oldData.time);
        $('#title').val(oldData.title);
        $('#description').val(oldData.des);
        $('#explain').val(oldData.exp);
        $("#quesSections > .section").remove();
        for (var i = 0; i < oldData.secnum; i++) {
            addSec(oldData["sec"+i], oldData["ans"+i]);
        }
    })

    $("#updateQues").click(function() {
        var newData = quesSerialize();
        var diffData = {};

        for (var item in oldData) {
            if (!(item in newData))
               diffData[item] = undefined;  // property gone so explicitly set it undefined
            else if (oldData[item] !== newData[item])
               diffData[item] = newData[item];  // property in both but has changed
        }

        for (item in newData) {
            if (!(item in oldData))
               diffData[item] = newData[item]; // property is new
        }

        if (Object.keys(diffData).length != 0) {
            $.ajax({
                url: "/teacher/update/"+id,
                type: 'PUT',
                data: diffData,
                success: function() {
                    closeBlock();
                    $('#quesCard'+id).text(timeTransfer(newData.time)+" "+diffData.title);
                }
            });
        }
    });
}

function save() {
    if ($('#quesForm').valid() && submitQues()) {
        resetForm();
        closeBlock(); 
    }
}

function addNext() {
    if ($('#quesForm').valid() && submitQues()) {
        resetForm();
        setTime(); 
    }
}

function delQues(id) {
    $.ajax({
        url: "/teacher/delete/"+id,
        type: 'DELETE',
        success: function() {
            closeBlock();
            $('#quesCard'+id)[0].remove();
        }
    });
}