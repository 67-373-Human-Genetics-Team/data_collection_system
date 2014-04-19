$(function() {

    $("#survey-title").hide();
    $("#participant-survey-form").hide();

    // Get participant id from URL pathname and update value
    var participant_id = window.location.pathname.split( '/' ).pop();
    $("#participant_id").val(participant_id);

    // Get participant firstname lastname and call publications api
    getParticipant(participant_id);

    $("#participant-survey-form").submit(postResponse);
    
});

// Demo publication data, will remove after server setup
var publications = [
    {
      "title": "The implications of ENCODE for diagnostics.",
      "journal": "Some Journal",
      "pub-date": "mm/dd/yyyy",
      "authors": [
        {"name": "Firstname Lastname1",
         "organization": "division name, organization name, address"
        },
        {"name": "Firstname Lastname2",
         "organization": "division name, organization name, address"
        },
        {"name": "Firstname Lastname3",
         "organization": "division name, organization name, address"
        },
        {"name": "Firstname Lastname4",
         "organization": "division name, organization name, address"
        },
      ],
      "data-source": "pmc",
      "id": "123456789"
    },
    {
      "title": "Why life science needs its own Silicon Valley.",
      "journal": "Harvard Business Review",
      "pub-date": "mm/dd/yyyy",
      "authors": [
        {"name": "Firstname Lastname1",
         "organization": "division name, organization name, address"
        },
        {"name": "Firstname Lastname2",
         "organization": "division name, organization name, address"
        },
        {"name": "Firstname Lastname3",
         "organization": "division name, organization name, address"
        },
        {"name": "Firstname Lastname4",
         "organization": "division name, organization name, address"
        },
      ],
      "data-source": "pmc",
      "id": "123456789"
    },
]

// Gets participant's name and calls getPublications(name)
function getParticipant(id) {
    $.ajax('/api/participants/'+id, {
        cache: false,
        type: 'GET',
        success: function(data) {
            var participant = data;
            var participantName = participant.first_name+' '+participant.last_name;
            console.log('Participant: '+participantName);
            // Demo with Dietrich Stephan search
            getPublications(participantName);
        }
    });
};

// Gets publications from name and displays list
function getPublications(name) {
    console.log('Function getPublications: '+name);
    
    $("#publications-box").fadeIn('slow');
    $("#patents-box").fadeIn('slow');

    $('#publications-box').append("<form id='publications-form'></form>");

    for (var i=0; i<publications.length; i++) {
        $('#publications-form').append("<div><input class='publication' type='checkbox' onclick='toggle();' value='"+publications[i].title+"'>"+publications[i].title+" ("+publications[i]['pub-date']+")"+"</input></div>")
    }

    $('#publications-form').append("<button type='button' onclick='populatePublicationDropdown();'>Confirm</button>");
   // $.ajax('/publications', {
   //      cache: false,
   //      type: 'POST',
   //      data: {
   //          name: name
   //      },
   //      success: function(data) {
   //          var publications = data;
   //          // update divs with publication titles
   //      }
   //  }); 
};

// Remove this eventually. Using it to see what is checked.
function toggle() {
    var chosenPublications = [];
    $('#publications-form input:checkbox:checked').each(function() {
        chosenPublications.push($(this).val());
    });
    console.log(chosenPublications);
};

// Populates the publications dropdown list based on checked boxes
function populatePublicationDropdown() {
    $("#publications-box").slideUp('slow');
    $("#survey-title").fadeIn('slow');
    $("#participant-survey-form").fadeIn('slow');
    $('#publications-form input:checkbox:checked').each(function() {
        $("#publication-dropdown").append("<option value='"+$(this).val()+"'>"+$(this).val()+"</option>")
    });
};

// Submitting response to survey
function postResponse() {
    // Retrieve values from question form
    var survey_id = $('#survey_id').val();
    var participant_id = $('#participant_id').val();
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
            answers: answers.join("::"),
            participant_id: participant_id
        },
        success: function(data) {
            console.log('response POST success');
            updateParticipantSurveys(participant_id,survey_id);
        }
    });
    return false;    
};


function updateParticipantSurveys(participant_id, survey_id) {
    $.ajax({
        url: '/api/participants/'+participant_id,
        type: 'PUT',
        data: {
            survey_id: survey_id
        },
        success: function(data) {
            console.log('participant surveys updated');
            window.location.replace("/surveys/thankyou");
        }
    });
    return false;
};









