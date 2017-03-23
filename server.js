var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  ,Twit = require('twit')
  , io = require('socket.io').listen(server)
  , path    = require("path"),
  bodyParser = require('body-parser');
server.listen(8080);

var options = { screen_name: 'rohitgilbile', count: 10 };
// routing
app.get('/', function (req, res) {
//    res.sendfile(__dirname + '/index.html');
  res.sendFile(path.join(__dirname+'/index.html'));
});
/*
  Publish post
  Method: Post
*/
app.get('/publishpost',function(req,res){
  console.log(req.query.message);
  T.post('statuses/update', { status:req.query.message }, function(err, data, response) {
      alert('Post Publish' );
  });
});
// Search Tweet
app.get('/searchTweet',function(req,res){
  var watchList = req.query.keyword;
  var stream = T.stream('statuses/filter', { track: watchList})
    stream.on('tweet', function (tweet) {
    //  res.sendfile(path.join(__dirname+'/contact.html'));
    //console.log(tweet.text);
      io.sockets.emit('keystream',tweet.text);
    });

});



 var watchList = ['love'];
 var T = new Twit({
    consumer_key:         'IrC9MfekmkZXe9RAKSPDSrLrr'
  , consumer_secret:      'HlvVbTNtemfFY23qQPpWY9r6GKj4tOBt9OFeEUPlXQxifZg0yr'
  , access_token:         '347757347-S2cgvXTC5wh6oiwP3JHgKMvwWfgZtPOBo61nZaPH'
  , access_token_secret:  'BQqgSl3X99DW86rsIJqUk54dM1eXNl4JJKU4UbmftCLbH'
})

io.sockets.on('connection', function (socket) {
  /*  var stream = T.stream('statuses/filter', { track: watchList})

    stream.on('tweet', function (tweet) {

    io.sockets.emit('stream',tweet.text);
  }); */
  /*var stream = T.stream('user', { stringify_friend_ids: true })
      stream.on('friends', function (friendsMsg) {
          io.sockets.emit('stream',tweet.text);
    });*/
  T.get('statuses/user_timeline', options , function(err, data) {
    for (var i = 0; i < data.length ; i++) {
      io.sockets.emit('stream',(data[i].text));
    }
  })

  // Followers listen
  T.get('followers/list', { screen_name: 'rohitgilbile' },  function (err, data, response) {
    //  console.log(data);
    io.sockets.emit('followersstream',(data));

})
  //ends
});

  /*T.post('statuses/update', { status: 'message'}, function(err, data, response) {
      console.log(data)
  }); */
