const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      flash          = require("connect-flash"),
      User           = require("./models/user");
    
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("sxuccess");
   next();
});

const movieRoutes    = require("./routes/movies"),
      reviewRoutes   = require("./routes/reviews"),
      indexRoutes    = require("./routes/index");

app.use(indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/reviews", reviewRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started!!!");
});