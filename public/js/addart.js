// Change the host to localhost if you are running the server on your
// own computer.

function addItem(){
    
	let artist = document.getElementById("artist").innerHTML;
	let name = document.getElementById("aname").value;
	let year = document.getElementById("ayear").value;
    let category = document.getElementById("acategory").value;
    let medium = document.getElementById("amedium").value;
    let description = document.getElementById("adescription").value;
    let image = document.getElementById("aimage").value;
    let review = [];
    let rating = [-1,1];
    let workshop = [];
    let filtered =false;
    let follower = [];

    if(artist == "" || name == "" || year == "" || category == "" || medium == "" || description == "" || image == ""){

        alert("Empty field(s)!");
        return;
    }
    if(isNaN(year)){
        alert("Must input a number");
        return;
    }

	let newArt = { 
                    name: name, 
                    artist: artist,
                    year: year,
                    category: category,
                    medium: medium,
                    description: description,
                    image: image,
                    review: review,
                    rating: rating,
                    workshop: workshop,
                    filtered: filtered,
                    follower: follower
                    };
	
	fetch(`http://localhost:3000/addart`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newArt)
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
			alert("Art Exists");
        } else {
            document.getElementById("aname").innerHTML = "";
            document.getElementById("ayear").innerHTML = "";
            document.getElementById("acategory").innerHTML = "";
            document.getElementById("amedium").innerHTML = "";
            document.getElementById("adescription").innerHTML = "";
            document.getElementById("aimage").innerHTML = "";
            alert("Art added");
			location.href=`http://localhost:3000/gallery`;
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(err));

}
