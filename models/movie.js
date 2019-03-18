var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    title: String,
    id: Number,
    director: String,
    release_year: Number,
    posterLarge: String,
    posterSmall: String,
    synopsis: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

module.exports = mongoose.model("Movie", movieSchema);