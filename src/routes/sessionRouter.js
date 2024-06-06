const { Router } = require("express");
const passportCall = require("../utils/passportCall");
const { UserController } = require("../controllers/userController");
const { SessionController } = require("../controllers/sessionController");
const { UserService } = require("../services/userService");

const router = Router();

const withSessionController = (callback) => {
  return (req, res) => {
    const controller = new SessionController();
    return callback(controller, req, res);
  };
};

const withUserController = (callback) => {
  return (req, res) => {
    const service = new UserService(req.app.get("userManager"));
    const controller = new UserController(service);
    return callback(controller, req, res);
  };
};

//Permite registrar un usuario en la api

router.post(
  "/register",
  passportCall("register"),
  withSessionController((controller, req, res) => controller.register(req, res))
);

//Permite iniciar sesión en la api

router.post(
  "/login",
  passportCall("login"),
  withSessionController((controller, req, res) => controller.login(req, res))
);

//Permite registrar un usuario en el front

router.post(
  "/registerView",
  passportCall("register"),
  withSessionController((controller, req, res) =>
    controller.registerView(req, res)
  )
);

//Permite iniciar sesión en el front

router.post(
  "/loginView",
  passportCall("login"),
  withSessionController((controller, req, res) =>
    controller.loginView(req, res)
  )
);

//Devuelve los datos del usuario logueado en un json

router.get(
  "/current",
  withUserController((controller, req, res) =>
    controller.getSessionUser(req, res)
  )
);

//Permite cerrar sesión en la api

router.get(
  "/logout",
  withSessionController((controller, req, res) => controller.logout(req, res))
);

//Permite cerrar sesión en el front

router.get(
  "/logoutView",
  withSessionController((controller, req, res) =>
    controller.logoutView(req, res)
  )
);

/*
//Permite iniciar sesión con github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  () => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  withSessionController((controller, req, res) =>
    controller.githubLogin(req, res)
  )
);
*/

module.exports = router;
