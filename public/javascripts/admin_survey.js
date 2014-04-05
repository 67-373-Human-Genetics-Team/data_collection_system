$(function() {
  $("#question-form").submit(postQuestion);

  $("#question-type").change(function() {
    if (($(this).val() === "Checkbox") || ($(this).val() === "Radio Button") || ($(this).val() === "Dropdown")) {
      // Remove option boxes previously and add one
      $('#options input').remove();
      $('#options br').remove();
      $('<br>').insertBefore('#add-option');
      $('<input type="textarea" name="options"</input>').insertBefore('#add-option');
      $('<br>').insertBefore('#add-option');
      $('#options').hide();
      $('#number').hide();
      $("#options").slideDown("slow");
    } else if ($(this).val() === "Number") {
      $('#options').hide();
      $('#number').hide();
      $("#number").slideDown("slow");
    } else {
      $('#options').hide();
      $('#number').hide();
    }
  });
});

function removeSurvey(id) {
  $.ajax('/api/surveys/'+id, {
    cache: false,
    type: 'DELETE',
    success: function(data) {
      window.location.replace("/admin/surveys");
    }
  });
}

function removeQuestion(survey_id,question_id) {
  $.ajax('/api/surveys/'+survey_id+'/questions/'+question_id, {
    cache: false,
    type: 'DELETE',
    success: function(data) {
      $('#question-'+question_id).remove();
    }
  });
}

function postQuestion() {
  // Retrieve values from question form
  var query = $('#query').val();
  var type = $('#question-type').val();
  var options = [];
  $('#options input').each( function(i,elem) {
    options.push(elem.value);
  });
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
        location.reload();
      }
  });
  return false;    
}

function addOption() {
  $('<input type="textarea" name="options"</input>').insertBefore('#add-option');
  $('<br>').insertBefore('#add-option');
}