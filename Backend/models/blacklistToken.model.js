const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*60*24*7
    }
})

module.exports = mongoose.model('blackListToken',blackListSchema)
