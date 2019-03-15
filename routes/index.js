const express  = require("express"),
      router   = express.Router(),
      passport = require("passport"),
      User     = require("../models/user"),
      MovieDB  = require('moviedb')(process.env.MOVIEDB_API_KEY);

router.get("/", function(req, res) {
    res.render("landing");
});

router.post("/search", function (req, res) {
    let results = [];
    MovieDB.searchMovie({ query: req.body.term }, (err, result) => {
        // console.log(res.results[0]);
        results = result.results;
        console.log(results);
        res.render("results", {results: results});
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
        successRedirect: "/movies",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/movies"); 
});

module.exports = router;