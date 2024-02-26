// Please note that I have used Tutorial 8 code as template to setup my database

const fs = require('fs');
const path = require('path');
let mongo = require('mongodb');

let MongoClient = mongo.MongoClient;

//Import the mongoose module.
let pkg = require('mongoose');
const { connect, connection } = pkg;

let User = require('./UserModel.js');
let Art = require('./ArtModel.js');


//Array of registered users.
const users = [
	{'username': 'iubfvjasvajbaubvajhbvaudb', 'password':'asbrgiuabs565g1rg*hbdhb', 'activity': [], 'rated': []}
    // {'username': 'fflintstone', 'password':'password'}
];

let db;
let gallery;

readJson();

const loadData = async () => {
	
	//Connect to the mongo database.
  	await connect('mongodb://localhost:27017/');

	//Remove database and start anew.
	await connection.dropDatabase();
	
	//Map each registered user object into the a new User model.
	let access = users.map( aUser => new User(aUser));
    let artwork = gallery.map( anArt => new Art(anArt))

	//Creates a new documents of a citizen and user and saves
	//it into the citizens and users collections.
	await User.create(access);
    await Art.create(artwork);
}

loadData()
  .then((result) => {
	console.log("Data loaded. Closing database connection (if running prevously).");
 	connection.close();
  })
  .catch(err => console.log(err));



//Reading JSON files
function readJson(){
    let i=0;
    let j=0;

    //Reading and sending JSON data
    fs.readdir(path.join(__dirname, 'gallery'), (error, files) => {
        if(error) throw error;

        fs.readFile(path.join(__dirname, 'gallery', 'gallery.json'), (error, content) => {
            if(error) throw error;

            //Copy data from here
            gallery = JSON.parse(content);

            gallery.forEach(art => {
                art["review"] = [];
                art["rating"] = [-1,1];
                art["workshop"] = [];
                art["average"] = 0.0;
                art["filtered"] = false;
                art["follower"] = [];
            });

            //console.log(gallery);

            i++;

        })



    })

}
