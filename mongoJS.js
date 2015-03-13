//mongoJS
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var url = require('url');
var readline = require('readline');
var ROOT_DIR = "html/";
http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  // If this is our comments REST service
  if(urlObj.pathname.indexOf("comment") !=-1) {
    console.log("comment route");
    if(req.method === "POST") {
     

	 console.log("POST comment route");
	var jsonData = "";
      req.on('data', function (chunk) {
        jsonData += chunk;
      });
      req.on('end', function () {
        var reqObj = JSON.parse(jsonData);
        console.log(reqObj);
        console.log("Name: "+reqObj.Name);
        console.log("Comment: "+reqObj.Comment);

	MongoClient.connect("mongodb://localhost/weather",function(err,db) {
		if(err) throw err;
		db.collection('comments').insert(reqObj,function(err,records){
			console.log("Record added as "+records[0]._id);
			});
		});
      });
	
	res.writeHead(200);
	res.end("");


    }
     else if(req.method ==="GET")     
	{
		var itemArrOut="";
		MongoClient.connect("mongodb://localhost/weather",function(err,db) {
			if(err) throw err;
			db.collection("comments",function(err,comments){
				comments.find(function(err,items){
					items.toArray(function(err,itemArr){
					console.log("Document Array: ");
					console.log(itemArr);
					itemArrOut = itemArr;
					res.writeHead(200);
					res.end(JSON.stringify(itemArr));
					});
				});
			});
		});
	 // console.log("________________________");
//	console.log(itemArrOut);
//console.log("______________________________");	
//	  res.writeHead(200);

//	  res.end(JSON.stringify(itemArrOut));	
	}
	


  } else {
   // Normal static file
    fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
     // res.writeHead(200);
     // res.end(data);
	
	//console.log(data.toString());
	res.writeHead(200);
	res.end(data);



		
    });
	
//	var jsonData = "";
//     req.on('data', function (chunk) {
//        jsonData += chunk;
//      });
//      req.on('end', function () {
//        var reqObj = JSON.parse(jsonData);
//        console.log(reqObj);
 //       console.log("Name: "+reqObj.Name);
   //     console.log("Comment: "+reqObj.Comment);
     


  }
}).listen(80);
