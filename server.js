var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var logger = require("morgan");
var port = process.env.PORT || 3030;
var app = express();
var mongoose = require("mongoose");
 
//Require all models
var db = require("./models");

// putting our routes here
app.use(logger("dev"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/pottermorearticles";
mongoose.connect(MONGODB_URI);
app.listen(port, function(){
    console.log(`app listening on port ${port}`);
});

app.get("/scrape", function(req, res) {
    
    axios.get("https://www.pottermore.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    

    $(".home-item__wrapper").each(function(i, element) {
        var results = [];
         var title = $(element).find(".home-item__content-inner").text().replace(/\s\s+/g, "");
         var link = $(element).find(".home-item__link").attr("href");
        

         if (link != undefined) {
            results.push({
                 title: title,
                link: `https://www.pottermore.com${link}`,
            }); 
         }

         db.Article.create(results)
         .then(function(dbArticle) {
             console.log(dbArticle);
         })
         .catch(function(err) {
             console.log(err)
         });
        });
        res.send("Scrape Complete");
});
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id })
    .populate("notes")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
    .then(function(dbNote) {
      return dbArticle.findOneAndUpdate({ _id: req.params.id }, { notes: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  