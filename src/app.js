const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const sessionMiddle = require("./session/mongoStorage");
const productsRouter = require(`${__dirname}/routes/productsRouter`);
const cartsRouter = require(`${__dirname}/routes/cartsRouter`);
const CartManager = require(`${__dirname}/dao/dbManagers/cartManager`);
const viewsRouter = require(`${__dirname}/routes/viewsRouter`);
const sessionRouter = require(`${__dirname}/routes/sessionRouter`);
const usersRouter = require(`${__dirname}/routes/usersRouter`);
const UserManager = require(`${__dirname}/dao/dbManagers/userManager`);
const ProductManager = require(`${__dirname}/dao/dbManagers/productManager`);
const passport = require("passport");
const initializePassport = require("./config/passport-local.config");
const initializePassportGithub = require("./config/passport-github.config");
const { admin, superAdmin } = require("./utils/admin");
const { errorHandler } = require("./errors/errorHandler");
require("dotenv").config();

const app = express();

app.use(sessionMiddle);

initializePassport();
initializePassportGithub();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/../public`));

app.engine(`handlebars`, handlebars.engine());
app.set(`views`, `${__dirname}/views`);
app.set(`view engine`, `handlebars`);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/users", usersRouter);

app.use(`/`, viewsRouter);

app.use(errorHandler);

const execute = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    });

    app.set("productManager", new ProductManager());
    app.set("cartManager", new CartManager());
    app.set("userManager", new UserManager());
    app.set("admin", admin);
    app.set("superAdmin", superAdmin);

    app.listen(8080, () => {
      console.log("Servidor listo");
    });
  } catch (err) {
    console.error(err);
  }
};

execute();
