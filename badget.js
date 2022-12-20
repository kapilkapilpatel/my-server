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
app.use(bodyParser.urlencoded({ extended: false }))

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
app.listen(5000, () => {
    console.log("hello its port 5000")
})



app.post('/userData/reg', async (req, res) => {

    let { username, password, confirmpass } = req.body
    try {
        let data = await UserModel.findOne({ username })
        if (data) {
            res.send({ status: "ERR", msg: "user already exists" })
        } else if (password === confirmpass) {
            let hash = await bcrypt.hash(password, saltRounds)
            var token = jwt.sign({ username_id: username._id }, 'shhhhh');
            console.log("token:", token)
            let userData = await UserModel.create({
                username,
                confirmpass,
                password: hash
            })
            res.send({ status: "OK", msg: "User created successfully.", data: userData })
        }
    }
    catch (err) {
        res.send("some error occured on server")
    }
})

app.post('/userData/login', async (req, res) => {

    let { username, myPlaintextPassword, token } = req.body
    try {
        let data = await UserModel.findOne({ username })

        if (data) {
            let hashKey = data.password

            bcrypt.compare(myPlaintextPassword, hashKey, function (err, result) {
                if (result) {

                    var token = jwt.sign({ username_id: username._id }, 'shhhhh');
                    console.log("token:", token)
                    res.send({ data: { token } });

                }
                else { console.log("wrong password") }
            });


        }
    }
    catch (err) {
        res.send("some error occured on server")
    }
})


app.post('/userData/transaction', (req, res) => {



    let { Amount, type, remark } = req.body

    let userdata = UserModel.create({
        Amount,
        type,
        remark

    })


})



app.use((req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "")
    let payload = null

    try {
        payload = jwt.verify(token, "shhhhh")
        req.payload = payload
        next()
    } catch (e) {
        res.send({ status: "ERR", msg: "Authentication Failed." })
    }
})


app.post('/post', async (req, res) => {



    const { username, password } = req.body


    let { _id } = req.payload

    try {
        let postData = await UserModel.create({
            userId: _id,
            username,
            password
        })
        res.send({ status: "OK", msg: "Post saved successfully", data: postData })
    } catch (e) {
        res.send({ status: "ERR", msg: "Something went wrong on server." })
    }
}
) 




