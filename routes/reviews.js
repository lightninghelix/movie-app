const express = require("express"),
      router = express.Router({mergeParams: true}),
      Movie = require("../models/movie"),
      Review = require("../models/review");

router.get("/new", isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if (err) {
            console.log(err);
        } else {
            res.render("reviews/new", {movie: movie});
        }
    });
});

router.post("/reviews", isLoggedIn, function(req, res) {
   Movie.findById(req.params.id, function(err, movie) {
       if (err) {
           console.log(err);
           res.redirect("/movies");
       } else {
           Review.create(req.body.review, function(err, review) {
              if (err) {
                  console.log(err);
              } else {
                  movie.reviews.push(review);
                  movie.save();
                  res.redirect("/movies/" + movie._id);
              }
           });
       }
   });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;