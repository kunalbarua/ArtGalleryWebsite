//for rated.pug
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
            location.href=`http://localhost:3000/rated`;
            document.getElementById("sname").innerHTML = "";
            document.getElementById("sartist").innerHTML = "";
            document.getElementById("scategory").innerHTML = "";
			alert("No results found");
        } else {
            location.href=`http://localhost:3000/rated`;
            document.getElementById("sname").innerHTML = "";
            document.getElementById("sartist").innerHTML = "";
            document.getElementById("scategory").innerHTML = "";
		}
    })
}
