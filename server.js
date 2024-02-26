//Create express app
const express = require('express');
let app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Database variables
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
var ObjectId = require('mongodb').ObjectId;
let db;

//View engine
app.set("view engine", "pug");
app.use(express.static("public"));

//Creating session
const session = require('express-session');
const connectMongoDBSession = require('connect-mongodb-session');

const MongoDBStore = connectMongoDBSession(session);

//Defining the location of the sessions data in the database.
var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/',
    collection: 'sessions'
  });
  
//Setting up the express sessions to be stored in the database.
app.use(session(
    { 
    secret: 'top secret key',
    resave: true,
    saveUninitialized: false,
    store: store, 
    artist: false
    })
);

let pkg = require('mongoose');
const { connect, Types } = pkg;

let User = require('./UserModel.js');
let Art = require('./ArtModel.js');

//process.env.PORT will see if there is a specific port set in the environment.
const PORT = process.env.PORT || 3000;

app.get(["/", '/Home'], (req,res) => {
    res.render("home", { session: req.session });
})


// Rendering the registration page.
app.get("/register", (req, res) => {

        res.render("register", { session: req.session });
     
});

app.get("/notification", async (req, res) => {

    let arr=[];
    const searchResult = await User.find({username: req.session.username});

    if(searchResult[0] != null){
        arr = searchResult[0].activity;
        res.render("notification", { notifications:arr, session: req.session });
    }
    else{
        res.render("notification", { notifications:arr, session: req.session });
    }
     
});

// Saving the user registration to the database.
app.post("/register", async (req, res) => {

    let newUser = req.body;

    try{
        const searchResult = await User.findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await User.create(newUser);
            res.status(200).send();
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }  

});

