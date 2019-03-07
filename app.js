const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      Movie = require("./models/movie"),
      Review = require("./models/review"),
      User = require("./models/user");
      
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
           res.render("movies/index", {movies: foundMovies});
       }
   });
});

app.post("/movies", function(req, res) {
    var title = req.body.title;
    var director = req.body.director;
    var poster = req.body.poster;
    var year = req.body.year;
    var synopsis = req.body.synopsis
    
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

app.get("/movies/new", function(req, res){
   res.render("movies/new"); 
});

app.get("/movies/:id", function(req, res) {
    Movie.findById(req.params.id).populate("reviews").exec(function(err, foundMovie) {
       if (err) {
           console.log(err);
       } else {
           res.render("movies/show", {movie: foundMovie});
       }
    });
});

app.get("/movies/:id/reviews/new", isLoggedIn, function(req, res) {
    Movie.findById(req.params.id, function(err, movie) {
        if (err) {
            console.log(err);
        } else {
            res.render("reviews/new", {movie: movie});
        }
    });
});

app.post("/movies/:id/reviews", isLoggedIn, function(req, res) {
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

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
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

app.get("/login", function(req, res) {
   res.render("login"); 
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/movies",
        failureRedirect: "/login"
    }), function(req, res) {
});

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/movies"); 
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started!!!");
});