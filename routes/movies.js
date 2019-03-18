const express = require("express"),
      router = express.Router(),
      Movie = require("../models/movie"),
      middleware = require("../middleware"),
      MovieDB  = require('moviedb')(process.env.MOVIEDB_API_KEY);

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
    MovieDB.movieInfo({id: req.body.id}, (err, result) => {
        if (err) {
            console.log(err);
            req.flash("error", "Movie not found");
            return res.redirect("back");
        }
        MovieDB.movieCredits({id: req.body.id}, (err, credits) => {
            if (err) {
                console.log(err);
                req.flash("error", "Movie not found");
                return res.redirect("back");
            }
            var title = result.title;
            var id = result.id;
            var director = credits.crew[0].name;
            var posterLarge = "http://image.tmdb.org/t/p/w342" + result.poster_path;
            var posterSmall = "http://image.tmdb.org/t/p/w92" + result.poster_path;
            var year = result.release_date;
            var synopsis = result.overview;
    
            var newMovie = {
                title: title,
                id: id,
                director: director,
                posterLarge: posterLarge,
                posterSmall: posterSmall,
                year: year,
                synopsis: synopsis
            };
    
            Movie.create(newMovie, function(err, movie) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/movies/" + result.id);
                }
            });
        });
    });
});

// router.get("/new", function(req, res){
//   res.render("movies/new"); 
// });

router.get("/:id", function(req, res) {
    Movie.findOne({id: req.params.id}).populate("reviews").exec(function(err, foundMovie) {
      if (err || !foundMovie) {
          req.flash("error", "Movie not found");
          res.redirect("back");
      } else {
          res.render("movies/show", {movie: foundMovie});
      }
    });
});

module.exports = router;