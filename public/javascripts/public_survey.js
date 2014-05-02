// public/javascripts/public_survey.js


// Document Ready
$(function() {

  // Hide elements
  $("#survey-title").hide();
  $("#participant-survey-form").hide();

  // Get participant id from URL pathname and update value
  var participant_id = window.location.pathname.split( '/' ).pop();
  $("#participant_id").val(participant_id);

  // Get participant firstname lastname and call publications api
  getParticipant(participant_id);

  $("#participant-survey-form").submit(postResponse);
    
});

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
    // console.log('Function getPublications: '+name);

    var limit = 10;
    pubmedSearch(name, limit, function(err, publications) {
      if(err) { console.log(err.toString()); return;}
      
      $("#publications-box").fadeIn('slow');
      $("#patents-box").fadeIn('slow');

      $('#publications-box').append("<form id='publications-form'></form>");

      for (var i=0; i<publications.length; i++) {
          $('#publications-form').append("<div><input class='publication' type='checkbox' onclick='toggle();' value='"+publications[i].title+"'>"+publications[i].title+" ("+publications[i]['pub-date']+")"+"</input></div>")
      }

      $('#publications-form').append("<button type='button' onclick='populatePublicationDropdown();'>Confirm</button>");

    });
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

    // Check if form inputs are complete
    $(".question-area").each( function (i) {
      if ($(this).attr('class') === "Short Text question-area") {
        if ($(this).children("input:text").val() === "") {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          answers.push($(this).children("input:text").val());
        }

      } else if ($(this).attr('class') === "Long Text question-area") {
        if ($(this).children("textarea").val() === "") {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          answers.push($(this).children("textarea").val());
        }

      } else if ($(this).attr('class') === "Checkbox question-area") {
        var checked = $(this).children("div").children("input").filter(":checked").map(function(){ return $(this).val();}).get();
        if (checked.length == 0) {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          answers.push(checked);
        }

      } else if ($(this).attr('class') === "Dropdown question-area") {
        if ($(this).children("select").children("option").filter(":selected").val() === "") {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          answers.push($(this).children("select").children("option").filter(":selected").val());
        }

      } else if ($(this).attr('class') === "Multiple Choice question-area") {
        if ($(this).children("div").children("input").filter(":checked").length == 0) {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          answers.push($(this).children("div").children("input").filter(":checked").val());
        }

      } else if ($(this).attr('class') === "Company question-area") {
        // Company Name and Title Position are required but Salary is optional
        // Company Name is company[0], Title Position is company[1]
        var company = $(this).children("input:text").map(function(){ return $(this).val();}).get();
        if (company[0] === "" || company[1] === "") {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          var company = $(this).children("input:text").map(function(){ return $(this).val();}).get();
          company[2] = company[2].replace(/\W+/g,""); // strip salary of all non-numeric characters
          answers.push(company);
        }

      } else if ($(this).attr('class') === "Patent question-area") {
        if ($(this).find("textarea").val() === "") {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          var patent = [];
          patent.push($("#patent-dropdown option:selected").val());
          patent.push($("#patent-textarea").val());
          answers.push(patent);
        }

      } else if ($(this).attr('class') === "Publication question-area") {
        if ($(this).find("textarea").val() === "") {
          $(this).find("h3").css("background-color","#f2dede");
          $("#response").html("Please answer the questions you've missed.").css("background-color","#f2dede").fadeIn(function() {
            setTimeout(function() {
              $("#response").fadeOut("slow");
            }, 4000);
          });
          return false;
        } else {
          var publication = [];
          publication.push($("#publication-dropdown option:selected").val());
          publication.push($("#publication-textarea").val());
          answers.push(publication);
        }
      }
    });
    // console.log(answers.join(" "));
    $.ajax({
      url: '/api/responses/new', 
      type: 'POST',
      data: {
          survey_id: survey_id,
          answers: answers.join("::"),
          participant_id: participant_id
      },
      success: function(data) {
        if (data === "Submitted") {
          updateParticipantSurveys(participant_id,survey_id);
        } else {
          console.log(data);
        }
      }
    });
    return false;    
};

