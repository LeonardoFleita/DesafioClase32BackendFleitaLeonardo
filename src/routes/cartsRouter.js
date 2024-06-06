const { Router } = require("express");
const { CartController } = require("../controllers/cartController");
const { CartService } = require("../services/cartService");
const { isLoggedIn, isUser } = require("../middlewares/auth.middleware");

const router = Router();

const withController = (callback) => {
  return (req, res) => {
    const service = new CartService(req.app.get("cartManager"));
    const controller = new CartController(service);
    return callback(controller, req, res);
  };
};

//Trae todos los carritos

router.get(
  `/`,
  withController((controller, req, res) => controller.getCarts(req, res))
);

//Trae el carrito buscado

router.get(
  `/:cId`,
  withController((controller, req, res) => controller.getCartById(req, res))
);

//Crea un nuevo carrito

router.post(
  `/`,
  isLoggedIn,
  isUser,
  withController((controller, req, res) => controller.addCart(req, res))
);

//Agrega un producto a un carrito especificado

router.post(
  `/:cId/products/:pId`,
  isLoggedIn,
  isUser,
  withController((controller, req, res) =>
    controller.addProductToCart(req, res)
  )
);

//Limpia el carrito

router.delete(
  `/:cId`,
  isLoggedIn,
  isUser,
  withController((controller, req, res) => controller.cleanCart(req, res))
);

//Elimina un producto del carrito

router.delete(
  "/:cId/products/:pId",
  isLoggedIn,
  isUser,
  withController((controller, req, res) =>
    controller.deleteProductFromCart(req, res)
  )
);

//Actualiza el carrito

router.put(
  "/:cId",
  isLoggedIn,
  isUser,
  withController((controller, req, res) =>
    controller.updateProductsFromCart(req, res)
  )
);

//Actualiza las cantidades de un producto del carrito

router.put(
  "/:cId/products/:pId",
  isLoggedIn,
  isUser,
  withController((controller, req, res) =>
    controller.updateQuantityProductFromCart(req, res)
  )
);

//Finaliza la compra

router.post(
  "/:cId/purchase",
  isLoggedIn,
  isUser,
  withController((controller, req, res) => controller.purchase(req, res))
);

module.exports = router;
