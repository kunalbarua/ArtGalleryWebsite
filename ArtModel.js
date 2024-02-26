//Import the mongoose module
let pkg = require('mongoose');

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a citizen
const artSchema = Schema({
    name: String,
    artist: String,
    year: Number,
    category: String,
    medium: String,
    description: String,
    image: String,
    review: Array,
    rating: Array,
    workshop: Array,
    average: Number,
    filtered: Boolean,
    follower: Array
});

var artwork = model("artwork", artSchema);

module.exports = artwork;
