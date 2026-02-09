const crypto = require('crypto');

exports.generateTempPassword = () => {
  return crypto.randomBytes(9).toString('base64');
};
