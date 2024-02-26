//This code is part of my solution for Tutorial 2

let x = 5;
let rating = -1;

function init(){
    document.getElementById("stars").innerHTML = genStars(x);
    document.getElementById("buttons").innerHTML = genButtons(x);
}

function genStars(Rating){
    let result = `<p id="stars">`;
    for(let i=1; i<=Rating; i++){
        result += `<span id="rating${i}">&#9733;</span> `;
    }
    result += `</p>`
    return result;
}

function genButtons(Rating){
    let result = `<div id="buttons">`;
    for(let i=0; i<=Rating; i++){
        result += `<button type="button" onclick="updateRating(${i})">Rate ${i}</button>&nbsp;`;
    }
    result += `</div>`
    return result;
}

function updateRating(newRating) {    

    rating = newRating;
    
    for(let i=1; i<=newRating; i++){
    document.getElementById("rating"+i).style.color = "blue";
    }
    
    for(let j=newRating+1; j<=x; j++){
    document.getElementById("rating"+j).style.color = "lightgray";
    }
    
}

function deleteArt(){

    let uid = document.getElementById("uid").innerHTML;

    let obj = {_id: uid};

    fetch(`http://localhost:3000/deleteart`, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("Something went wrong");
        } else {
            alert("Art Deleted");
			location.href=`http://localhost:3000/gallery`;
		}
    })

}

function updateArt(){

    let uid = document.getElementById("uid").innerHTML;
    let review = document.getElementById("areview").value;

    let obj = {_id: uid,
                rating: rating,//Global Value
                review: review
                };

    fetch(`http://localhost:3000/updateArt`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("Something went wrong");
        } else {
            location.reload();
            document.getElementById("areview").innerHTML = "";
            alert("Art Updated");
		}
    })

}

function filterSearch(){

    let name = document.getElementById("sname").value;
    let artist = document.getElementById("sartist").value;
    let category = document.getElementById("scategory").value;

    let obj = {name: name,
        artist: artist,
        category: category
        };

    fetch(`http://localhost:3000/filterSearch`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })  
    
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
            location.href=`http://localhost:3000/gallery`;
            document.getElementById("sname").innerHTML = "";
            document.getElementById("sartist").innerHTML = "";
            document.getElementById("scategory").innerHTML = "";
			alert("No results found");
        } else {
            location.href=`http://localhost:3000/gallery`;
            document.getElementById("sname").innerHTML = "";
            document.getElementById("sartist").innerHTML = "";
            document.getElementById("scategory").innerHTML = "";
		}
    })
}

function followArtist(){

    let uid = document.getElementById("uid").innerHTML;
    let user = document.getElementById("user").innerHTML;
    let artist = document.getElementById("artistname").innerHTML;

    console.log(uid)
    console.log(user)

    let obj = {_id: uid,
               username: user,
               artist: artist
            };

    fetch(`http://localhost:3000/followArtist`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })  
    
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("Something went wrong");
        } else {
            location.reload();
            alert("Followed");
		}
    })
}


function unfollowArtist(){

    let uid = document.getElementById("uid").innerHTML;
    let user = document.getElementById("user").innerHTML;
    let artist = document.getElementById("artistname").innerHTML;

    console.log(uid)
    console.log(user)

    let obj = {_id: uid,
               username: user,
               artist: artist
            };

    fetch(`http://localhost:3000/unfollowArtist`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })  
    
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("Something went wrong");
        } else {
            location.reload();
            alert("Unfollowed");
		}
    })
}

function deleteReview(){

    let uid = document.getElementById("uid").innerHTML;
    let username = document.getElementById("username").innerHTML;

    let obj = {_id: uid, username: username };

    fetch(`http://localhost:3000/deleteReview`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })  
    
    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("Something went wrong");
        } else {
            location.reload();
		}
    })
}

function enrollworkshop(){
    alert("enrolled");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
