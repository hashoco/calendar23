var express = require('express')
var router = express.Router()

const multer = require('multer')
const { Post } = require('../Model/Post.js')
const { Counter } = require('../Model/Counter.js')
const { User } = require('../Model/User.js')

const setUpload = require('../Util/upload.js')

router.post('/submit', (req, res) => {
  //console.log(req.body);
  let temp = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
  }
  //Counter 콜렉션에서 counter값을 가진 name값을 찾기 위한 조건
  Counter.findOne({ name: 'counter' })
    .exec()
    .then((counter) => {
      temp.postNum = counter.postNum
      User.findOne({ uid: req.body.uid })
        .exec()
        .then((userInfo) => {
          temp.author = userInfo._id
          const CommunityPost = new Post(temp)
          CommunityPost.save().then(() => {
            //최초 몽고디비에 수기로 1 insert 하여, 그값을 기준으로 +1씩 채번 생성
            Counter.updateOne(
              { name: 'counter' },
              { $inc: { postNum: 1 } },
            ).then(() => {
              res.status(200).json({ success: true })
            })
          })
        })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})

router.post('/list', (req, res) => {
  let sort = {}

  if (req.body.sort === '최신순') {
    sort.createdAt = -1
  } else {
    //수정순
    sort.updatedAt = -1
  }
  Post.find({
    $or: [
      { title: { $regex: req.body.searchTerm } },
      { content: { $regex: req.body.searchTerm } },
      
    ],
  })
    .populate('author')
    .sort(sort)
    .skip(req.body.skip)
    .limit(5) //한번에 찾을 doc숫자
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, postList: doc })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})

router.post('/Detail', (req, res) => {
  Post.findOne({ postNum: Number(req.body.postNum) })
    .populate('author')
    .exec()
    .then((doc) => {
      //console.log(doc)
      res.status(200).json({ success: true, post: doc })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})

router.post('/edit', (req, res) => {
  let temp = {
    title: req.body.title,
    content: req.body.content,
  }

  Post.updateOne({ postNum: Number(req.body.postNum) }, { $set: temp })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})

router.post('/delete', (req, res) => {
  Post.deleteOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then(() => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      res.status(400).json({ success: false })
    })
})

//로컬호스트에 이미지 업로드하는 방식.
/*
const storge = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'image/')
  },
  filename: function (req, file, cb) {
    cb(null, + Date.now() + '-'  + file.originalname )
  },
})

const upload = multer({ storage: storge }).single("file");


router.post('/image/upload', (req, res) => {
  //console.log(req.body, req.formData)
  upload(req,res,err => {
    if(err){
      res.status(400).json({ success: false })
    }else{
    //  console.log(res.req.file)
      res.status(200).json({ success: true , filepath: res.req.file.path})
    }

  })

})
*/

//네이버클라우드에서 react-community23생성하고 하위 post폴더 직접만들어줘야함.
router.post(
  '/image/upload',
  setUpload('react-board/post'),
  (req, res, next) => {
    res.status(200).json({ success: true, filepath: res.req.file.location })
  },
)

module.exports = router
