//Import the mongoose module
let pkg = require('mongoose');

//mongoose modules -- you will need to add type": "module" to your package.json
const { Schema, model} = pkg;

//Define the Schema for a citizen
const userSchema = Schema({
    username: String,
    password: String,
    activity: Array,
    rated: Array
});

var users = model("users", userSchema);

module.exports = users;
