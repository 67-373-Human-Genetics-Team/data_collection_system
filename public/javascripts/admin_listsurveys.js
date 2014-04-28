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

// Redirects to  survey by survey ID
function getSurvey(id) {
  window.location.href("/admin/surveys/"+id);
}