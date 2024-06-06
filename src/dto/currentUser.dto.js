class CurrentUserDto {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.cart = user.cart;
  }
}

module.exports = { CurrentUserDto };
