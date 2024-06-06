class SessionController {
  constructor() {}

  //Métodos para la api

  register = async (req, res) => {
    res.send("successful registration");
  };

  login = async (req, res) => {
    const user = req.user;
    req.session.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      cart: user.cart ? user.cart._id : null,
    };
    const userSession = req.session.user;
    res.send({ status: "successful login", userSession });
  };

  logout = async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          throw Error(err);
        }
        res.send("successful logout");
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  //Métodos para el front

  registerView = async (req, res) => {
    res.redirect("/login");
  };

  loginView = async (req, res) => {
    const user = req.user;
    req.session.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    res.redirect("/");
  };

  logoutView = async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          throw Error(err);
        }
        res.redirect("/login");
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // githubLogin = async (req, res) => {
  //   const user = req.user;
  //   req.session.user = { id: user._id.toString(), email: user.email };
  //   res.redirect("/");
  // };
}

module.exports = { SessionController };
