var express = require('express');
var WPAPI = require('wpapi');

var router = express.Router();

var wp = new WPAPI({
  endpoint: 'http://thewave.webd3027.ca/wp-json',
  username: 'BrennanHolmes',
  password: 'password',
});

/* GET home page. */

// / GET home page. /;
router.get('/', async function (req, res, next) {
  const data = await wp.posts().perPage(10).order('desc').embed();

  var posts = [];

  let cPost = 0;
  data.forEach(function (item) {
    posts.push({
      featuredpost: item._embedded['wp:featuredmedia'][0].source_url,
      title: item.title.rendered,
      excerpt: item.excerpt.rendered,
      author: item._embedded.author[0].name,
    });
    cPost++;
  });

  res.render('index', { posts: posts });
});

module.exports = router;
