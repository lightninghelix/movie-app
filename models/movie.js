var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    release_year: Number,
    poster: String,
    synopsis: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

module.exports = mongoose.model("Movie", movieSchema);