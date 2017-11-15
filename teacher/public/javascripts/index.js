$(document).ready(function() {
    resetForm();
    $("#quesForm").validate();
    data = $.getJSON("/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            addToList(data[i].time, data[i].id, data[i].title);
    });

    $('#quesForm').validate();
});

$.validator.setDefaults({
    submitHandler:function(form, event){
        return false;
    },
    errorPlacement: function(error, element) {
        return false;
    },
    errorClass: "errorInput",
    highlight:function(element, errorClass, validClass){
        $(element).addClass(errorClass);      
    },
    unhighlight:function(element, errorClass, validClass){
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

function addSecBtnStatus() {
    if ($('#quesSections > .section').length == 4) {
        $('#addSection').prop("disabled", true);
    }
    else {
        $('#addSection').prop("disabled", false);
    }
}

function addSec(sectext, ans) {
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
        'onclick': "goTo("+$('#quesSections > .section').length+")"
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

    container.append(row);
    row.append(ansbtn, secbox,delbtn);
    $("#addSection").attr("cnt", $("#addSection").attr("cnt")+1);
    addSecBtnStatus();
  }

function goTo(btnIndex) {
    selectBtn = $('#quesSections > .section').eq(btnIndex).find('.goto_btn');
    $('#circle-btn').show()
    $('#branch-goto-btn').show();
    $('#QuesBlock').hide();

    playerInstance.setControls(true);
    playerInstance.play(false);

    console.log(btnIndex);

    $('#branch-goto-btn').click(function() {
        selectBtn.text(timeTransfer(playerInstance.getPosition('VOD')));
        selectBtn.next("input").val(Math.floor(playerInstance.getPosition('VOD')));
        selectBtn.removeClass("btn-outline-success");
        selectBtn.addClass("btn-success active");
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
        'secnum': $("input[name^='sec']").length,
        'time': Math.floor($('#time').val())
    }

    var data = $("input[name^='sec']");
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

    return quesData;
}

function submitQues() {
    if ($('#quesSections > .section').length == 0) {
        alert("please add sections!");
        return false;
    }

    var quesData = quesSerialize();

    $.ajax({
        url: "addQues/",
        type: 'POST',
        data: quesData,
        success: function(result) {
            addToList(quesData.time, result.id, quesData.title);
            sortQuesList();
        }
    });
    console.log(quesData);

    return true;
}

function preview(id) {
    var oldData = {};
    $.ajax({
        url: "preview/"+id,
        type: 'GET',
        data: id,
        success: function(data) {
            oldData = data[0];
            popBlock();
        
            $('#update-btn, #trash-btn').show();
            $('#back-btn, #selectType, #editMode').hide();

            $('#previewMode').show();

            $('#pre-title').text(oldData.title);
            $('#pre-description').text(oldData.des);
            $('#pre-explain').text(oldData.exp);
            for (var i = 0; i < oldData.secnum; i++) {
                if (oldData.type == 'single') {
                    $('#pre-secs-blk').append($("<input />", {
                        'id': "pre-sec"+i,
                        'type': "radio",
                        'class': "sectionInput",
                    })).append($('<label />', {                            
                    }).text(" "+ oldData["sec"+i]));
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
                url: "update/"+id,
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
    console.log('aaa');
    if ($('#quesForm').valid() && submitQues()) {
        resetForm();
        closeBlock(); 
    }
}

function addNext() {
    console.log('aaa');
    if ($('#quesForm').valid() && submitQues()) {
        resetForm();
        setTime(); 
    }
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