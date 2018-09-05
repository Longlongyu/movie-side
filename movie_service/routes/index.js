var express = require('express');
var router = express.Router();
var recommend = require('../models/recommend');
var movie = require('../models/movie');
var article = require('../models/article');
var user = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

router.get('/showIndex', function(req, res, next) {
  recommend.findAll(function(err, getRecommend) {
    res.json({status: 0, message: '获取推荐', data: getRecommend});
  });
});

router.get('/showRanking', function(req, res, next) {
  movie.find({movieMainPage: true}, function(err, getMovies) {
    res.json({status: 0, message: '获取主页', data: getMovies});
  });
});

router.get('/showArticle', function(req, res, next) {
  article.findAll(function(err, getArticles) {
    res.json({status: 0, message: '获取文章列表成功', data: getArticles});
  })
});

router.get('/articleDetail', function(req, res, next) {
  if (!req.body.article_id) {
    res.json({status: 1, message: '文章id出错'});
  }
  article.findByArticleId(req.body.article_id, function(err, getMovies){
    res.json({status: 0, message: '获取成功', data: getMovies});
  });
});

router.get('/showUser', function(req, res, next) {
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户状态错误'});
  }
  user.findById(req.body.user_id, function(err, getUser) {
    res.json({status: 0, message: '获取成功', data: {
      user_id: getUser._id,
      username: getUser.username,
      userEmail: getUser.userEmail,
      userPhone: getUser.userPhone,
      userStop: getUser.userStop
    }});
  });
});
module.exports = router;
