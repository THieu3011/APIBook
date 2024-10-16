var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://tranhieu2290:khongbietdau@cluster0.fvtxq.mongodb.net/QuanLyThuVien';

const connect = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Kết nối với MongoDB thành công");
  } catch (err) {
    console.error("Kết nối MongoDB thất bại", err);
  }
}

connect()

const bookSchema = new mongoose.Schema({
  tittle: String,
  author: String,
  genre: String,
  year: String,
  imageUrl: String
})
const Book = mongoose.model('Book', bookSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String},
  fullname: { type: String}
});
const User = mongoose.model('User', userSchema);

const formSchema = new mongoose.Schema({
  username: { type: String},
  fullname: { type: String},
  bookTittle: { type: String},
  date: {type:String},
  formStatus: {type:Number},
});
const Form = mongoose.model('Form', formSchema);

router.post('/themSach', function (req, res, next) {
  var data = {
    errorCode: 200,
    message: "Success",
  }
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;
  const year = req.body.year;
  const imageUrl = req.body.imageUrl;

  const newBook = new Book({
    title: title,
    author: author,
    genre: genre,
    year: year,
    imageUrl: imageUrl
  })
  newBook.save().then(() => {
    res.send(data)
  });
})

router.get('/xoaSach/{id}', function (req, res) {
  var data = {
    errorCode: 200,
    message: "Success",
  }
  const id = req.path.id;
  Book.deleteOne({_id: id}).then(() => {
    res.send(data)
  }).catch(err => {
    data.message = err.message
    res.send(data)
  });
})

router.post('/suaSach', function (req, res) {
  var data = {
    errorCode: 200,
    message: "Success",
  }
  const id = req.body.id;
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;
  const year = req.body.year;
  const imageUrl = req.body.imageUrl;

  Book.updateOne({_id: id}, {
    title: title,
    author: author,
    genre: genre,
    year: year,
    imageUrl: imageUrl
  }).then(() => {
    res.send(data)
  }).catch(err => {
    data.message = err.message
    res.send(data)
  })
})

router.get('/tatCaSach', async (req, res, next) => {
  const result=await Book.find({})
  res.send(result)
});

router.post('/dangKy', async (req, res) => {
  const data = req.body;
  try {
    const user = new User({
      username:data.username,
      password:data.password,
      fullname:data.fullname
    });
    await user.save();
    res.send('Tạo tài khoản thành công!');
  } catch (error) {
    if (error.code === 11000) {
      res.send('Tên đăng nhập đã tồn tại!');
    } else {
      res.send('Lỗi '+error);
    }
  }
});

router.post('/taoPhieuMuon', async (req, res) => {
  const data = req.body;
  try {
    const form = new Form({
      username: data.username,
      fullname: data.fullname,
      bookTittle: data.bookTittle,
      date: data.date,
      formStatus: data.formStatus,
    });
    await form.save();
    res.send('Gửi yêu cầu thành công!');
  } catch (error) {
    res.send('Lỗi '+error);
  }
});

router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('Người dùng không tồn tại');
    }
  } catch (error) {
    res.send("Lỗi "+error);
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
