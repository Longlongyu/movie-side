var mongoose = require('../common/db');
var article = new mongoose.Schema({
  articleTitle: String,
  articleContext: String
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
// 文章的查找方式
article.statics.findAll = function(callBack) {
  this.find({}, callBack);
};
// 使用用标题查找
article.statics.findByArticleTitle = function(title, callBack) {
  this.find({articleTitle: title}, callBack);
};
article.statics.findByArticleId = function(a_id, callBack) {
  this.find({_id: a_id}, callBack);
};

var articleModel = mongoose.model('article', article);
module.exports = articleModel;