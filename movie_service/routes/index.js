var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

router.get('/mongooseTest', function(req, res, next) {
  mongoose.connect('mongodb://localhost/pets');
  mongoose.Promise = global.Promise;
  
  var Cat = mongoose.model('Cat', {name: String});
  
  var tom = new Cat({name : 'Tom'});
  tom.save(function(err) {
    if (err)
      console.log(err);
    else
      console.log('succes insert');
  });
  res.send('连接测试');
});

module.exports = router;
