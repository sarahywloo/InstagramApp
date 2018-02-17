var express = require('express');

// Creating an instance of the express object so that we can use all the express methods 
var app = express();

// Third party library to fetch instagram api
var instagram = require('instagram-node').instagram();

// Setting a middleware to tell node where to look for static files like css images etc
app.use(express.static(__dirname + '/public'));

// Setting the templating engine 'ejs'
app.set('view engine', 'ejs');


instagram.use({ access_token: '***' });
instagram.use({ client_id: '***',
                client_secret: '***' });
 
var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};
 
exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!');
    }
  });
};

app.get('/', function(req, res){
  instagram.media_popular(function(err, medias, remaining, limit){
    if(err){
      return console.error(err);
    }
    res.render('pages/index', { grams: medias });
  });
});

app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/handleauth', exports.handleauth);


app.listen(3000, function(err){
  if(err){
    console.log(err);
  } else {
    console.log('Listening on port 3000, http://localhost:3000')
  }
});
