var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    release_year: Number,
    poster: String
});

module.exports = mongoose.model("Movie", movieSchema);