const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },

    password: {
        type: String
    },
    confirmpass: {
        type: String
    },
    myPlaintextPassword: {
        type: String
    },

    remark: {
        type: String
    },
    Amount: {
        type: Number
    },
    type: {
        type:String
    }

});
module.exports = mongoose.model("userData", userSchema);