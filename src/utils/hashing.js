const bcrypt = require("bcrypt");

module.exports = {
  hashPassword: (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)),

  isValidPassword: (password, hashpassword) =>
    bcrypt.compareSync(password, hashpassword),
};