// Search the database to match the username and password .
app.post("/login", async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

    try {
        const searchResult = await User.findOne({ username: username });
        if(searchResult != null) { 
            if(searchResult.password === password) {
                // If we successfully match the username and password
                // then set the session properties.  We add these properties
                // to the session object.
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                req.session["artist"] = false;
                req.session["filter"] = false;
                res.render('home', { session: req.session })
            } else {
                res.status(401).send("Not authorized. Invalid password.");
            }
        } else {
            res.status(401).send("Not authorized. Invalid password.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }    

});

// Log the user out of the application.
app.get("/logout", (req, res) => {

    // Set the session loggedin property to false.
	if(req.session.loggedin) {
		req.session.loggedin = false;

	}
	res.redirect(`http://localhost:3000/home`);

});


app.get("/gallery", async (req,res) => {

    const searchResult = await Art.find({filtered: true});

    if(searchResult[0] != null){
        const search = await Art.updateMany({ filtered: true}, {$set: { filtered: false}});

        res.render("gallery", {arts:searchResult, session: req.session });
    }
    else{

        const result = await Art.find({});

        res.render("gallery", {arts:result, session: req.session });
    }

})

app.get("/rated", async (req,res) => {

    const userSearch = await User.find( { username: req.session.username } );
    let art_gallery=[];

    if(userSearch[0].rated.length > 0){

        art_gallery = await Art.find({filtered: true, _id: userSearch[0].rated});

    }

    if(art_gallery[0] != null){
        const search = await Art.updateMany({ filtered: true}, {$set: { filtered: false}});

        console.log(art_gallery)

        res.render("rated", {arts:art_gallery, session: req.session });
    }
    else{

        art_gallery=[];

        const searchResult = await Art.find({_id: userSearch[0].rated});
        console.log(searchResult);

        res.render("rated", {arts:searchResult, session: req.session });
    }
})

app.put("/filterSearch", async (req,res) => {

    req.session.filter = true;

    let rname = req.body.name;
    let rartist = req.body.artist;
    let rcategory = req.body.category;

    if(rname == ""){
        rname = -1;
    }
    if(rartist == ""){
        rartist = -1;
    }
    if(rcategory == ""){
        rcategory = -1;
    }

    let name = new RegExp(rname, "g");
    let artist = new RegExp(rartist, "g");
    let category = new RegExp(rcategory, "g");

    const searchResult = await Art.find( { $or: [ { $and: [ {name: { $regex: name } }, {artist: { $regex: artist } }, {category: { $regex: category } } ] },  
                                                  { $and: [ {name: { $regex: name } }, {artist: { $regex: artist } } ] }, 
                                                  { $and: [ {name: { $regex: name } }, {category: { $regex: category } } ] }, 
                                                  { $and: [ {artist: { $regex: artist } }, {category: { $regex: category } } ] },   
                                                  { name: { $regex: name }  },
                                                  { artist: { $regex: artist }  },    
                                                  { category: { $regex: category }  },  
                                                    ] } )

    console.log(searchResult);
    if(searchResult[0] == null){
        res.status(404).json({'error': 'Not found'});
    }
    else{
        searchResult.forEach( async (art) => {
            // art.filtered = true;

            await Art.updateOne({ _id: art._id}, {$set: { filtered: true}});
        })

        res.status(200).json({'error': 'Found'});
    }
    
})

app.put("/followArtist", async (req,res) => {

    let id = new ObjectId(req.body._id);
    let artist = req.body.artist;
    let user = req.body.username;
    let arr;

    const searchResult = await Art.find( { artist: artist } );

    if(searchResult[0] != null){
        arr = searchResult[0].follower;
        if(arr.indexOf(user) == -1){
            arr.push(user);
        }
        await Art.updateMany( { artist: artist }, { $set: { follower: arr } } );

        const result = await Art.find( { _id: id } );
        console.log(result);

        res.status(200).send("Success");
    }
    else{
        res.status(404).send("error");
    }
})


app.put("/unfollowArtist", async (req,res) => {

    let id = new ObjectId(req.body._id);
    let user = req.body.username;
    let artist = req.body.artist;
    let arr;

    const searchResult = await Art.find( { artist: artist } );

    if(searchResult[0] != null){
        arr = searchResult[0].follower;

        arr.splice(arr.indexOf(user), 1)
        
        const rs = await Art.updateMany( { artist: artist }, { $set: { follower: arr } } );

        if(rs.acknowledged == false || rs.modifiedCount == 0){
            res.status(404).send("error");
        }
        else{
            const result = await Art.find( { _id: id } );
            console.log(result);

            res.status(200).send("Success");
        }
    }
    else{
        res.status(404).send("error");
    }
})



app.get("/addart", (req,res) => {
    res.render("addart", { session: req.session });
})

//Retrieving artist's art(s)
app.get("/artwork/:artist", async (req,res) => {
    
    console.log(req.params.artist);

    let artist = req.params.artist;

    const searchResult = await Art.find({artist: artist});

    console.log(searchResult);

    res.render("artist", {arts:searchResult, session: req.session });

})


app.get("/workshop", (req,res) => {
    res.render("workshop", { session: req.session });
})

app.get("/account", (req,res) => {

    res.render("account", { session: req.session });
})


//retreiving unique art
app.get("/artist/:artID", async (req,res) => {

    let oid = new mongo.ObjectId(req.params.artID); 

    const searchResult = await Art.find({_id:oid});

    let art = searchResult[0];

    if(art.rating.length == 2){
        res.render("art", {art : art, session: req.session });
    }
    else{
        let avg = 0.0;
        for(let i=2; i<art.rating.length; i++){

            avg += art.rating[i];

        }

        avg = avg/(art.rating.length - 2);
        avg = avg.toFixed(2);

        art["average"] = avg;

        const result = await Art.updateOne({_id: oid}, {$set: {average: avg}});

        // console.log(art);

        res.render("art", {art : art, session: req.session });
    }

})

//Switching to artist account
app.get("/switchtoArtist", async(req,res) => {
    
    req.session.artist = true; 
    console.log(req.session.username);
    
    const searchResult = await Art.find({artist: req.session.username});

    if(searchResult[0] != null){
        res.redirect(`http://localhost:3000/home`);
    }
    else{
        res.redirect(`http://localhost:3000/addart`);
    }
})

//switching to patron account
app.get("/switchtoPatron", async(req,res) => {
    
    req.session.artist = false; 

    res.render("home", ({ session: req.session }));

})


//Adding workshop to database
app.post("/workshop", (req,res) => {

    db.collection("gallery")
})


//Adding workshop to database
app.post("/addart", async (req,res) => {

    let newArt = req.body;

    const result = await Art.find({name: newArt.name});
    
    if(result[0] != null){
        res.status(404).json({'error': 'Exists'});
    }
    else{

        let today = new Date();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        const searchResult = await Art.create(new Art(newArt));

        const result = await Art.find({artist: newArt.artist});

        let followers = result[0].follower;
        
        if(followers.length > 0){
            followers.forEach( async (user) => {
                let rs = await User.find({username: user});
                let arr = rs[0].activity;
                arr.push(newArt.artist + " added new art ("+ (newArt.name) + ") on " + date + " at " + time);
                await User.updateOne({username: user}, {$set: {activity: arr}});
                let user_test = await User.find({username: user})
                console.log(user_test);
            })
        }

        res.status(200).json(searchResult);
    }
})

app.post("/newworkshop", async (req,res) => {

    let artist = req.body.artist;
    let workshop = req.body.workshop;

    console.log(workshop);

    const result = await Art.find({artist: artist});

    console.log(result);

    if(result.length == 0){
        res.status(404).json({ error: "Add art first"});
    }

    else{
        //Retreiving workshop array
        let arr = result[0].workshop;
        let flag = false;

        arr.forEach(ws => {
            if(ws == workshop){
                flag = true;
            }
        });

        if(flag){
            res.status(404).json({ error: "Already Exists"});
        }
        else{
            arr.push(workshop);
            const searchResult = await Art.updateMany({ artist: artist }, { $set: { workshop: arr } });
            console.log(searchResult);
            res.status(200).send("Added");
        }

    }

})

app.put("/updateArt", async (req, res) => {

    let id = req.body._id;
    let rate = req.body.rating;
    let review = req.body.review;

    let result = await Art.find({_id: id});

    if(result.length == 0){
        res.status(404).send("Not found");
    }
    else{

        let usersearch = await User.find( { username: req.session.username } );

        console.log(usersearch);


        if(usersearch[0].rated.indexOf(id) == -1){
            let act_arr = usersearch[0].rated;
            act_arr.push(id);

            await User.updateOne( { username: req.session.username }, { $set: { rated: act_arr } } );
        }
        let usersearch2 = await User.find( { username: req.session.username } );

        console.log(usersearch2);

        //Retreiving rating array
        let arr = result[0].rating;
        let obj_rev = result[0].review[0];
        console.log(obj_rev);
        let arr_rev = [];
        
        if(obj_rev != null){

            if(obj_rev.hasOwnProperty(req.session.username)){
                arr_rev = obj_rev[req.session.username];
            }
        }
        else{

            obj_rev = {};
        }

        if(rate != -1){
            arr.push(rate);
        }
        if(review != ""){
            arr_rev.push(review);
        }

        obj_rev[req.session.username] = arr_rev;
        let array = [obj_rev];

        const searchResult = await Art.updateOne({ _id: id }, { $set: { rating: arr, review: array } });
        console.log(searchResult);
        res.status(200).send("Added");
        
    }
})

app.put("/clearnoti", async (req,res) => {

    username = req.body.username;

    let arr=[];

    const result = await User.updateOne({username: username}, { $set: { activity: arr } });

    res.send();
})

app.put("/deleteReview", async (req,res) => {

    let id = req.body._id;
    let user = req.body.username;

    let result = await Art.find({_id: id});
    let userSearch = await User.find( { username: req.session.username } );

    let arr = userSearch[0].rated;
    arr.splice(arr.indexOf(id), 1);

    await User.updateOne( { username: req.session.username }, { $set: { rated: arr } } );

    console.log(result[0].review)

    let obj_rev = result[0].review[0];

    if(obj_rev.hasOwnProperty(user)){

        delete obj_rev[user];
        let array = [obj_rev];
        if(Object.keys(obj_rev).length == 0){
            array = [];
        }
        const searchResult = await Art.updateOne({ _id: id }, { $set: { review: array } });
        res.status(200).send();
    }
    else{
        res.status(404).send("Error");
    }

})

//Delete Art
app.delete("/deleteart", async (req,res) => {

    let obj_id = Types.ObjectId(req.body._id);
    await Art.deleteOne({_id:obj_id, session: req.session});
    res.send();
})



const loadData = async () => {
	
	//Connect to the mongo database
  	const result = await connect('mongodb://localhost:27017/');
    return result;

};

loadData()
  .then(() => {

    app.listen(PORT);
    console.log("Listen on port:", PORT);

  })
  .catch(err => console.log(err));