var express = require('express');
var router = express.Router();
var user = require('../models/user');
var comment = require('../models/comment');
var movie = require('../models/movie');
var support = require('../models/support');
var mail = require('../models/mail');
var jwt = require('../models/jwtauth');
var crypto = require('crypto');

const init_token = 'TKL02o';
const init_sign = getRandomString(10);
/* POST users listing. */
router.post('/login', function(req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.password) {
    res.json({status: 1, message: '密码为空'});
  }
  user.findUserLogin(req.body.username, getSha256Password(req.body.password), function(err, userLogin) {
    if (userLogin.length != 0) {
      user.findOne({username: req.body.username}, function(err, checkUser) {
        res.json({status: 0, message: '登录成功', token: jwt.create(checkUser._id)});
      });
    } else {
      res.json({status: 1, message: '用户不存在或输入错误'});
    }
  });
});
router.post('/register', function(req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.password) {
    res.json({status: 1, message: '密码为空'});
  }
  if (!req.body.userMail) {
    res.json({status: 1, message: '用户邮箱为空'});
  }
  if (!req.body.userPhone) {
    res.json({status: 1, message: '手机号码为空'});
  }
  user.findByUsername(req.body.username, function (err, userSave) {
    if (userSave.length != 0) {
      res.json({status: 1, message: '用户名已注册'});
    } else {
      var registerUser = new user({
        username: req.body.username,
        password: getSha256Password(req.body.password),
        userMail: req.body.userMail,
        userPhone: req.body.userPhone,
        userAdmin: 0,
        userPower: 0,
        userStop: 0
      });
      registerUser.save(function() {
        res.json({status: 0, message: '注册成功'});
      })
    }
  });
});
router.post('/postComment', function(req, res, next) {
  if (!req.body.username) {
    res.json({status: 1, message: '用户名为空'});
  }
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影ID为空'});
  }
  if (!req.body.context) {
    res.json({status: 1, message: '评论内容为空'});
  }
  if (req.header('Access-Token') && req.body.user_id == jwt.test(req.header('Access-Token')).iss) {
    var saveComment = new comment({
      movie_id: req.body.movie_id,
      username: req.body.username,
      context: req.body.context,
      check: 0 
    });
    saveComment.save(function (err) {
      if (err) {
        res.json({status: 1, message: err});
      } else {
        res.json({status: 0, message: '评论成功'});
      }
    });
  } else {
    res.json({status: 1, message: '登录信息未识别'});
  }
});
router.post('/support', function(req, res, next) {
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户登录错误'});
  }
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影Id传递失败'});
  }
  if (!req.body.username) {
    res.json({status: 1, message: '用户名未识别'});
  }
  if (!req.header('Access-Token') || req.body.user_id != jwt.test(req.header('Access-Token')).iss) {
    res.json({status: 1, message: '登录信息未识别'});
  }
  movie.findByMovieId(req.body.movie_id, function(err, supportMovie) {
    support.findByMovieIdAndUsername(req.body.movie_id, req.body.username, 
    function(err, userFound) {
        if (userFound.length == 0) {
          var saveSupport = new support({
            movie_id: req.body.movie_id,
            username: req.body.username
          });
          saveSupport.save(function (err) {
            if (err) {
              res.json({status: 1, message: err});
            } else {
              movie.update({_id: req.body.movie_id}, {movieNumSuppose: supportMovie[0].movieNumSuppose + 1},
              function(err) {
                if (err) {
                  res.json({status: 1, message: '点赞失败', data: err});
                }
                res.json({status: 0, message: '点赞成功'});
              });
            }
          });
        } else {
          support.remove({movie_id: req.body.movie_id, username: req.body.username}, function(err, delSupport) {
            movie.update({_id: req.body.movie_id}, {movieNumSuppose: supportMovie[0].movieNumSuppose - 1},
            function(err) {
              if (err) {
                res.json({status: 1, message: '取消点赞失败', data: err});
              }
              res.json({status: 0, message: '取消点赞成功'});
            });
          });
        }
    });
  });
});
router.post('/findPassword', function(req, res, next) {
  if (req.body.repassword) {
    if (req.header('Access-Token')) {
      if (!req.body.user_id) {
        res.json({status: 1, message: '用户登录错误'});
      }
      if (!req.body.password) {
        res.json({status: 1, message: '旧密码错误'});
      }
      if (req.body.user_id == jwt.test(req.header('Access-Token')).iss) {
        user.findOne({_id: req.body.user_id, password: getSha256Password(req.body.password)}, 
          function(err, checkUser) {
            if (checkUser) {
              user.update({_id: req.body.user_id}, {password: getSha256Password(req.body.repassword)}, 
                function(err, userUpdate) {
                  if (err) {
                    res.json({status: 1, message: '更改错误', data: err});
                  } else {
                    res.json({status: 0, message: '更改成功', data: userUpdate});
                  }
                });
            } else {
              res.json({status: 1, message: '旧密码错误'});
            }
        });
      } else {
        res.json({status: 1, message: '旧密码错误'});
      }
    } else {
      user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone, 
      function(err, userFound) {
        if (userFound.length != 0) {
          user.update({_id: userFound[0]._id}, {password: getSha256Password(req.body.repassword)}, 
            function(err, userUpdate) {
              if (err) {
                res.json({status: 1, message: '更改错误', data: err});
              } else {
                res.json({status: 0, message: '更改成功', data: userUpdate});
              }
            });
        } else {
          res.json({status: 1, message: '信息错误'});
        }
      });
    }
  } else {
    if (!req.body.username) {
      res.json({status: 1, message: '用户名称为空'});
    }
    if (!req.body.userMail) {
      res.json({status: 1, message: '用户邮箱为空'});
    }
    if (!req.body.userPhone) {
      res.json({status: 1, message: '用户手机为空'});
    }
    user.findUserPassword(req.body.username, req.body.userMail, req.body.userPhone,
    function(err, userFound) {
      if (userFound.length != 0) {
        res.json({status: 0, message: '验证成功, 请修改密码', data: {username: 
          req.body.username,userMail: req.body.userMail, userPhone: req.body.userPhone}});
      } else {
        res.json({status: 1, message: '信息错误'});
      }
    });
  }
});
router.post('/sendEmail', function(req, res, next) {
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户登录异常'});
  }
  if (!req.body.toUserName) {
    res.json({status: 1, message: '未选择相关的用户'});
  }
  if (!req.body.title) {
    res.json({status: 1, message: '标题不能为空'});
  }
  if (!req.body.context) {
    res.json({status: 1, message: '内容不能为空'});
  }
  if (req.header('Access-Token') && req.body.user_id == jwt.test(req.header('Access-Token')).iss) {
    user.findByUsername(req.body.toUserName, function(err, toUser) {
      if (toUser.length != 0) {
        var NewEmail = new mail({
          fromUser: req.body.user_id,
          toUser: toUser[0]._id,
          title: req.body.title,
          context: req.body.context
        });
        NewEmail.save(function () {
          res.json({status: 0, message: '发送成功'});
        })
      } else {
        res.json({status: 1, message: '您发送的对象不存在'});
      }
    });
  } else {
    res.json({status: 1, message: '用户登录错误'})
  }
});
router.post('/showEmail', function(req, res, next) {
  if (!req.body.user_id) {
    res.json({status: 1, message: '用户登录状态出错'});
  }
  if (!req.body.receive) {
    res.json({status: 1, message: '参数出错'});
  }
  if (req.header('Access-Token') && req.body.user_id == jwt.test(req.header('Access-Token')).iss) {
    if (req.body.receive == 1) {
      mail.findByFromUserId(req.body.user_id, function (err, sendEmail) {
        res.json({status: 0, message: '获取成功', data: sendEmail});
      }); 
    } else {
      mail.findByToUserId(req.body.user_id, function (err, receiveEmail) {
        res.json({status: 0, message: '获取成功', data: receiveEmail});
      });
    }
  } else {
    res.json({status: 1, message: '用户登录错误'});
  }
});
router.post('/download', function(req, res, next) {
  if (!req.body.movie_id) {
    res.json({status: 1, message: '电影Id传递失败'});
  }
  movie.findById(req.body.movie_id, function(err, downloadMovie) {
    movie.update({_id: req.body.movie_id}, {movieNumDownload: 
      downloadMovie.movieNumDownload + 1}, function(err) {
        if (err) {
          res.json({status: 1, message: '下载失败', data: err});
        }
        res.json({status: 0, message: '开始下载', data: downloadMovie.movieDownload});
      });
  });
});

function getMD5Password(id) {
  var md5 = crypto.createHash('md5');
  var token_before = id + new Date(Date.now()) + init_sign;
  return md5.update(token_before).digest('hex', 32);
};
function getSha256Password(data) {
  const hash = crypto.createHash('sha256');
  hash.update(data + init_token);
  return hash.digest('hex');
}
function getRandomString(length) {
  var str = '';
  for ( ; str.length < length; str += Math.random().toString(36).substr(2) );
  return str.substr(0, length);
}
module.exports = router;
