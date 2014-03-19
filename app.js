var express = require('express');
var app = express();
var mongoose = require('mongoose');
var controllers = {
	survey : require('./controllers/survey'),
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
});

// Routes
app.get('/', controllers.survey.home);
app.get('/admin/surveys', controllers.admin.list);
app.get('/admin/survey/new', controllers.admin.newsurvey);
app.post('/api/new', controllers.api.post);
app.delete('/api/surveys/:id', controllers.api.delete);

app.listen(3000);
console.log("Express server listening on port 3000");