// app.js


// Set up =================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var controllers = {
	surveyapp : require('./controllers/surveyapp'),
	admin : require('./controllers/admin'),
	api : require('./controllers/api')
};


// Configuration ==========================================
mongoose.connect('mongodb://localhost/surveyapp');
 
app.configure(function(){

    // Set up express application
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
});


// Authenticator
auth = express.basicAuth('bob', 'password');


// Public Routes ==========================================
app.get('/surveys/to/:id', controllers.surveyapp.welcome);
app.get('/surveys/to/:id/begin', controllers.surveyapp.begin);
app.get('/surveys/:id/u/:participant_id', controllers.surveyapp.getSurvey);
app.get('/surveys/thankyou', controllers.surveyapp.thankyou);


// Admin Routes ===========================================
// Survey Routes
app.get('/', auth, controllers.admin.listSurveys);
app.get('/admin/surveys', auth, controllers.admin.listSurveys);
app.get('/admin/surveys/new', auth, controllers.admin.newSurvey);
app.get('/admin/surveys/:id/responses', auth, controllers.admin.listSurveyResponses);
app.get('/admin/surveys/:id/responses/:response_id', auth, controllers.admin.showSurveyResponse);
app.get('/admin/surveys/:id', auth, controllers.admin.showSurvey);
app.get('/admin/surveys/:id/responses.csv', auth, controllers.admin.downloadSurvey);

// Participant Routes
app.get('/admin/participants', auth, controllers.admin.listParticipants);
app.get('/admin/participants/:id', auth, controllers.admin.showParticipant);


// API Routes =============================================
// API Survey Routes
app.post('/api/surveys/new', controllers.api.postSurvey);
app.post('/api/questions/new', controllers.api.postQuestion);
app.put('/api/surveys/:id/publish', controllers.api.publishSurvey);
app.put('/api/surveys/:id/close', controllers.api.closeSurvey);
app.get('/api/surveys/:id', controllers.api.getSurvey);
app.delete('/api/surveys/:id', controllers.api.deleteSurvey);
app.delete('/api/surveys/:survey_id/responses/:response_id', controllers.api.deleteResponseFromSurvey);
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


// Launch =================================================
app.listen(3000);
console.log("Express server listening on port 3000");





