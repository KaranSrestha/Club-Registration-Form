const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

const mongodburi = process.env.URI;

app.use(bodyParser.urlencoded({extended: true}));
app.set(express.static("public"));

mongoose.connect(mongodburi);

const memberSchema = new mongoose.Schema({
    name: String,
    R_No: String,
    email: String,
    phone_no: String,
    sex: String,
    dob: String,
    other: String
})

const Member = new mongoose.model("member", memberSchema);

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/", async function(req, res){
    const name = req.body.name;
    const R_No = req.body.R_No;
    const email = req.body.email;
    const phone = req.body.number;
    const sex = req.body.sex;
    const dob = req.body.dob;
    const other = req.body.details.trim();

    const existingMember = await Member.findOne({ R_No: R_No });

    let errorMessage = "";
    if (existingMember) {
        errorMessage = "A member with the same Registration Number already exists.";
    }else if(!name || !R_No || !email || !phone || !sex || !dob ){
        errorMessage = "All fields are mandatory";
    };
    if (errorMessage) {
        // Render the home page with the error message in a query parameter
        return res.redirect(`/?errorMessage=${encodeURIComponent(errorMessage)}`);
    }else{
        const member = new Member({
            name: name,
            R_No: R_No,
            email: email,
            phone_no: phone,
            sex: sex,
            dob: dob,
            other: other
        });
        await member.save();
        res.redirect("/");
    }
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is up at 3000");
});