var ques = [];

$(document).ready(function() {
    $.getJSON("/student/getList", function(data) {
        for (var i = 0; i < data.length; i++)
            ques.push(data[i]);
    });
});