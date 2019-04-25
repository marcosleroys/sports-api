const express = require('express');
const router = express.Router();
const {ListSports} = require('./model');

const bcrypt = require('bcryptjs');

router.get('/list-sports', (req, res, next) => {

	ListSports.get()
	.then( sports => {
		res.status(200).json({
			message: 'Successfully sending the sports',
			status: 200,
			sports : sports
		}).catch( err => {
			res.status(500).json({
				message: "Internal server error.",
				status: 500
			});
			return next();
		});
	});

});

router.post('/post-sport', (req, res, next) => {
	let requiredFields = ['id', 'name'];

	for(let i = 0; i < requiredFields.length; i++){
		let currentField = requiredFields[i];

		if (!(currentField in req.body)){
			res.status(406).json({
				message: `Missing field ${currentField} in body.`,
				status: 406
			});
			return next();
		}
	}

	/*
	bcrypt.hash(req.body.name, 10)
		.then(hashedName => {
			let objectToAdd = {
				id: req.body.id,
				name: hashedName
			};
		})
		.catch(err => {
			res.status(500).json({
				message: "Internal server error.",
				status: 500
			});
			return next();
		}); 
	*/

	let objectToAdd = {
		id: req.body.id,
		name: req.body.name
	};

	ListSports.post(objectToAdd)
		.then(sport => {
			res.status(201).json({
				message: "Successfully added the sport",
				status: 201,
				sport: sport
			});
		}).catch( err => {
			res.status(500).json({
				message: "Internal server error.",
				status: 500
			});
			return next();
		});

	//Validate that we recieve both of the params
	//Send error with status 406 "Missing fields"

	//Validate that the id recieved is in the
	//current array. Send an error if it isn't
	//stats code 409

	//Success callback with status 201 with the 
	//just created object
});

router.get('/list-sports/:id', (req, res, next) => {
	let sportId = req.params.id;

	ListSports.getSportById(sportId)
		.then(sport => {
			res.status(200).json({
				message: `Successfully sent the sport with id: ${sportId}.`,
				status: 200,
				sport: sport
			});
		}).catch(err => {
			res.status(400).json({
				message: "Sport not found in the database",
				status: 400
			});
		});
});

router.put('/update-sport/:id', (req, res, next) => {
	let sportId = req.params.id;
	let updatedName = req.body.name;

	if(!updatedName){
		res.status(400).json({
			message: "No name passed in the body",
			status: 400
		});
		return next();
	}

	ListSports.updateSport(sportId, updatedName)
		.then( sport => {
			res.status(200).json({
				message: `Succesfully upadted the sport with id ${sportId}`,
				status: 200,
				newName: sport
			});
		}).catch( err => {
			res.status(400).json({
				message: `The id: ${sportId} is not found.`,
				status: 400
			});
		});
});

router.delete('/remove-sport/:id', (req, res, next) => {
	let paramId = req.params.id;
	let bodyId = req.body.id;

	if(!bodyId){
		res.status(400).json({
			message: `Id is not sent in the body.`,
			status: 400
		});
		return next();
	}

	if(paramId != bodyId){
		res.status(400).json({
			message: `Parameter Id is different than body Id.`,
			status: 400
		});
		return next();
	}

	ListSports.delete(bodyId)
		.then( sport => {
			res.status(202).json({
				message: `Sport with id: ${paramId} deleted successfully.`,
				status: 202,
				sport: sport
			});
		})
		.catch( err => {
			res.status(404).json({
				message: `Sport with id: ${paramId} not found.`,
				status: 404
			});
		});
});


module.exports = router;

