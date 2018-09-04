var mongoose = require('../common/db');
var movie = new mongoose.Schema({
  movieName: String,
  movieImg: String,
  movieVideo: String,
  movieDownload: String,
  movieNumSuppose: Number,
  movieNumDownload: Number,
  movieMainPage: Boolean
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
// 电影的查找方式
movie.statics.findAll = function(callBack) {
  this.find({}, callBack);
};
// 使用电影Id查找
movie.statics.findByMovieId = function(m_id, callBack) {
  this.find({_id: m_id}, callBack);
};
// 使用电影名查找
movie.statics.findByMovieName = function(name, callBack) {
  this.find({movieName: name}, callBack);
};

var movieModel = mongoose.model('movie', movie);
module.exports = movieModel;