// Update participant's completed surveys
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

"<eSearchResult><Count>110</Count><RetMax>110</RetMax><RetStart>0</RetStart><IdList> <Id>23138302</Id> <Id>22852449</Id> <Id>22830016</Id> <Id>22827596</Id> <Id>22406228</Id> <Id>21379579</Id> <Id>21255762</Id> <Id>21250555</Id> <Id>21217814</Id> <Id>21046548</Id> <Id>20832112</Id> <Id>20404173</Id> <Id>20197096</Id> <Id>20138404</Id> <Id>20068591</Id> <Id>20067632</Id> <Id>21537449</Id> <Id>19935831</Id> <Id>19732867</Id> <Id>19525223</Id> <Id>19450457</Id> <Id>19361613</Id> <Id>19352374</Id> <Id>19274735</Id> <Id>19270676</Id> <Id>19215054</Id> <Id>19193627</Id> <Id>19170447</Id> <Id>19047183</Id> <Id>19013281</Id> <Id>18839057</Id> <Id>18836535</Id> <Id>18794863</Id> <Id>18789830</Id> <Id>18769715</Id> <Id>18752025</Id> <Id>18649390</Id> <Id>18617537</Id> <Id>18606304</Id> <Id>18602390</Id> <Id>18572275</Id> <Id>18488026</Id> <Id>18452155</Id> <Id>18332434</Id> <Id>18280754</Id> <Id>18270320</Id> <Id>18252217</Id> <Id>18179879</Id> <Id>17982457</Id> <Id>17977095</Id> <Id>17975299</Id> <Id>17671248</Id> <Id>17661425</Id> <Id>17553421</Id> <Id>17522105</Id> <Id>17512701</Id> <Id>17474819</Id> <Id>17470457</Id> <Id>17357082</Id> <Id>17286446</Id> <Id>17269488</Id> <Id>17160900</Id> <Id>17156488</Id> <Id>17103432</Id> <Id>17077275</Id> <Id>17062589</Id> <Id>17053149</Id> <Id>16933213</Id> <Id>16920408</Id> <Id>16914832</Id> <Id>16773128</Id> <Id>16669732</Id> <Id>16601881</Id> <Id>16571880</Id> <Id>16539205</Id> <Id>16524466</Id> <Id>16446702</Id> <Id>16283527</Id> <Id>16262895</Id> <Id>16242812</Id> <Id>16197552</Id> <Id>16158439</Id> <Id>16098236</Id> <Id>16078860</Id> <Id>15922682</Id> <Id>15906096</Id> <Id>15833046</Id> <Id>15780141</Id> <Id>15753370</Id> <Id>15749281</Id> <Id>15558749</Id> <Id>15505052</Id> <Id>15387886</Id> <Id>15273283</Id> <Id>15137903</Id> <Id>15037594</Id> <Id>15035510</Id> <Id>12928814</Id> <Id>12817998</Id> <Id>12811539</Id> <Id>12779011</Id> <Id>12714628</Id> <Id>12702575</Id> <Id>12673792</Id> <Id>12593803</Id> <Id>12209015</Id> <Id>12036489</Id> <Id>11937576</Id> <Id>11935316</Id> <Id>11827456</Id> </IdList> <TranslationSet><Translation>     <From>dietrich stephan</From>     <To>Stephan, Dietrich[Full Investigator Name]</To>    </Translation></TranslationSet><TranslationStack>   <TermSet>    <Term>Stephan, Dietrich[Full Author Name]</Term>    <Field>Full Author Name</Field>    <Count>109</Count>    <Explode>N</Explode>   </TermSet>   <TermSet>    <Term>Stephan, Dietrich[Full Investigator Name]</Term>    <Field>Full Investigator Name</Field>    <Count>1</Count>    <Explode>N</Explode>   </TermSet>   <OP>OR</OP>   <OP>GROUP</OP>  </TranslationStack><QueryTranslation>Stephan, Dietrich[Full Author Name] OR Stephan, Dietrich[Full Investigator Name]</QueryTranslation> </eSearchResult>"







