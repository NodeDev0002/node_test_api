console.log(" Good Morning...  ");

var mongoose = require('mongoose');
var express = require('express');
const bcrypt = require('bcrypt');
const http = require('http');
const jwt = require('jsonwebtoken');
const userModel = require('./models/user_model.js');
const testModel = require('./models/test_model.js');
const postModel = require('./models/post_model.js');


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
        const page = parseInt(req.query.page ?? "1");
        const limit = parseInt(req.query.limit ?? "10");
        if (page <= 0) { 
            page = 1;
        }

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
        // results.results = data.slice(startIndex, endIndex);
        res.paginatedResults = results;
        next();
    };
}


app.get("/getDataByID", async (req, res) => {
    try { 
        var id = req.query.id;
        var postId = req.query.postId;

        const userData = await testModel.findById(id);
        // const postData = await postModel.findById(postId);  
        const postData = await postModel.find();  
        return res.status(200).json({ status: true, message: "Data Got Success", user: userData ?? {}, post: postData ?? {} });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: false, message: "Something went wrong"});
    }


 });

app.post('/addData', async (req, res) => {
    try {
        const { studentId, scores, classId } = req.body;

        const testData = await testModel.create(
                    {
                student_id: studentId,
                scores: scores,
                class_id: classId
            }
        ); 
        await testData.save();
        res.status(200).json({ status: true, message: "Data Savved.. ", user: testData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to saving data" });
    }
});



app.post('/updateData', async (req, res) => {
    try {
        const { _id, studentId, scores, classId } = req.body;

       const updatesData = await testModel.findOneAndUpdate(
            { _id:  _id},
            {
                student_id: studentId,
                scores: scores,
                class_id: classId
            },
            { new: true }
        );
        res.status(200).json({ status: true, message: "Your data has been updated..!", user: updatesData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to saving data" });
    }
});


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
