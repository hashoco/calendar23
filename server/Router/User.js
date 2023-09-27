var express = require('express')
var router = express.Router()
const { User } = require('../Model/User.js')
const { Counter } = require('../Model/Counter.js')
const setUpload = require('../Util/upload.js')

router.post('/register', (req, res) => {
  console.log(req.body)
  let temp = req.body
  Counter.findOne({ name: 'counter' })
    .then((doc) => {
      temp.userNum = doc.userNum
      const userData = new User(req.body)
      userData.save().then(() => {
        Counter.updateOne({ name: 'counter' }, { $inc: { userNum: 1 } }).then(
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
})

router.post('/namecheck', (req, res) => {
  User.findOne({ displayName: req.body.displayName })
    .exec()
    .then((doc) => {
      let check = true
      if (doc) {
        check = false
      }
      res.status(200).json({ success: true, check })
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false })
    })
})
router.post('/profile/img', setUpload('react-board/user'), (req, res, next) => {
  res.status(200).json({ success: true, filepath: res.req.file.location })
})

router.post('/profile/update', (req, res) => {
  let temp = {
    photoURL: req.body.photoURL,
    hpNo : req.body.hpNo,
    birthDt : req.body.birthDt,
    rmrk: req.body.rmrk,
  }
  User.updateOne({ uid: req.body.uid }, { $set: temp })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})



router.post('/profile/list', (req, res) => {
  //console.log(req.body.uid);
  User.findOne({ uid: req.body.uid })
    .exec()
    .then((doc) => {
   //   console.log(doc);
      //console.log(user.rmrk);
      //console.log(user.hpNo);
      //console.log(user.birthDt);
      res.status(200).json({ success: true , user: doc})
    })
    .catch((err) => {
      console.log(err)
      res.status(400).json({ success: false })
    })
})

module.exports = router

