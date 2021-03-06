// public/javascripts/admin_survey.js


// Document Ready
$(function() {

  $("#question-form").submit(postQuestion);

  // Form changes depending on question type in dropdown
  $("#question-type").change(function() {
    if (($(this).val() === "Checkbox") || ($(this).val() === "Multiple Choice") || ($(this).val() === "Dropdown")) {
      // Remove option boxes previously and add one
      $('#options input').remove();
      $('#options br').remove();
      $('<br>').insertBefore('#add-option');
      $('<input type="textarea" name="options"</input>').insertBefore('#add-option');
      $('<br>').insertBefore('#add-option');
      $('#options').hide();
      $('#company').hide();
      $('#patent').hide();
      $('#publication').hide();
      $('#query').val('');
      $("#options").slideDown("slow");
    } else if ($(this).val() === "Company") {
      $('#options').hide();
      $('#company').hide();
      $('#patent').hide();
      $('#publication').hide();
      $('#query').val('');
      $("#company").slideDown("slow");
      $('#query').val('Where are you working now?');
    } else if ($(this).val() === "Patent") {
      $('#options').hide();
      $('#company').hide();
      $('#patent').hide();
      $('#publication').hide();
      $('#query').val('');
      $("#patent").slideDown("slow");
      $('#query').val('Are these your patents?');
    } else if ($(this).val() === "Publication") {
      $('#options').hide();
      $('#company').hide();
      $('#patent').hide();
      $('#publication').hide();
      $('#query').val('');
      $("#publication").slideDown("slow");
      $('#query').val('Are these your publications?');
    } else {
      $('#options').hide();
      $('#company').hide();
      $('#patent').hide();
      $('#publication').hide();
      $('#query').val('');
    }
  });

  setSurveyURL();

});

// Redirects to responses by survey ID
function getSurveyResponses(id) {
  window.location.replace('/admin/surveys/'+id+'/responses');
}

// Remove survey by survey ID
function removeSurvey(id) {
  $.ajax('/api/surveys/'+id, {
    cache: false,
    type: 'DELETE',
    success: function(data) {
      window.location.replace("/admin/surveys");
    }
  });
}

// Remove question by survey ID and question ID
function removeQuestion(survey_id,question_id) {
  $.ajax('/api/surveys/'+survey_id+'/questions/'+question_id, {
    cache: false,
    type: 'DELETE',
    success: function(data) {
      $('#question-'+question_id).remove();
    }
  });
}

// Adds question to survey
function postQuestion() {

  // Retrieve values from question form
  var query = $('#query').val();
  var type = $('#question-type').val();
  var options = [];

  // Add options to array
  $('#options input').each( function(i,elem) {
      options.push(elem.value);
  });
  
  // Get Survey ID
  var id = $("#survey-id").val();

  $.ajax({
      url: '/api/questions/new', 
      type: 'POST',
      data: {
        query: query,
        type: type,
        options: options.join("::"),
        id: id
      },
      success: function(data) {
        // Display error message for missing question input
        if (data === "Error no question") {
          $("#response").html("Please enter a question.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });

        // Display error message for missing options if question type requires it
        } else if (data === "Error no options") {
          $("#response").html("Please add options to your question.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });

        // Display new question in table
        } else {
          var question = data;
          var q_id = question._id;
          var query = question.query;
          var type = question.type;
          var options = question.query_options.toString().replace(/,/g, ' - ');

          // Reset question form
          $('#options').hide();
          $('#options input').remove();
          $('#options br').remove();
          $('<br>').insertBefore('#add-option');
          $('<input type="textarea" name="options"</input>').insertBefore('#add-option');
          $('<br>').insertBefore('#add-option');
          $('#company').hide();
          $('#patent').hide();
          $('#publication').hide();
          $("#query").val("");
          $('#question-type').val("Short Text");

          // Append new questions to table of questions
          $("#questions-table").fadeIn("slow");
          $("#questions-table tbody")
            .append("<tr id=question-"+q_id+"><td>"+query+"</td><td>"+type+"</td><td>"+options+"</td></tr>")
            .slideDown("slow");
          // $("#question-"+q_id).append("<td><a id='delete-button' onclick='removeQuestion('"+id+"','"+q_id+"')'>&#10006;</a></td>");
        }
      }
  });
  return false;    
}

// Add additional option to question types that require multiple options
// -- Dropdown
// -- Multiple Choice
// -- Checkbox
function addOption() {
  $('<input type="textarea" name="options"</input>').insertBefore('#add-option');
  $('<br>').insertBefore('#add-option');
}

// Publishes survey - available for participants to submit responses
function publishSurvey(id) {
  $.ajax('/api/surveys/'+id+'/publish', {
    cache: false,
    type: 'PUT',
    success: function(data) {

      // Hide publish button and question box
      $("#publish-button").hide();
      $(".question-box").hide();

      // Show metrics button, close button and url
      $("#metrics-button").slideDown('slow');
      $("#close-button").slideDown('slow');
      $("#url-instructions").slideDown('slow');

      // Show success response to user
      $("#response").html(data).fadeIn(function() {
        setTimeout(function() {
          $("#response").fadeOut("slow");
        }, 2000);
      });

    }
  });
}

// Closes survey - unavailable for participants to submit responses
function closeSurvey(id) {
  $.ajax('/api/surveys/'+id+'/close', {
    cache: false,
    type: 'PUT',
    success: function(data) {

      // Hide close button and question box
      $("#close-button").hide();
      $(".question-box").hide();
      $("#url-instructions").hide();
      
      // Show success response to user
      $("#response").html(data).fadeIn(function() {
        setTimeout(function() {
          $("#response").fadeOut("slow");
        }, 2000);
      });

    }
  });


}

// sets the survey url to the current host
function setSurveyURL() {
  // alert('hi')
  var location = document.URL
                .replace(/https?:\/\//, '')
                .match(/([^\/]+)/)[0];
  
  var currentAddr = $('#url_large').val();
  var newAddr = currentAddr.replace('http://localhost:3000', location);
  
  $('#url_large').val(newAddr);
}


