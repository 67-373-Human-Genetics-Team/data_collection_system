// Document Ready
$(function() {
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

// AJAX call removes survey by ID
function removeSurvey(id) {
  $.ajax('/api/surveys/'+id, {
    cache: false,
    type: 'DELETE',
    success: function(data) {
      $('#survey-'+id).remove();
    }
  });
}

// Retrieves survey by ID
function getSurvey(id) {
  window.location.replace("/admin/surveys/"+id);
}

// AJAX call publishes survey and updates tables
function publishSurvey(id) {
  $.ajax('/api/surveys/'+id+'/publish', {
    cache: false,
    type: 'PUT',
    success: function(data) {
      window.location.replace('/admin/surveys');
    }
  });
}

// AJAX call closes survey and updates tables
function closeSurvey(id) {
  $.ajax('/api/surveys/'+id+'/close', {
    cache: false,
    type: 'PUT',
    success: function(data) {
      window.location.replace('/admin/surveys');
    }
  });
}