var express = require("express");
var app = express();
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var sanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/dog_app", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());

var dogSchema = new mongoose.Schema({
	 name: String,
	 image: String,
	 description: String,
	 age: Number
});

var Dog = mongoose.model("Dog", dogSchema);

//INDEX ROUTE
app.get("/", function(req, res){
	res.redirect("/dogs");
});

app.get("/dogs", function(req, res){
	 Dog.find({}, function(err, dogs){
	 	if(err){
	 		console.log("Error Has Occured!");
	 	} else {
	 			res.render("index", {dogs: dogs});
	 	}
	 });
});


//New Route
app.get("/dogs/new", function(req, res){
  res.render("new");	
});

//Create Route
app.post("/dogs", function(req, res){
   req.body.dog.description = req.sanitize(req.body.dog.description);
   Dog.create(req.body.dog, function(err, createdDog){
   	 if(err){
   	 	console.log(err);
   	 	console.log("Error Occured When Created A Dog!");
   	 } else {
   	 	res.redirect("/dogs");
   	 }
   });	
});

//Show Route
app.get("/dogs/:id", function(req, res){
  Dog.findById(req.params.id, function(err, foundDog){
  	 if(err){
  	 	console.log("Really Cool Error");
  	 } else {
  	 	res.render("show", {dog: foundDog});
  	 }
  });	
});

//EDIT route 
app.get("/dogs/:id/edit", function(req, res){
  Dog.findById(req.params.id, function(err, editDog){
  	if(err){
  	  console.log("error");
  	} else {
  	  res.render("edit",{dog: editDog});
  	}
  });
});

//Update route
app.put("/dogs/:id", function(req, res){
  req.body.dog.description = req.sanitize(req.body.dog.description);
  Dog.findByIdAndUpdate(req.params.id, req.body.dog, function(err, updatedDog){
  	if(err){
  	   res.redirect("/dogs/");
  	} else {
  	   res.redirect("/dogs/" + req.params.id);
  	}
  });
});

//Delete Route
app.delete("/dogs/:id", function(req, res){
	Dog.findByIdAndRemove(req.params.id, function(err, removedDog){
		if(err){
			console.log("error");
		} else {
			res.redirect("/dogs");
		}
	});
});


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Server Has Started!");
});