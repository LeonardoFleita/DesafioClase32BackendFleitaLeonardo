const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const storage = MongoStore.create({
  dbName: process.env.DB_NAME,
  mongoUrl: process.env.MONGO_URL,
  ttl: 180,
});

module.exports = session({
  store: storage,
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
});
