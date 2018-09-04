var mongoose = require('../common/db');
var suppose = new mongoose.Schema({
  movie_id: String,
  username: String
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
// 点赞的查找方式
suppose.statics.findAll = function(callBack) {
  this.find({}, callBack);
};
// 使用用户名和电影ID查找
suppose.statics.findByMovieIdAndUsername = function(m_id, name, callBack) {
  this.find({movie_id: m_id, username: name}, callBack);
};

var supposeModel = mongoose.model('suppose', suppose);
module.exports = supposeModel;