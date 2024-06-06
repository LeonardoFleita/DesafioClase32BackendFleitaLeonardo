const { CurrentUserDto } = require("../dto/currentUser.dto");

class UserController {
  constructor(userService) {
    this.service = userService;
  }

  getSessionUser = async (req, res) => {
    try {
      const sessionUser = req.session.user;
      if (!sessionUser) {
        throw new Error("there is not session");
      }
      const admin = req.app.get("admin");
      const superAdmin = req.app.get("superAdmin");
      let user;
      if (admin.email === sessionUser.email && admin._id === sessionUser.id) {
        user = new CurrentUserDto(admin);
        return res.status(200).json({ user });
      }
      if (
        superAdmin.email === sessionUser.email &&
        superAdmin._id === sessionUser.id
      ) {
        user = new CurrentUserDto(superAdmin);
        return res.status(200).json({ user });
      }
      const userWanted = await this.service.getUserById(sessionUser.id);
      if (!userWanted) {
        throw new Error("not found");
      }
      user = new CurrentUserDto(userWanted);
      res.status(200).json({ user });
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  };
}

module.exports = { UserController };
