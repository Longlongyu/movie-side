var jwt = require('jwt-simple');
var moment = require('moment');

const secret = 'longlongyu';
var getJwt = function(user_id) {
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: user_id,
    exp: expires
  }, secret);
  return token;
}

var testJwt = function(token) {
  var decoded = jwt.decode(token, secret);
  return decoded;
}
module.exports = {
  create: getJwt,
  test: testJwt
}