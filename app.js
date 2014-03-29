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
app.get('/surveys', controllers.surveyapp.surveys);
app.get('/surveys/:id', controllers.surveyapp.getSurvey);

app.get('/admin/surveys', controllers.admin.listSurveys);
app.get('/admin/surveys/new', controllers.admin.newSurvey);
app.get('/admin/surveys/:id', controllers.admin.showSurvey);

// API Routes
app.post('/api/surveys/new', controllers.api.postSurvey);
app.post('/api/questions/new', controllers.api.postQuestion);
app.get('/api/surveys/:id', controllers.api.getSurvey);
app.delete('/api/surveys/:id', controllers.api.deleteSurvey);
app.delete('/api/surveys/:survey_id/questions/:question_id', controllers.api.deleteQuestion);

app.listen(3000);
console.log("Express server listening on port 3000");