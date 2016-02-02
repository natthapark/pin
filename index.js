
var app = require('express')();
var bodyParser = require('body-parser');
var mongojs = require('./db');
var db = mongojs.connect;

var http = require('http').Server(app);
var io = require('socket.io')(http);
 

var port = process.env.PORT || 8080;

/*   MiddleWare   */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


app.get('/find/:id', function (req, res) {
    var id = req.params.id;
	 db.users.findOne({username: id}, function(err, docs) {	
	 
		if(docs != null){
			if(docs.username == id){
				
			res.json({"username":docs.username,"location":docs.location});
			
		}
		}else{
			 res.json({"status":false});	
		}
				
    });
});

 
app.post('/newuser', function (req, res) {
    var json = req.body;
	db.users.findOne({username: json.username}, function(err, docs) {	
		if(docs != null){
				res.json({"status":false});	
		}else{
			db.users.insert(json, function(err, docs) {
        
				if(docs != null){
					res.json({"username":docs.username});
				}else{
					res.json({"status":false});	
				}
		
			});
		}
	});

});
 
app.post('/update_location', function (req, res) {
    var json = req.body;
	 db.users.update({username: json.username}, {$set: { location: json.location}}, function (err, docs) {
		 if(docs != null){
			res.json({"location":json.location});
		}else{
			res.json({"status":false});	
		}
		
	 });
	

});

app.post('/update_id', function (req, res) {
    var json = req.body;
	db.users.findOne({id: json.id}, function(err, docs) {	
		if(docs != null){
	
			res.json({"status":false});
			///////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////
			//console.log(docs.id); แสดงผลได้
			///////////////////////////////////////////////////////////////
			//res.json(docs.id); error!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
			///////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////
		}else{
			
			db.users.update({username: json.username}, {$set: { id: json.id}}, function (err, docs) {
				if(docs != null){
					res.json({"status":true});	
				}else{
					res.json({"status":false});	
				}
			});
		}
				
    });
	
	

});


app.post('/addfriend', function (req, res) {
    var json = req.body;
	
   db.friends.insert(json, function(err, docs) {
        
		if(docs != null){
			res.json({"friendid":docs.friendid});
		}else{
			res.json({"status":false});	
		}
		
    });

});



/* สั่งให้ server ทำการรัน Web Server ด้วย port ที่เรากำหนด */
app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});
http.listen(8081, function(){
  console.log('Starting chat on 8081');
});

io.on('connection', function(socket){
  socket.on('chater', function(msg){
    console.log('message: ' + msg);
	io.emit('chater', msg);
  });
});