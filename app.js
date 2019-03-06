const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      Movie = require("./models/movie");
      
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/search", function (req, res) {
   res.render("search"); 
});

app.get("/movies", function(req, res) {
   Movie.find({}, function(err, foundMovies) {
       if(err) {
           console.log(err);
       } else {
           res.render("movies", {movies: foundMovies});
       }
   });
});

app.post("/movies", function(req, res) {
    var title = req.body.title;
    var director = req.body.director;
    var poster = req.body.poster;
    var year = req.body.year;
    
    var newMovie = {
        title: title,
        director: director,
        poster: poster,
        year: year
    };
    
    Movie.create(newMovie, function(err, movie) {
       if (err) {
           console.log(err);
       } else {
           res.redirect("/movies");
       }
    });
});

app.get("/movies/new", function(req, res){
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started!!!");
});