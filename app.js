var express=require("express");
var bodyParser=require("body-parser");
var mongo = require('mongodb');
var cors = require('cors');
var url = require('url');


var app=express();
app.use(bodyParser.json());
app.use(cors());
var url = "mongodb://localhost:27017/todo";

var connectionOptions ={
    auth: {
        user: "1234",
        password: "1234"
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongo.MongoClient.connect(url, connectionOptions, (err, client) => {
    if (err) {
        console.log("Username/Password not matched at Mongo's side");
        return;
    }
    console.log("connected successfully to mongodb");
    var todo = client.db('todo');

var todo=client.db('todo');
    app.get("/signup", (req, res) => {
        console.log(req.url);
        if (req.query.username != undefined && req.query.email != undefined && req.query.password != undefined && req.query.phone !=undefined ) {
            var filterObject = {
                username: req.query.username,
                email:req.query.email,
                password: req.query.password,
                phone: req.query.phone
                
            };
            var promiseddata = todo.collection('credentials').find({username: req.query.username}).toArray();
            promiseddata.then(user=>{
                var array=user;
                console.log(array);
                if(array.length==1){
                    var abc="exist";
                    var responsestring=JSON.stringify(abc);
                    res.status(200).send(responsestring);
                }
               else if (array.length == 0) {
                    var abc = "true";
                    var responsestring = JSON.stringify(abc);
                    todo.collection('credentials').insertOne(filterObject).then(res.status(200).send(responsestring));
                    
                }
            });

        }
        
    });
    var todo = client.db('todo');
    app.get("/login", (req, res) => {
        console.log(req.url);
        if (req.query.username != undefined && req.query.password != undefined ) {
                var promiseddata = todo.collection('credentials').find({ username: req.query.username , password: req.query.password }).toArray();
                promiseddata.then(user => {
                var array = user;
                if (array.length == 1) {
                    var abc = "true";
                    var responsestring = JSON.stringify(abc);
                    res.status(200).send(responsestring);

                }
                else if (array.length == 0) {
                    var abc = "false";
                    var responsestring = JSON.stringify(abc);
                    res.status(200).send(responsestring);

                }
            });

        }
        global.user=req.query.username;

    });
    app.get('/addtask', (req, res) => {
        if (req.query.Title != undefined && req.query.Description != undefined && req.query.Deadline != undefined) {
            console.log(req.query);
            var filterObject = {
                Title: req.query.Title,
                Description: req.query.Description,
                Deadline: req.query.Deadline
            }
            var promiseddata = todo.collection(user).find({ Title: req.query.Title }).toArray();
            promiseddata.then(users => {
                var array = users;
                console.log(array);
                if (array.length == 1) {
                    var abc = "exists";
                    var responsestring = JSON.stringify(abc);
                    res.status(200).send(responsestring);
                }
                else if (array.length == 0) {
                    todo.collection(user).insertOne(filterObject);
                    var promiseddata = todo.collection(user).find().toArray();
                    promiseddata.then(users => {
                        var array = users;
                        var responsestring = JSON.stringify(array);
                        res.status(200).send(responsestring);
                    });
                }
            });
        }
    });
    app.get('/seetask', (req, res) => {
        var promiseddata = todo.collection(user).find().toArray();
        promiseddata.then(users => {
            var array = users;
            var responsestring = JSON.stringify(array);
            res.status(200).send(responsestring);
        });
    });
    app.get('/edittask', (req, res) => {
        if (req.query.Title != undefined && req.query.Description != undefined && req.query.Deadline != undefined) {
            var myquery = {
                Title: req.query.beforeedit
            };
            var newvalues = { $set: { Title: req.query.Title, description: req.query.Description, deadline: req.query.Deadline } };
            todo.collection(user).updateOne(myquery, newvalues);
            var promiseddata = todo.collection(user).find().toArray();
            promiseddata.then(users => {
                var array = users;
                var responsestring = JSON.stringify(array);
                res.status(200).send(responsestring);
            });
        }
    });
    app.get('/deletetask', (req, res) => {
        if (req.query.Title != undefined) {
            todo.collection(user).deleteOne({ Title: req.query.Title }).then(console.log("deleted"));
            var promiseddata = todo.collection(user).find().toArray();
            promiseddata.then(users => {
                var array = users;
                var responsestring = JSON.stringify(array);
                res.status(200).send(responsestring);
            });
        }
    });
    app.get('/completetask', (req, res) => {
        if (req.query.Title != undefined && req.query.Description != undefined && req.query.Deadline != undefined) {
            var myquery = {
                Title: req.query.Title
            };
            var desc = req.query.Description + " is completed on " + req.query.Deadline;
            var newvalues = { $set: { Description: desc } };
            todo.collection(user).updateOne(myquery, newvalues);
            var promiseddata = todo.collection(user).find().toArray();
            promiseddata.then(users => {
                var array = users;
                var responsestring = JSON.stringify(array);
                res.status(200).send(responsestring);
            });
        }
    });
    app.get('/search', (req, res) => {
        if (req.query.Title != undefined) {
            var promiseddata = todo.collection(user).find({ Title: req.query.Title }).toArray();
            promiseddata.then(users => {
                var array = users;
                var responsestring = JSON.stringify(array);
                res.status(200).send(responsestring);
            });
        }
    });
    app.listen(8081);
    })