
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  socket = require('./routes/socket.js'),
  config = require('./config.js'),
  app = module.exports = express(),
  server = require('http').createServer(app)
, https = require('https')
, path = require('path')
, io = require('socket.io').listen(server)
, spawn = require('child_process').spawn
, omx = require('omxcontrol')
, EventEmitter = require( "events" ).EventEmitter;


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('ejs').renderFile);  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication

//Run and pipe shell script output
function run_shell(cmd, args, cb, end) {
    var spawn = require('child_process').spawn,
        child = spawn(cmd, args),
        me = this;
    child.stdout.on('readable', function () { cb(me, child.stdout); });
    child.stdout.on('end', end);
}
var ss;
//Socket.io Server
io.sockets.on('connection', function (socket) {

 socket.on("screen", function(data){
   socket.type = "screen";
   ss = socket;
   console.log("Screen ready...");
 });
 socket.on("remote", function(data){
   socket.type = "remote";
   console.log("Remote ready...");
 });

 socket.on("controll", function(data){
  console.log(data);
  if(socket.type === "remote"){

   if(data.action === "tap"){
     if(ss != undefined){
      ss.emit("controlling", {action:"enter"});
    }
  }
  else if(data.action === "swipeLeft"){
    if(ss != undefined){
      ss.emit("controlling", {action:"goLeft"});
    }
  }
  else if(data.action === "swipeRight"){
   if(ss != undefined){
     ss.emit("controlling", {action:"goRight"});
   }
 }
}
});
 socket.on("log", function(data){
  console.log(data);
});
 socket.on("video", function(data){

  if( data.action === "play"){
    console.log(data.video_id);
    var id = data.video_id,
    url = "http://www.youtube.com/watch?v="+id;
    var runShell = new run_shell('youtube-dl',['-gf', '18/22/34/35/37', url],
      function (me, stdout) { 
                me.stdout = stdout.read().toString().replace(/[\r\n]/g, "");
                socket.emit("video",{output: "loading"});
                omx.start(me.stdout);
                omx.ev.on('omx_status', function(data) {
                    socket.emit("video",{status: data, video_id:id});
                });
              }, 
              function (me) {
                socket.emit("video",{status: "now_playing", video_id:id});
              });
  }
  if( data.action == "stream") {
    var id = data.video_id, 
    url = "https://api.put.io/v2/files/"+id+"/mp4/stream/?oauth_token="+config.settings.PUTIO_KEY;
    var options = {
      host: 'api.put.io',
      port: 443,
      path: '/v2/files/'+id+'/stream?oauth_token='+config.settings.PUTIO_KEY,
      method: 'GET'
    };
    
    var req = https.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      omx.start(res.headers.location);
    });
    req.end();
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
  }
  if (data.action == "pause") {
      omx.sendKey('p');
  }
  if (data.action == 'quit') {
      omx.sendKey('q');
  }
});
});

// Start server

server.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
