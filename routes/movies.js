const express = require("express"),
      router = express.Router(),
      Movie = require("../models/movie");

router.get("/", function(req, res) {
   Movie.find({}, function(err, foundMovies) {
       if(err) {
           console.log(err);
       } else {
           res.render("movies/index", {movies: foundMovies});
       }
   });
});

router.post("/", function(req, res) {
    var title = req.body.title;
    var director = req.body.director;
    var poster = req.body.poster;
    var year = req.body.year;
    var synopsis = req.body.synopsis;
    
    var newMovie = {
        title: title,
        director: director,
        poster: poster,
        year: year,
        synopsis: synopsis
    };
    
    Movie.create(newMovie, function(err, movie) {
       if (err) {
           console.log(err);
       } else {
           res.redirect("/movies");
       }
    });
});

router.get("/new", function(req, res){
   res.render("movies/new"); 
});

router.get("/:id", function(req, res) {
    Movie.findById(req.params.id).populate("reviews").exec(function(err, foundMovie) {
       if (err) {
           console.log(err);
       } else {
           res.render("movies/show", {movie: foundMovie});
       }
    });
});

module.exports = router;