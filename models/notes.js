// ------------------Dependencies -------------------//
	var mongoose = require("mongoose");
//---------------------------------------------------//



//-------------Reference to the Schema -------------//
	var Schema = mongoose.Schema;
//-------------------------------------------------//


//---------------Create note schema ------------------//
	var NoteSchema = new Schema({
		content:String,
	});
//----------------------------------------------------//


//-----------Create Model with Schema-------------//
	var notes = mongoose.model("notes",NoteSchema);
//-----------------------------------------------//

module.exports = notes;