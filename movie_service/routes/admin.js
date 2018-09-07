var express = require('express');
var router = express.Router();
var user = require('../models/user');
var comment = require('../models/comment');
var movie = require('../models/movie');
var recommend = require('../models/recommend');
var article = require('../models/article');
var jwt = require('../models/jwtauth');

router.post('/movieAdd', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.movieName) {
    res.json({status: 1, message: '电影名称为空'});
  }
  if (!req.body.movieImg) {
    res.json({status: 1, message: '电影图片为空'});
  }
  if (!req.body.movieVedio) {
    res.json({status: 1, message: '电影视频为空'});
  }
  if (!req.body.movieDownload) {
    res.json({status: 1, message: '电影下载地址为空'});
  }
  var movieMainPage = req.body.movieMainPage ? req.body.movieMainPage : false;
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function (err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        var saveMovie = new movie({
          movieName: req.body.movieName,
          movieImg: req.body.movieImg,
          movieVedio: req.body.movieVedio,
          movieDownload: req.body.movieDownload,
          movieNumSuppose: 0,
          movieNumDownload: 0,
          movieMainPage: movieMainPage
        });
        saveMovie.save(function (err) {
          if (err) {
            res.json({status: 1, message: err});
          } else {
            res.json({status: 0, message: '添加成功'});
          }
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    })
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/movieDel', function() {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        movie.remove({_id: req.body.movie_id}, function(err, delMovie) {
          res.json({status: 0, message: '删除成功', data: delMovie});
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/movieUpdate', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影id传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var saveData = req.body.movieInfo;
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        movie.update({_id: req.body.movie_id}, saveData, function(err, saveMovie) {
          res.json({status: 0, message: '存储成功', data: saveMovie});
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.get('/movie', function(req, res, next) {
  movie.findAll(function(err, allMovies) {
    res.json({status: 0, message: '获取成功', data: allMovies});
  });
});
router.get('/commentsList', function(req, res, next) {
  comment.findAll(function(err, allComments) {
    res.json({status: 0, message: '获取成功', data: allComments});
  });
});
router.post('/checkComment', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.comment_id) {
    res.json({status: 1, message: '评论id传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        comment.update({_id: req.body.comment_id}, {check: true}, function(err, updateComment) {
          res.json({status: 0, message: '审核成功', data: updateComment});
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/stopUser', function (req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.stop_id) {
    res.json({status: 1, message: '封停用户id传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.update({_id: req.body.stop_id}, {userStop: true}, function(err, stopUser) {
          res.json({status: 0, message: '封停成功', data: stopUser});
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/changeUser', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.control_id) {
    res.json({status: 1, message: '被操作用户id传递失败'});
  }
  if (!req.body.newPassword) {
    res.json({status: 1, message: '新密码传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.update({_id: req.body.control_id}, {password: newPassword}, function(err, updateUser) {
          res.json({status: 0, message: '修改成功', data: updateUser});
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/showUser', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.findAll(function(err, allUsers) {
          res.json({status: 0, message: '获取成功', data: allUsers});
        })
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/powerUpdate', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.control_id) {
    res.json({status: 1, message: '被操作用户id传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        user.update({_id: req.body.control_id}, {userAdmin: true}, function(err, updateUser) {
          res.json({status: 0, message: '修改成功', data: updateUser});
        });
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/addArticle', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.articleTitle) {
    res.json({status: 1, message: '文章标题名称为空'});
  }
  if (!req.body.articleContext) {
    res.json({status: 1, message: '文章内容为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        var saveArticle = new article({
          articleTitle: req.body.articleTitle,
          articleContext: req.body.articleContext
        });
        saveArticle.save(function(err) {
          if (err) {
            res.json({status: 1, message: '文章存储失败'});
          }
          res.json({status: 0, message: '文章存储成功'});
        })
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/delArticle', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.article_id) {
    res.json({status: 1, message: '文章id传递失败'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        article.remove({_id: req.body.article_id}, function(err, delArticle) {
          res.json({status: 0, message: '删除成功', data: delArticle});
        })
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/addRecommend', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.recommendImg) {
    res.json({status: 1, message: '推荐图片为空'});
  }
  if (!req.body.recommendSrc) {
    res.json({status: 1, message: '推荐跳转地址为空'});
  }
  if (!req.body.recommendTitle) {
    res.json({status: 1, message: '推荐标题为空'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        var saveRecommend = new recommend({
          recommendImg: req.body.recommendImg,
          recommendSrc: req.body.recommendSrc,
          recommendTitle: req.body.recommendTitle
        });
        saveRecommend.save(function(err) {
          if (err) {
            res.json({status:1, message: err});
          }
          res.json({status: 0, message: '存储成功'});
        })
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});
router.post('/delRecommend', function(req, res, next) {
  if (!req.header('Access-Token')) {
    res.json({status: 1, message: '登录信息错误'});
  }
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户传递错误'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.recommend_id) {
    res.json({status: 1, message: '热点id传递失败'});
  }
  var check = checkIsOline(req.header('Access-Token'), req.body.user_id);
  if (check.error == 0) {
    user.findByUsername(req.body.username, function(err, findUser) {
      if (findUser[0].userAdmin && !findUser[0].userStop) {
        recommend.remove({_id: req.body.recommend_id}, function(err, delRecommend) {
          res.json({status: 0, message: '删除成功', data: delRecommend});
        })
      } else {
        res.json({status: 1, message: '用户没有权限或者已经停用'});
      }
    });
  } else {
    res.json({status: 1, message: check.message});
  }
});


function checkIsOline(token, user_id) {
  if (user_id == jwt.test(token).iss) {
    return {error: 0, message: "用户登录成功"};
  } else {
    return {error: 1, message: "用户登录错误"};
  }
}

module.exports = router;