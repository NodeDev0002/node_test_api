console.log(" Good Morning...  ");

var mongoose = require('mongoose');
var express = require('express');
const bcrypt = require('bcrypt');
const http = require('http');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const userModel = require('./models/user_model.js');
const testModel = require('./models/test_model.js');
const postModel = require('./models/post_model.js');


// const postModel = require('./models/post_model.js');

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

        var page = parseInt(req.query.currentPage ?? "1");
        var limit = parseInt(req.query.limit ?? "10");
        if (page <= 0) {
            page = 1;
        }
        const startIndex = (page - 1) * limit;
        // if (endIndex < model.length) {        
        
        const totalCount = await testModel.count();
        const totalPage = parseInt((await testModel.count() / limit)) + 1;
        const currentPage = page;

        // var data = await testModel.find();
        // var data = await testModel.find().skip(startIndex * limit).limit(limit);
        const results = await testModel.find().skip(startIndex).limit(limit);
        // results.results = data.slice(startIndex, endIndex);
        // res.paginatedResults = results;
        // next();

        // const data = await userModel.find();
        // const data = await testModel.find();
        res.status(200).json({
            status: true,
            message: "Data Got Success.. !",
            totalUsers: totalCount,
            totalPage: totalPage,
            currentPage : currentPage,
            users: results
        });
        // res.status(200).json(res.paginatedResults);
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



 
app.post('/addData', async (req, res) => {
    try {
        const { studentId, scores, classId } = req.body;
        const testData = await testModel.create({
                student_id: studentId,
                scores: scores,
                class_id: classId
            }); 
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

       const updatesData = await testModel.findByIdAndUpdate(
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

        // userModel.insertMany(req.body);
        const userData = await userModel.create(req.body);
        await userData.save();
        res.status(200).json({ status: true, message: "Data Savved.. ", user: userData });

    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message : "Failed to saving data"});
     }
   


});


app.post('/find', async (req, res) => {
    try {
        const { searchName } = req.body;

        // var doc = await userModel.find(req.body);
        const regex = new RegExp(searchName, 'i'); 
        var doc = await userModel.find({ $or: [{ name: regex }] });

        // var doc = await userModel.findById(idNumber);
        // console.log("dtata uis ",doc);
        // newData.inser;
        return res.status(200).json({ status: true, message: "Data Available.. ", user: doc });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "Failed to Getting data" });
    }
});


app.post("/getDataByID", postHandler
    // async (req, res) => {

   
    // try {
    //     var id = req.query.id;
    //     var postId = req.query.postId;

    //     const userData = await testModel.findById(id);
    //     const postData = await postModel.findById(postId);
    //     // const postData = await postModel.find();  
    //     return res.status(200).json({ status: true, message: "Data Got Success", user: userData ?? {}, post: postData ?? {} });
    // } catch (err) {
    //     console.log(err);
    //     return res.status(400).json({ status: false, message: "Something went wrong" });
    // }
// }
);




async function postHandler(req, res) {
    try {
        var id = req.query.id;
        var postId = req.query.postId;

        const userData = await testModel.findById(id);
        const postData = await postModel.findById(postId);
        // const postData = await postModel.find();  
        return res.status(200).json({ status: true, message: "Data Got Success", user: userData ?? {}, post: postData ?? {} });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ status: false, message: "Something went wrong" });
    }
};

// app.post('/uploadImage', upload.single('file'),  (req, res) => {
//     res.status(200).json({ message: 'File uploaded successfully' });

// });


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // Specify the destination folder where the uploaded files will be saved
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         // Specify the file name for the uploaded file
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// // Create a multer upload instance with the configured storage
// const upload = multer({ storage: storage });