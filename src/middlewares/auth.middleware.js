module.exports = {
  isNotLoggedIn: (req, res, next) => {
    const user = req.session.user;
    if (user) {
      return res.status(401).json({
        error: "not authenticated",
      });
    }
    next();
  },
  isLoggedIn: (req, res, next) => {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({
        error: "not authenticated",
      });
    }
    next();
  },
  isAdmin: (req, res, next) => {
    const user = req.session.user;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "not authorized" });
    }
    next();
  },
  isUser: (req, res, next) => {
    const user = req.session.user;
    if (user.role !== "user") {
      return res.status(403).json({ error: "not authorized" });
    }
    next();
  },
};
