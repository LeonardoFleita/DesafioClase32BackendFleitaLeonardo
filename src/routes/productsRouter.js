const { Router } = require("express");
const { ProductController } = require("../controllers/productController");
const { ProductService } = require("../services/productService");
const { isLoggedIn, isAdmin } = require("../middlewares/auth.middleware");
const { generateProduct } = require("../mocks/generateProducts");

const router = Router();

const withController = (callback) => {
  return (req, res) => {
    const service = new ProductService(req.app.get("productManager"));
    const controller = new ProductController(service);
    return callback(controller, req, res);
  };
};

//Trae el mocking

router.get("/mockingproducts", (req, res) => {
  let products = [];
  for (let i = 0; i <= 100; i++) {
    products.push(generateProduct());
  }

  res.status(200).json({ status: "success", products });
});

//Trae los productos

router.get(
  "/",
  withController((controller, req, res) => controller.getProducts(req, res))
);

//Trae el producto buscado

router.get(
  "/:pId",
  withController((controller, req, res) => controller.getProductById(req, res))
);

//Crea un producto

router.post(
  `/`,
  isLoggedIn,
  isAdmin,
  withController((controller, req, res) => controller.addProduct(req, res))
);

//Modifica un producto

router.put(
  `/:pId`,
  isLoggedIn,
  isAdmin,
  withController((controller, req, res) => controller.updateProduct(req, res))
);

//Elimina un producto

router.delete(
  `/:pId`,
  isLoggedIn,
  isAdmin,
  withController((controller, req, res) => controller.deleteProduct(req, res))
);

module.exports = router;
