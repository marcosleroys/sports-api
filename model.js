const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let sportSchema = mongoose.Schema({
	id : {type : Number, required : true, unique : true},
	name : {type : String, required : true}
});

let Sports = mongoose.model('Sports', sportSchema);

const ListSports = {
	get : function(){
		return Sports.find()
			.then(sports => {
				return sports;
			})
			.catch(err => {
				throw new Error(err);
			});
	},
	post : function(newSport){
		return Sports.create(newSport)
			.then( sport => {
				return sport;
			})
			.catch( err => {
				throw new Error(err);
			});
	},
	getSportById : function(id){
		return Sports.findOne({"id" : id}, {_id: 0})
			.then( sport => {
				return sport;
			})
			.catch( err => {
				throw new Error(err);
			});
	},
	updateSport : function(id, name){
		return Sports.findOneAndUpdate({"id" : id}, {"name" : name}, {new : true})
			.then( sport => {
				return sport;
			})
			.catch( err => {
				throw new Error(err);
			});
	},
	delete : function(id){
		return Sports.findOneAndDelete({"id" : id}, {projection: { "id" : 1, "name" : 1}})
			.then( sport => {
				return sport;
			})
			.catch( err => {
				throw new Error(err);
			});
	}

}

module.exports = {ListSports};
