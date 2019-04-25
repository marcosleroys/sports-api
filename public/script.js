function onload(){
	let url = "./sports/api/list-sports";
	let settings = {
		method : "GET",
		headers : {
			'Content-Type' : 'application/json'
		}
	};

	fetch(url, settings)
		.then(response => {
			if (response.ok){
				return response.json();
			}
			throw Error(response.statusText);
		})
		.then(responseJSON => {
			displaySportList(responseJSON);
		})
		.catch(err => {
			console.log(err);
		});
}


$(onload);