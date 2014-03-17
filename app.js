var express = require('express');
var mongoose = require('mongoose');
var controllers = {
	survey : require('./controllers/survey'),
	admin : require('./controllers/admin')
};
var app = module.exports = express.createServer();

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
app.get('/surveys', controllers.survey.list);
app.get('/suveys/new', controller.survey.post);

app.listen(3000);
console.log("Express server listening on port 3000");