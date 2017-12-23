//---------------Grab articles as Json ------------//

	$.getJSON("/articles",function(dataFromDB){
		//go thru each article and append the the "articles" div
		for (var i = 0; i < dataFromDB.length; i++){
			var oneArticle = `<p ArtDBid = "` + dataFromDB[i]._id+
			`">` + dataFromDB[i].title + `<br/>` + dataFromDB[i].link + `</p>`;
			$("#articles").append(oneArticle);
		}
	});
//-------------------------------------------------//


// ---------When Clicking on an article-----------//

	// When the user clicks on an article, there should
	// be a request to get the article data fom the DB
	$(document).on("click","p",function(){
		var artRefId = $(this).attr("ArtDBid");
		$("#notes").empty();
		// Make an ajax call for the ONE article

		$.ajax({
			method: "GET",
			url: "/articles/" + artRefId
		})
		// When you have the article data, provide the user
		// the option to add/delete a note
		.done(function(oneArticleWithLink){

			//If there is already a note, display it, and 
			// offer the chance to delete the note
			if (oneArticleWithLink.note){
				$("#noteInput").val(oneArticleWithLink.note.content);
				$("#notes").append(`<button data-id = "` + artRefId + ` id = "deleteNote">Delete Current Note</button>`);
			}

			$("#notes").append(`<h3>` + oneArticleWithLink.title + `</h3>`);
			$("#notes").append(`<inputid='titleinput' name='title' >`);
			$("#notes").append(`<textarea id = "noteInput" name = "body"></textarea>`);
			$("#notes").append(`<button data-id = "` + artRefId + `" id = 'addNote'>Add a Note</button>`);
		})
	})
//-------------------------------------------------//


//------------When Clicking on Add Note------------//

	//when adding a note, we have to make an ajax
	// POST request to 
	$(document).on("click", "#addNote", function(){
		$.ajax({
			method: "POST",
			url: "/articles/" + $(this).attr("data-id"),
			data: {
				content: $("#noteInput").val()
			}
		})
		// Now that we have added a note, clear the note div
		// so that on the next article, the use has the option
		// to enter a new note 
		.done(function(data){
			$("#notes").empty()
		})
	})
//-------------------------------------------------//



//-----------When Clicking on Delete Note-----------//
	//when deleting a note, we have to make an ajax
	// POST request to 
	$(document).on("click", "#deleteNote", function(){
		$.ajax({
			method: "POST",
			url: "/articles/" + $(this).attr("data-id"),
			data: {
				content: "PrepToDelete"
			}
		})
		.done(function(data){
			$("#notes").empty()
		})
	})
//-------------------------------------------------//