const { Router } = require("express");

const router = Router();

//Crear un nuevo usuario

// router.post("/", async (req, res) => {
//   try {
//     const userManager = req.app.get("userManager");
//     const cartManager = req.app.get("cartManager");
//     const user = req.body;
//     const cart = await cartManager.addCart();
//     await userManager.registerUser(
//       user.firstName,
//       user.lastName,
//       user.age,
//       user.email,
//       user.password,
//       cart
//     );
//     res.status(200).redirect("/login");
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// });

module.exports = router;