/*
router.get('/list-sports', (req, res, next) => {

	let infoOfAllSports = ListSports.get();

	if (infoOfAllSports){
		res.status(200).json({
			message: "Successfully sent the list of sports",
			status: 200,
			sports: infoOfAllSports
		});
	} else {
		res.status(500).json({
			message: "Internal server error.",
			status: 500
		});
		return next();
	}
});

router.post('/post-sport', (req, res, next) => {
	let requiredFields = ['id', 'name'];

	for(let i = 0; i < requiredFields.length; i++){
		let currentField = requiredFields[i];

		if (!(currentField in req.body)){
			res.status(406).json({
				message: `Missing field ${currentField} in body.`,
				status: 406
			});
			return next();
		}
	}


	let sportId = req.body.id;
	let sportName = req.body.name;

	if (ListSports.verifyId(sportId)){
		res.status(409).json({
			message: `That id is already in use`,
			status: 409
		});
		return next();
	}


	let objectToAdd = {
		id: sportId,
		name: sportName
	};

	let objectAdded = ListSports.post(objectToAdd);
	res.status(201).json({
		message: "Successfully added the sport",
		status: 201,
		sport: objectAdded
	});

	//Validate that we recieve both of the params
	//Send error with status 406 "Missing fields"

	//Validate that the id recieved is in the
	//current array. Send an error if it isn't
	//stats code 409

	//Success callback with status 201 with the 
	//just created object
});

router.delete('/remove-sport/:id', (req, res, next) => {
	let paramId = req.params.id;
	let bodyId = req.body.id;

	let sportToDelete = ListSports.get();

	if(paramId != bodyId){
		res.status(400).json({
			message: `Parameter Id is different than body Id.`,
			status: 400
		});
		return next();
	}

	sportToDelete.forEach(item =>{
		if(item.id == paramId){
			sportToDelete.splice(item, 1);

			res.status(202).json({
				message: `Sport with id: ${paramId} deleted successfully.`,
				status: 202
			});
		}
	});

	res.status(404).json({
		message: `Sport with id: ${paramId} not found.`,
		status: 404
	});
	return next();
});

module.exports = router;


/*


app.get('/list-sports-with-headers', (req, res) =>{
	let sportId = req.get('id');

	sportsArray.forEach(item => {
		if (item.id == sportId){
			res.status(200).json({
				message: "Successfully sent the id.",
				status: 200,
				sport: item
			});
		}
	});

	res.status(400).json({
		message: "Sport not found in the list",
		status: 400
	});

});



app.get('/list-sports/:id', (req, res) => {
	let sportId = req.params.id;

	sportsArray.forEach(item => {
		if (item.id == sportId){
			res.status(200).json({
				message: "Successfully sent the id.",
				status: 200,
				sport: item
			});
		}
	});

	res.status(400).json({
		message: "Sport not found in the list",
		status: 400
	});

});

app.put('/update-sport/:id', jsonParser, (req, res) => {
	let sportId = req.params.id;
	let nameUpdated = req.body.name;

	for(let i = 0; i < sportsArray.length; i++){
		if(sportId == sportsArray[i].id){
			sportsArray[i].name = nameUpdated;

			res.status(200).json({
				message: `Succesfully upadted the sport with id ${sportId}`,
				status: 200,
				newName: nameUpdated
			});
		}
	}

	res.status(400).json({
		message: `The id: ${sportId} is not found.`,
		status: 400
	});
});

app.delete('/remove-sport/:id', jsonParser, (req, res) => {
	let paramId = req.params.id;
	let bodyId = req.body.id;

	if(paramId != bodyId){
		res.status(400).json({
			message: `Parameter Id is different than body Id.`,
			status: 400
		});
	}

	sportsArray.forEach(item =>{
		if(item.id == paramId){
			sportsArray.splice(item, 1);

			res.status(202).json({
				message: `Sport with id: ${paramId} deleted successfully.`,
				status: 202
			});
		}
	});

	res.status(404).json({
		message: `Sport with id: ${paramId} not found.`,
		status: 404
	});
});

app.post('/post-sport', jsonParser, (req, res) => {
	let requiredFields = ['id', 'name'];

	for(let i = 0; i < requiredFields.length; i++){
		let currentField = requiredFields[i];

		if (!(currentField in req.body)){
			res.status(406).json({
				message: `Missing field ${currentField} in body.`,
				status: 406
			});
		}
	}


	let sportId = req.body.id;
	let sportName = req.body.name;

	sportsArray.forEach(item => {
		if( sportId == item.id){
			res.status(409).send({
				message: `That id is already in use`,
				status: 409
			});
		}
	});

	let objectToAdd = {
		id: sportId,
		name: sportName
	};

	sportsArray.push(objectToAdd);
	res.status(201).json({
		message: "Successfully added the sport",
		status: 201,
		sport: objectToAdd
	});

	//Validate that we recieve both of the params
	//Send error with status 406 "Missing fields"

	//Validate that the id recieved is in the
	//current array. Send an error if it isn't
	//stats code 409

	//Success callback with status 201 with the 
	//just created object
});
*/