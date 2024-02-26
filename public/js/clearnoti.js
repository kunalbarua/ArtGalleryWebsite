function clearNotification(){

    let username = document.getElementById("user").innerHTML;

    let obj = {username: username};

    fetch(`http://localhost:3000/clearnoti`, {
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
