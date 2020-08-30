const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const dbName = "todoDB";

const url = "mongodb://localhost:27017";

const client = new MongoClient(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");

var items = new Array();
function retreiveData(){
    var store = new Array();
    client.connect(function(err){
        assert.equal(err, null);
        const db = client.db(dbName);
        const collection = db.collection("task");


        collection.find({}).toArray(function(err, result){
            assert.equal(err, null);
            console.log(result);
            for(var i=0; i < result.length; i++){
                store.push(result[i].name);
            }
        }); 
    });
    return store
}

items = retreiveData();


app.listen(3000, function(){
    console.log("Server running on port 3000.");
});

app.get("/",function(req, res){
    
    console.log(items);
    res.render("list", {itemsArray: items});
});

app.post("/", function(req, res){
    var item = {name: req.body.newItem};
    
    client.connect(function(err){
        assert.equal(err, null);
        const db = client.db(dbName);
        const collection = db.collection("task");


        collection.insertOne(item, function(err, result){
            assert.equal(err, null);
        });
    });
    items.push(req.body.newItem);
    res.redirect("/");
});

app.post("/delitem", function(req,res){
    console.log(req.body.index);
    var index = Number(req.body.index);
    var deletedItem = items[index];
    items = items.slice(0,index).concat(items.slice(index+1,items.length));

    client.connect(function(err){
        assert.equal(err, null);
        const db = client.db(dbName);
        const collection = db.collection("task");


        collection.deleteOne({name: deletedItem}, function(err, result){
            assert.equal(err, null);
        });
    });
    res.redirect("/");
});

