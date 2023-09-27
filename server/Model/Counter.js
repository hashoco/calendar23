
const mongoose = require('mongoose');

const counterScheam = new mongoose.Schema({
    name : String,
    postNum : Number,
    userNum : Number,
    calendarNum : Number,

},{Collection : "counter"});

const Counter = mongoose.model("counter",counterScheam);

module.exports = {Counter};