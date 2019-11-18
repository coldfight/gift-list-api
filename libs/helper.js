const jwt = require("jsonwebtoken");

exports.normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

exports.TOKEN_EXPIRY_SECONDS = 60 * 60;
exports.generateJwt = (username, userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username, userId },
      process.env.JWT_SECRET,
      {
        expiresIn: this.TOKEN_EXPIRY_SECONDS
      },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      }
    );
  });
};
