const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require("dotenv");
const UserModel = require("./Model/user")
const { restart } = require('nodemon');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
dotenv.config();
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect(process.env.MY_MONGO, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
}).then(() => {
    console.log("connected mongo Db")
}).catch((err) => {
    console.log("no connection")
    if (err) console.log(`no connect:${err}`)
})
app.listen(4000, () => {
    console.log("hello its port 4000")
})
const productSchema = {
    name: String

}
const monmodel = mongoose.model("rahul", productSchema);



const data = new monmodel({
    name: "kapil",

})


data.save();



app.get("/home", (req, res) => {
    res.send("home page")
})
app.get("/home/about/:name/:city", (req, res) => {
    let pername = req.params.name;
    let city = req.params.city;
    res.send({ name: pername, city })
})
app.get("/home/report", (req, res) => {
    let pername = req.query.name;
    let age = req.query.age;
    res.json({ name: pername, age })
})

app.post("/home", (req, res) => {
    res.send("home page with post method")
})
app.post("/about", (req, res) => {
    res.send("about page with post method")
});


//app.post("/userData", (req, res) => {

// let dataToWrite = JSON.stringify(req.body)
// console.log(req.body)

// let { username, password, remark } = req.body

// UserModel.create({
// username,
// password,
// remark

//  }).then(data => {
//  res.send("data saved successfully")

// }).catch(err => {
//  res.send("some error occured on server")

//  })
//})
app.post('/userData/reg', async (req, res) => {
    // let dataToWrite = JSON.stringify(req.body)
    let { username, password, remark, confirmpass } = req.body
   
        let data = await UserModel.findOne({ username })
        if (data) {
            res.send({ status: "ERR", msg: "user already exists" })
        } else if (password === confirmpass) {
            let hash = await bcrypt.hash(password, saltRounds)
            let userData = await UserModel.create({
                username,
                remark,
                confirmpass,
                password: hash

            })
            res.send({ status: "OK", msg: "User created successfully.", data: userData })
        }
    }
    catch(err) {
        res.send("some error occured on server")
    }

app.post('/userData/log', async (req, res) => {
    // let dataToWrite = JSON.stringify(req.body)
    let { username, password, remark, confirmpass, myPlaintextPassword } = req.body
    try {
        let data = await UserModel.findOne({ username })
        if (data) {
            res.send({ status: "ERR", msg: "user already exists" })
        } else if (password === confirmpass) {
            let hash = await bcrypt.hash(password, saltRounds)
            bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
                if (result) {
                    var token = jwt.sign({ username_id: username._id }, 'shhhhh');
                    console.log("token:", token)
                }
                else { console.log("wrong password") }
            });
            let userData = await UserModel.create({
                username,
                remark,
                confirmpass,
                myPlaintextPassword,
                password: hash

            })
            res.send({ status: "OK", msg: "User created successfully.", data: userData })
        }
    }
    catch (err) {
        res.send("some error occured on server")
    }
})

app.post('/userData/login ', async (req, res) => {
    // let dataToWrite = JSON.stringify(req.body)
    let { username, myPlaintextPassword } = req.body
    try {
        let data = await UserModel.findOne({ username })
        if (data) {


            bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
                if (result) {
                    var token = jwt.sign({ username_id: username._id }, 'shhhhh');
                    console.log("token:", token)
                }
                else { console.log("wrong password") }
            });


        }
    }
    catch (err) {
        res.send("some error occured on server")
    }
})

