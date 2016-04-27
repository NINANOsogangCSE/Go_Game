var bodyParser = require('body-parser');
var lineReader = require('line-reader');
var fs = require('fs');
require('date-utils');

var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('Go/game'));

var W = "", B = "", Title = "";

function printLog(req, data){

	if (data === undefined)
		data = "";
	var dt = new Date();
	var d = dt.toFormat('YYYY-MM-DD HH24:MI:SS') + '\t';
	d += JSON.parse(JSON.stringify(req.ip)) + '\t';
	d += JSON.parse(JSON.stringify(req.headers))['user-agent'] + '\t';
	d += Title + '\t' + W + '\t' + B + '\t' + data + '\n';
	fs.appendFile('log.txt', d, (err) => {
		if (err) throw err;
	});

}

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
	console.log("get / -> send file index.html");
	var string = '';
	if(req.query.gameTitle || req.query.white || req.query.black){
		W = req.query.white;
		B = req.query.black;
		Title = req.query.gameTitle;
	}
	printLog(req);
	if (W && B && Title){
		res.redirect('/reg');
	}
});

app.get('/reg', function (req, res) {

	if (!(W && B && Title)){
		res.redirect('/');
	}else {
		var gameFile = "";
		fs.readFile(__dirname + "/game.html", 'utf8', function(err, data) {
			if (err){
				return console.log(err);
			}
			gameFile = data;
			gameFile = gameFile.replace("{{TITLE}}", Title);
			gameFile = gameFile.replace("{{W}}", W);
			gameFile = gameFile.replace("{{B}}", B);
			res.send(gameFile);
			console.log("get /reg -> send file game.html");
		});
		if (req.query.record) {
			printLog(req, JSON.parse(JSON.stringify(req.query.record)));
		}
	}
});

app.get('/log', function(req,res){
	res.sendFile(__dirname + '/log.html');
	console.log("get /log -> send file log.html");
});

app.post('/log', function(req,res){
	console.log("post /log -> find log matched with input regular expression");
	var expression=req.body.regular_expression;
	var line_num=0;
	var matched_num=0;
	var printline="";
	lineReader.eachLine('log.txt',function(line,last){
		line_num+=1;
		if(line.match(expression)){
			matched_num+=1;
			printline += line + '<br><br>';
		}
		if(last){
			printline = "<h1>총 " + line_num + "개의 log중 일치하는 log는 " + matched_num + "개 입니다.<br><br></h1>" + printline;
			res.send(printline);
		}
	});
});

app.listen(3000, function(){
	console.log('Example app listening on port 3000');
});

