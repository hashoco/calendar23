var express = require('express')
var router = express.Router()

const { Counter } = require('../Model/Counter.js')
const { Calendar } = require('../Model/Calendar.js')



router.post('/delete', (req, res) => {
  Calendar.deleteOne({ calendarNum: Number(req.body.calendarNum) })
    .exec()
    .then(() => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})

router.post('/list', (req, res) => {
  let sort = {}
   Calendar.find()
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, calendarList: doc })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})


router.post('/submit', (req, res) => {
  console.log(req.body)
  let temp = req.body
  Counter.findOne({ name: 'counter' })
    .then((doc) => {
      temp.calendarNum = doc.calendarNum
      const userData = new Calendar(req.body)
      userData.save().then(() => {
        Counter.updateOne({ name: 'counter' }, { $inc: { calendarNum: 1 } }).then(
          () => {
            res.status(200).json({ success: true })
          },
        )
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false })
    })

  }

  



  
)
module.exports = router
