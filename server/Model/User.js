
const mongoose = require('mongoose');

const userScheam = new mongoose.Schema({
    userNum : Number,
    email : String,
    displayName: String,
    uid : String,
    photoURL : String,
    hpNo : String,
    birthDt : String,
    rmrk: String,

},{Collection : "users"});

const User = mongoose.model('user',userScheam);

module.exports = {User};