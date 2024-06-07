const { Router } = require("express");
const {
  isNotLoggedIn,
  isLoggedIn,
  isAdmin,
} = require("../middlewares/auth.middleware");
const { generateProduct } = require("../mocks/generateProducts");
const { ProductService } = require("../services/productService");
const { ProductController } = require("../controllers/productController");

const router = Router();

// const withProductController = (callback) => {
//   return (req, res) => {
//     const service = new ProductService(req.app.get("productManager"));
//     const controller = new ProductController(service);
//     return callback(controller, req, res);
//   };
// };

//Función que verifica y retorna si el usuario está logueado y los datos del usuario

async function userSession(req) {
  const userManager = req.app.get("userManager");
  const admin = req.app.get("admin");
  const superAdmin = req.app.get("superAdmin");
  const userData = req.session.user;
  let user;
  let isLoggedIn;
  if (userData) {
    if (userData.id === admin._id) {
      user = admin;
    } else if (userData.id === superAdmin._id) {
      user = superAdmin;
    } else {
      user = await userManager.getUserById(userData.id);
    }
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return { user, isLoggedIn };
}

//Mocking

router.get(`/mockingproducts`, async (req, res) => {
  let products = [];
  for (let i = 0; i <= 100; i++) {
    products.push(generateProduct());
  }
  const { user, isLoggedIn } = await userSession(req);

  res.render(`index`, {
    title: "Productos",
    products: products,
    scripts: ["index.js"],
    css: ["styles.css"],
    endPoint: "Home",
    login: true,
    isLoggedIn,
    user,
  });
});

//Index, retorna la vista de productos. Si no hay una sesión iniciada, en el header se puede acceder al login y registro de usuario, en caso que sí haya una sesión iniciada se mostrarán los datos del usuario y se podrá cerrar sesión

router.get(`/`, async (req, res) => {
  const productManager = req.app.get("productManager");
  const limit = req.query.limit;
  const page = req.query.page;
  const sort = req.query.sort;
  const category = req.query.category;
  const avaiability = req.query.avaiability;
  const products = await productManager.getProducts(
    limit,
    page,
    sort,
    category,
    avaiability
  );
  const { user, isLoggedIn } = await userSession(req);

  const isAdmin = user?.role === "admin" ? true : false;

  res.render(`index`, {
    title: "Productos",
    products: products.docs,
    scripts: ["index.js"],
    css: ["styles.css"],
    endPoint: "Home",
    login: true,
    isAdmin,
    isLoggedIn,
    user,
  });
});

//Formulario para agregar productos a la base de datos

router.get("/addProducts", isLoggedIn, isAdmin, async (req, res) => {
  const { user, isLoggedIn } = await userSession(req);
  res.render(`addProducts`, {
    title: "Formulario",
    scripts: ["index.js"],
    css: ["styles.css"],
    endPoint: "Agregar productos",
    login: true,
    isLoggedIn,
    user,
  });
});

//Devuelve la vista del carrito seleccionado. Si el usuario no está logueado esta vista es inaccesible

router.get("/carts/:cId", isLoggedIn, async (req, res) => {
  const cartManager = req.app.get("cartManager");
  const cId = req.params.cId;
  const cart = await cartManager.getCartByIdPopulate(cId);
  const products = cart[0].products.map((p) => {
    return { ...p, totalPrice: p.product.price * p.quantity };
  });
  const { user, isLoggedIn } = await userSession(req);
  res.render("cart", {
    title: "Carrito",
    products: products,
    scripts: ["cart.js"],
    css: ["styles.css"],
    endPoint: "Cart",
    login: true,
    user,
    isLoggedIn,
  });
});

//Retorna la vista de login. Si hay una sessión iniciada no se podrá acceder a esta sección

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login", {
    title: "Login",
    css: ["styles.css"],
    endPoint: "Login",
    login: false,
  });
});

//Retorna la vista de registro. Si hay una sessión iniciada no se podrá acceder a esta sección

router.get("/register", isNotLoggedIn, (req, res) => {
  res.render("register", {
    title: "Registro",
    css: ["styles.css"],
    endPoint: "Registro",
    login: false,
  });
});

module.exports = router;
