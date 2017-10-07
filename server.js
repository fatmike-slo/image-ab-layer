const express = require("express");
const app = express();

/* 
url
snippet
thumbnail
context
*/
const bodyParser = require("body-parser");
const promise = require("promise");
const cors = require("cors");
const path = require("path");

const handleBars = require("express-handlebars");

const Db = require("./db.js");

const bing = require("node-bing-api")({
    accKey: "e6cb5048441042969d892cee76179cb9"
});

app.use(cors());
app.use(bodyParser.json());
app.use("hbs", handleBars({
    extname:"hbs",
    defaultLayout:"layout",
    layoutsDir:__dirname + "layout"
}));

app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "hbs");

/* splash screen */
app.get("/",(req,res)=> {
        res.sendFile(__dirname + "/index.html");
        });

app.get("/api/imagesearch/:search", (req, res) => {
    let searchWord = req.params.search;
    let offset;
    if (req.query.offset) {
        offset = req.query.offset
    }
    // perform search with bing api
    bing.images(searchWord, {
        count: 10,
        offset: offset
    }, (err, response, body) => {
        let dataArr = [];
        body.value.forEach((item) => {
            dataArr.push({
                url: item.contentUrl,
                snippet: item.name,
                thumbnail: item.thumbnailUrl,
                context: item.hostPageUrl
            })
        });
        res.json(dataArr)
    });
    // get date
    let getDate = new Date();
    // save searchword in db
    let searchWordDb = new Db({
        term: searchWord,
        when: getDate.toISOString()
    }).save((err) => {
        if (err) {
            console.log('error when saving to db', err);
        }
        console.log('data successfully added');
    });

});

app.get("/api/latest/imagesearch", (req, res) => {
    Db.find({}, (err, data) => {
        if (err) {
            console.log("error occured: ", err);
        }
        let responseArr = [];
        data.forEach((item) => {
            responseArr.push({
                term: item.term,
                when: item.when
            });
        });
        res.json(responseArr);
    });
});
app.listen(process.env.PORT || 3000, () => {
    console.log("server online at port 3000");
});