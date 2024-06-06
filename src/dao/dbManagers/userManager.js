const { hashPassword } = require("../../utils/hashing");
const UserModel = require("../models/user.model");

class UserManager {
  constructor() {}

  //Crea un nuevo usuario

  registerUser = async (
    firstName,
    lastName,
    age,
    email,
    password,
    cart,
    role
  ) => {
    try {
      let user = await UserModel.create({
        firstName,
        lastName,
        age,
        email,
        password: hashPassword(password),
        cart,
        role,
      });
      return user;
    } catch (err) {
      throw Error(err);
    }
  };

  //Busca un usuario por id

  getUserById = async (id) => {
    try {
      const user = await UserModel.findOne({ _id: id }).lean();
      if (!user) {
        throw new Error("not found");
      }
      return user;
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Busca un usuario por email

  getUserByEmail = async (email) => {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (err) {
      throw Error(err.message);
    }
  };
}

module.exports = UserManager;
