const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User     = require("../models/user"),
      Movie    = require("../models/movie"),
      MovieDB  = require('moviedb')(process.env.MOVIEDB_API_KEY);

router.get("/", function(req, res) {
    res.render("landing");
});

router.post("/search", function (req, res) {
    const regex = new RegExp(req.body.term, "i");
    Movie.find({title: regex}, function(err, results) {
        if (err) {
            req.flash("error", "Movie not found");
            return res.redirect("/");
        } else {
            MovieDB.searchMovie({ query: req.body.term }, (err, result) => {
                let TMBDResults = result.results;
                res.render("results", {results: results, TMDBResults: TMBDResults});
            });
        }
    });
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/movies"); 
        });
    });
});

router.get("/login", function(req, res) {
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/movies");
});

module.exports = router;