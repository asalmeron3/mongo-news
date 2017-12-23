//----------------Dependencies-----------------//
	var mongoose = require("mongoose");
//---------------------------------------------//

// ---- A reference to the Schema constructor ---//
	var Schema  = mongoose.Schema;
//-----------------------------------------------//

//-------------Create New Article Schema---------------//

	//The article requires a title and link. There should also
	//an optional key/column for adding notes. 
	var ArticleSchema = new Schema ({
		title: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		},
		// "ref" is needed to reference the Note model
		// We will use the Note's Id to reference it 
		note: {
			type: Schema.Types.ObjectId,
			ref: "notes"
		}
	});
//-----------------------------------------------//


//-----------Create Model with Schema-------------//
	var articles = mongoose.model("articles",ArticleSchema);
//-----------------------------------------------//

module.exports = articles;