const testModel = require('./models/test_model.js');
const postModel = require('./models/post_model.js');
           

async function postHandler(req, res)  {
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

// module.exports = 
// app.post("/getDataByID", async (req, res) => {
//     try {
//         var id = req.query.id;
//         var postId = req.query.postId;

//         const userData = await testModel.findById(id);
//         const postData = await postModel.findById(postId);
//         // const postData = await postModel.find();  
//         return res.status(200).json({ status: true, message: "Data Got Success", user: userData ?? {}, post: postData ?? {} });
//     } catch (err) {
//         console.log(err);
//         return res.status(400).json({ status: false, message: "Something went wrong" });
//     }
// });








