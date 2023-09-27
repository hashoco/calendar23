
const mongoose = require('mongoose');

const calendarScheam = new mongoose.Schema({
    calendarNum: Number,
    eventDate : String,
    eventEndDate : String,
    eventContent : String,
    uid: String,

},{Collection : "calendars"});

const Calendar = mongoose.model('calendar',calendarScheam);

module.exports = {Calendar};