require("dotenv").config();

const admin = {
  firstName: "Coder",
  lastName: "House",
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
  _id: "coder123",
};

const superAdmin = {
  firstName: "Coder",
  lastName: "House",
  email: process.env.SADMIN_EMAIL,
  password: process.env.SADMIN_PASSWORD,
  role: "admin",
  _id: "coder124",
};

module.exports = {
  admin,
  superAdmin,
};
