// public/javascripts/admin_listSurveys.js


// Document Ready
$(function() {

  // Mouseovers
  $('.survey-box').mouseover(function() {
    $(this).css('background-color', '#f9f9f9');
  });

  $('.survey-box').mouseout(function() {
    $(this).css('background-color', '#ffffff');
  });

  $('.new-survey-box').mouseover(function() {
    $(this).css('background-color', '#008d95');
  });

  $('.new-survey-box').mouseout(function() {
    $(this).css('background-color', '#00757b');
  });

});

// Remove survey by survey ID
function removeSurvey(id) {
  $.ajax('/api/surveys/'+id, {
    cache: false,
    type: 'DELETE',
    success: function(data) {
      $('#survey-'+id).remove();
    }
  });
}

// Redirects to  survey by survey ID
function getSurvey(id) {
  window.location.replace("/admin/surveys/"+id);
}

// Publishes survey - available for participants to submit responses
function publishSurvey(id) {
  $.ajax('/api/surveys/'+id+'/publish', {
    cache: false,
    type: 'PUT',
    success: function(data) {
      window.location.replace('/admin/surveys');
    }
  });
}

// Closes survey - unavailable for participants to submit responses
function closeSurvey(id) {
  $.ajax('/api/surveys/'+id+'/close', {
    cache: false,
    type: 'PUT',
    success: function(data) {
      window.location.replace('/admin/surveys');
    }
  });
}