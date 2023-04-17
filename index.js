console.log(" Good Morning...  ");

var mongoose = require('mongoose');
var express = require('express');
const bcrypt = require('bcrypt');
const http = require('http');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user_model.js');
const testModel = require('./models/test_model.js');

const app = express();
app.use(express.json());
// var mongoUrl = "mongodb+srv://testrtemp22:dXCOfJxwgAZBsN3U@testdababase.ljo4iq2.mongodb.net/MavaniApp";
var mongoUrl = "mongodb+srv://testrtemp22:dXCOfJxwgAZBsN3U@testdababase.ljo4iq2.mongodb.net/sample_training";

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Our app listening at http://%s:%s", host, port)
})

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected successfully')).catch(err => console.log(`MongoDB connection error: ${err}`));


app.get("/getUser", async (req, res) => {
    try {
        // const data = await userModel.find();
        const data = await testModel.find();

        res.status(200).json({
            status: true,
            message: "Data Got Success.. !",
            totalUsers: data.length,
            users: data
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.get("/getUser/paginate",  paginatedResults(testModel), (req, res) => {
    res.json(res.paginatedResults);
});


 function paginatedResults(model) {
    // middleware function
    return async (req, res, next)  => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        // calculating the starting and ending index
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};
        results.totalCount = await testModel.count;
        // if (endIndex < model.length) {
            results.next = {
                page: page + 1,
                limit: limit
            // };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }
        
        // var data = await testModel.find();
        // var data = await testModel.find().skip(startIndex * limit).limit(limit);
        results.results = await model.find().skip(startIndex * limit).limit(limit);;
        results.idData = await model.findById('5eb3d668b31de5d588f4292b');
        
        // results.results = data.slice(startIndex, endIndex);

        res.paginatedResults = results;
        next();
    };
}








app.post('/addUser', async (req, res) => {
    try {
        const { name, phoneNumber, city, country, address } = req.body;
        userModel.insertMany([{
            name: name,
            phoneNumber: phoneNumber,
            city: city,
            country: country,
            address: address
        }]);
        // newData.inser;
        res.status(200).json({ status: true, message: "Data Savved.. ", user: userModel });

    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message : "Failed to saving data"});
     }
   


});


app.post('/find', async (req, res) => {
    try {
        const { idNumber } = req.body;
        var doc = await userModel.findById("64394126a8f971c773ce1b7e");
        console.log("dtata uis ",doc);
        // newData.inser;
        res.status(200).json({ status: true, message: "Data Available.. ", user: doc });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to Getting data" });
    }
});
