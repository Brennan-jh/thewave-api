var express = require('express');
var multer = require('multer');
var WPAPI = require('wpapi');

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

var router = express.Router();

var wp = new WPAPI({
  endpoint: 'http://thewave.webd3027.ca/wp-json',
  username: 'BrennanHolmes',
  password: 'password',
});

/* GET Post Form. */
router.get('/', async (req, res) => {
  var categories = await wp.categories().get();
  res.render('post', { title: 'New Post', categories: categories });
});

/* POST submitted */
router.post(
  '/',
  upload.single('featured_image'),
  async function (req, res, next) {
    try {
      wp.media()
        // Specify a path to the file you want to upload, or a Buffer
        .file(req.file.buffer, req.file.originalname)
        .create({ title: req.file.originalname })
        .then(function (response) {
          // Your media is now uploaded: let's associate it with a post
          var newImageId = response.id;
          return wp.posts().create({
            title: req.body.title,
            content: req.body.content,
            featured_media: newImageId,
            categories: req.body.categories,
            status: 'publish',
          });
        });
      res.redirect('/');
    } catch {
      (error) => console.log(error);
    }
  }
);

module.exports = router;
