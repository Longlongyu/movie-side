var mongoose = require('../common/db');
var user = new mongoose.Schema({
  username: String,
  password: String,
  userMail: String,
  userPhone: String,
  userAdmin: Boolean,
  userPower: Number,
  userStop: Boolean
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
// 用户的查找方式
user.statics.findAll = function(callBack) {
  this.find({}, callBack);
};
// 使用用户名查找
user.statics.findByUsername = function(name, callBack) {
  this.find({username: name}, callBack);
};
// 登录匹配
user.statics.findUserLogin = function(name, password, callBack) {
  this.find({username: name, password: password, userStop: false}, callBack);
};
// 验证邮箱、电话和用户名找到用户
user.statics.findUserPassword = function(name, mail, phone, callBack) {
  this.find({username: name, userMail: mail, userPhone: phone}, callBack);
};

var userModel = mongoose.model('user', user);
module.exports = userModel;
