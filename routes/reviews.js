const express = require("express"),
      router = express.Router({mergeParams: true}),
      Movie = require("../models/movie"),
      Review = require("../models/review"),
      middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if (err || !movie) {
            req.flash("error", "Movie not found");
            return res.redirect("back");
        } else {
            res.render("reviews/new", {movie: movie});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
   Movie.findById(req.params.id, function(err, movie) {
       if (err) {
           console.log(err);
           res.redirect("/movies");
       } else {
           Review.create(req.body.review, function(err, review) {
              if (err) {
                  console.log(err);
              } else {
                  review.author.id = req.user._id;
                  review.author.username = req.user.username;
                  review.save();
                  movie.reviews.push(review);
                  movie.save();
                  res.redirect("/movies/" + movie._id);
              }
           });
       }
   });
});

router.get("/:review_id/edit", middleware.checkReviewOwnership, function(req, res) {
    Movie.findById(req.params.id, function (err, foundMovie) {
        if (err || !foundMovie) {
            req.flash("No Movie found");
            return res.redirect("back");
        }
        Review.findById(req.params.review_id, function(err, foundReview) {
            if (err) {
                res.redirect("back");
            } else {
                res.render("reviews/edit", {movie_id: req.params.id, review: foundReview});
            }
        });
    });
});

router.put("/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, function(err, updatedReview) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/movies/" + req.params.id);
       }
    });
});

router.delete("/:review_id", middleware.checkReviewOwnership, function(req, res) {
   Review.findByIdAndRemove(req.params.review_id, function(err) {
       if (err) {
           res.redirect("back");
       } else{
           res.redirect("/movies/" + req.params.id);
       }
   });
});

module.exports = router;