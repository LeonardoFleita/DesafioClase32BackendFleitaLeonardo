const passport = require("passport");
const { Strategy } = require("passport-github2");
const UserModel = require("../dao/models/user.model");
const { clientID, clientSecret, callbackURL } = require("./github.private");
const CartManager = require("../dao/dbManagers/cartManager");

const cartManager = new CartManager();

const initializePassport = () => {
  passport.use(
    "github",
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let user = await UserModel.findOne({ email: profile._json.email });
          if (!user) {
            const fullName = profile._json.name;
            const firstName = fullName.substring(0, fullName.lastIndexOf(" "));
            const lastName = fullName.substring(fullName.lastIndexOf(" ") + 1);
            const newUser = {
              firstName,
              lastName,
              age: 30,
              email: profile._json.email,
              password: "",
              cart: await cartManager.addCart(),
            };
            const result = await UserModel.create(newUser);
            return done(null, result);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("serialized!", user);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserialized!", id);
    const user = await User.findById(id);
    done(null, user);
  });
};

module.exports = initializePassport;
