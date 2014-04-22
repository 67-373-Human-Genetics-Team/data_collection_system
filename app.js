var express = require('express');
var app = express();
var mongoose = require('mongoose');
var controllers = {
	surveyapp : require('./controllers/surveyapp'),
	admin : require('./controllers/admin'),
	api : require('./controllers/api')
};

mongoose.connect('mongodb://localhost/surveyapp');
 
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
});

// Routes
app.get('/', controllers.surveyapp.home);
app.get('/login', controllers.surveyapp.login);
app.get('/logout', controllers.surveyapp.logout);
app.get('/surveys', controllers.surveyapp.listSurveys);

// Participant creation page
app.get('/surveys/to/:id', controllers.surveyapp.welcome);
app.get('/surveys/to/:id/begin', controllers.surveyapp.begin);
app.get('/surveys/:id/u/:participant_id', controllers.surveyapp.getSurvey);
app.get('/surveys/thankyou', controllers.surveyapp.thankyou);
app.get('/surveys/:id', controllers.surveyapp.getSurvey);

/* Admin Controller*/
// Survey Routes
app.get('/admin/surveys', controllers.admin.listSurveys);
app.get('/admin/surveys/new', controllers.admin.newSurvey);
app.get('/admin/surveys/:id/metrics', controllers.admin.listSurveyMetrics);
app.get('/admin/surveys/:id/responses', controllers.admin.listSurveyParticipants);
app.get('/admin/surveys/:id/responses/:response_id', controllers.admin.showSurveyResponse);
app.get('/admin/surveys/:id', controllers.admin.showSurvey);

// Response Routes
app.get('/admin/responses', controllers.admin.listResponses);
app.get('/admin/responses/:id', controllers.admin.showResponse);

// Participant Routes
app.get('/admin/participants', controllers.admin.listParticipants);
app.get('/admin/participants/:id', controllers.admin.showParticipant);



/* API Controller */
// API Survey Routes
app.post('/api/surveys/new', controllers.api.postSurvey);
app.post('/api/questions/new', controllers.api.postQuestion);
app.put('/api/surveys/:id/publish', controllers.api.publishSurvey);
app.put('/api/surveys/:id/close', controllers.api.closeSurvey);
app.get('/api/surveys/:id', controllers.api.getSurvey);
app.delete('/api/surveys/:id', controllers.api.deleteSurvey);
app.delete('/api/surveys/:survey_id/questions/:question_id', controllers.api.deleteQuestion);

// API Response Routes
app.post('/api/responses/new', controllers.api.postResponse);
app.get('/api/responses/:id', controllers.api.getResponse);
app.delete('/api/responses/:id', controllers.api.deleteResponse);

// API Participant Routes
app.post('/api/participants/new', controllers.api.postParticipant);
app.put('/api/participants/:id', controllers.api.updateCompletedSurveys);
app.get('/api/participants/:id', controllers.api.getParticipant);
app.delete('/api/participants/:id', controllers.api.deleteParticipant);

app.listen(3000);
console.log("Express server listening on port 3000");





