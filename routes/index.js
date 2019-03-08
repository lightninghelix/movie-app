const express = require("express"),
      router = express.Router(),
      passport = require("passport"),
      User = require("../models/user");

router.get("/", function(req, res) {
    res.render("landing");
});

router.get("/search", function (req, res) {
   res.render("search"); 
});



router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
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