// Change the host to localhost if you are running the server on your
// own computer.

function addworkshop(){
    
    let workshop = document.getElementById("wname").value;
    let artist = document.getElementById("uname").innerHTML;

    if(workshop == ""){

        alert("Empty field(s)!");
        return;
    }

	let newWorkshop = { workshop: workshop, artist: artist };
	
	fetch(`http://localhost:3000/newworkshop`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWorkshop)
    })

    .then((response) => {
        // Our handler throws an error if the request did not succeed.
        if (!response.ok) {
            document.getElementById("wname").innerHTML = "";
			alert("Error");
            location.reload();
        } else {
            document.getElementById("wname").innerHTML = "";
            alert("Workshop added");
			location.reload();
		}
    })
    // Catch any errors that might happen, and display a message.
    .catch((error) => console.log(error));

}