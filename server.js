//--------------Dependencies-------------------//

  var express = require("express");
  var bodyParser = require("body-parser");
  var logger = require("morgan");
  var mongoose = require("mongoose");


  //-----------Scraping Tools----------//
    var axios = require("axios");
    var cheerio = require("cheerio");
  //-----------------------------------//


  //---------------Models--------------//
    var db = require("./models");
  //-----------------------------------//

//---------------------------------------------//

var PORT = process.env.PORT || 3000;
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://heroku_79dz90sv:npirbjn2nhork1gna0m7ndlhio@ds133547.mlab.com:33547/heroku_79dz90sv" || "mongodb://localhost/mongoNews", {
  useMongoClient: true
});


//-----------------Route for Scrapping ------------------//
  
  // A GET route for scraping the echojs website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("h2.story-heading").each(function(i, element) {
        // Save an empty result array
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");

        // Create a new article using the `result` object built from scraping
        db.article
          .create(result)
          .then(function(dbArticle) {
            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            // res.json(err);
          });
      });
    });
  });

//-----------------------------------------------------//



// ------------Route for getting ALL Articles---------//

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // get ALL the articles from the DB
    db.article
      .find({})
      .then(function(dbArticle) {
        // Send all the articles back as JSON
        res.json(dbArticle);
      })
      .catch(function(err) {
        // catch your error and send them as json
        res.json(err);
      });
  });

//--------------------------------------------------//


// ------------Route for GETting one Article---------//

  // Route for grabbing a specific Article by id

  app.get("/articles/:id", function(req, res) {
    // use the id parameter to run a mongo query
    db.article
      .findOne({ _id: req.params.id })
      // usus populate so that the associate note in the "notes"
      // table/db is also attached and returned
      .populate("notes")
      .then(function(dbArticle) {
        // return the article data (with note) as json
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
//--------------------------------------------------//


//-----------Route for POST ing to ONE Article------------//
  app.post("/articles/:id", function(req, res) {
    db.notes
      // create the note by using the request's body
      .create(req.body)
      //once note is created, find the article associated to this note so that we can send back to the user
      .then(function(dbNote) {
        console.log(req.body);
        if (req.body.content ==="PrepToDelete"){
          db.notes.findOneAndUpdate({ _id: dbNote._id}, { $unset : { content : 1}});
          return db.articles.findOneAndUpdate({ _id: req.params.id }, { $unset : { note : 1}});
        }
        else{
          return db.article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });

        }
      })
      .then(function(dbArticle) {
      // send the user the article that you found relating to the note (as JSON) 
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
//--------------------------------------------------//


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
