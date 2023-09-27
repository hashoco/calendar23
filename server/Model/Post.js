
const mongoose = require('mongoose');

const postScheam = new mongoose.Schema({
    title : String,
    content : String,
    postNum : Number,
    image: String,
    author :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
    },
    repleNum :{
        type : Number,
        default : 0,
    },

},{Collection : "posts",timestamps:true});

const Post = mongoose.model('Post',postScheam);

module.exports = {Post};