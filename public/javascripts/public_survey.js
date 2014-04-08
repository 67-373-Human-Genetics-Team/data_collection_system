$(function() {
    $("#participant-survey-form").submit(postResponse);
});

// Submitting response to survey
function postResponse() {
    // Retrieve values from question form
    var survey_id = $('#survey_id').val();
    var answers = [];
    $(".question-area").each( function (i) {
        if ($(this).attr('class') === "Short Text question-area") {
            answers.push($(this).children("input:text").val());

        } else if ($(this).attr('class') === "Long Text question-area") {
            answers.push($(this).children("input:text").val());

        } else if ($(this).attr('class') === "Checkbox question-area") {
            var checked = $(this).children("input:checkbox:checked").map(function(){ return $(this).val();}).get();
            answers.push(checked);

        } else if ($(this).attr('class') === "Dropdown question-area") {
            answers.push($(this).children("select").children("option").filter(":selected").val());

        } else if ($(this).attr('class') === "Multiple Choice question-area") {
            answers.push($(this).children("input:radio:checked").val());

        } else if ($(this).attr('class') === "Number question-area") {
            // what about if number has min/max?
            answers.push($(this).children("input:text").val());

        } else if ($(this).attr('class') === "Company question-area") {
            var company = $(this).children("input:text").map(function(){ return $(this).val();}).get();
            answers.push(company);

        } else if ($(this).attr('class') === "Patent question-area") {
            var patent = [];
            patent.push($(this).children("select").children("option").filter(":selected").val());
            patent.push($("#patent-textarea").val());
            answers.push(patent);

        } else if ($(this).attr('class') === "Publication question-area") {
            var publication = [];
            publication.push($(this).children("select").children("option").filter(":selected").val());
            publication.push($("#publication-textarea").val());
            answers.push(publication);

        } else {
            console.log(answers);
        }
    });
    $.ajax({
        url: '/api/responses/new', 
        type: 'POST',
        data: {
            survey_id: survey_id,
            answers: answers.join("::")
        },
        success: function(data) {
            console.log('response POST success');
        }
    });
    return false;    
};