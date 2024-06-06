const { isValidPassword } = require("../utils/hashing");
const { Strategy } = require("passport-local");
const passport = require("passport");
const { admin, superAdmin } = require("../utils/admin");

const initializePassport = () => {
  passport.use(
    "register",
    new Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        const userManager = req.app.get("userManager");
        const cartManager = req.app.get("cartManager");
        const cart = await cartManager.addCart();
        let user = await userManager.getUserByEmail(username);
        try {
          if (user) {
            return done(null, false, {
              message: "El usuario ya se encuentra registrado",
            });
          }
          let result = await userManager.registerUser(
            firstName,
            lastName,
            age,
            email,
            password,
            cart
          );

          return done(null, result);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "login",
    new Strategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { email } = req.body;
        const userManager = req.app.get("userManager");
        try {
          if (!username || !password) {
            return done(null, false);
          }

          if (email === admin.email && password === admin.password) {
            let result = admin;
            return done(null, result);
          }
          if (email === superAdmin.email && password === superAdmin.password) {
            let result = superAdmin;
            return done(null, result);
          }

          let user = await userManager.getUserByEmail(username);
          if (!user) {
            return done(null, false, {
              message: "Usuario o contraseña incorrectos",
            });
          }

          if (!isValidPassword(password, user.password)) {
            return done(null, false, {
              message: "Usuario o contraseña incorrectos",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    if (id === admin._id) {
      return done(null, admin);
    }
    if (id === superAdmin._id) {
      return done(null, superAdmin);
    }
    const userManager = req.app.get("userManager");
    const user = await userManager.getUserById(id);
    done(null, user);
  });
};

module.exports = initializePassport;
