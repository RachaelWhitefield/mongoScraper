var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var handlebars = require("express-handlebars");
var port = process.env.PORT || 3030;
var app = express();
var mongoose = require("mongoose");

// putting our routes here
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", handlebars({defaultLayout:"main"}));
app.set("view engine", "handlebars");
var htmlRoutes = require("./routes/htmlRoutes");

// use the routes here
app.use("/", htmlRoutes);
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/pottermorearticles";
mongoose.connect(MONGODB_URI);
app.listen(port, function(){
    console.log(`app listening on port ${port}`);
});


axios.get("https://www.pottermore.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    var results = [];

    $(".home-item__wrapper").each(function(i, element) {
         var title = $(element).find(".home-item__content-inner").text().replace(/\s\s+/g, "");
         var link = $(element).find(".home-item__link").attr("href");
        

         if (link != undefined) {
            results.push({
                 title: title,
                link: `https://www.pottermore.com${link}`,
            }); 
         }

         
         
        });
        
        console.log(results);
})

