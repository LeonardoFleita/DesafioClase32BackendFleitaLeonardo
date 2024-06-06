class CartController {
  constructor(cartService) {
    this.service = cartService;
  }

  #handleError(res, err) {
    if (err.message === "not found") {
      return res.status(404).json({ error: "Not found" });
    }

    if (err.message === "invalid parameters") {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    if (err.message === "not authorized") {
      return res.status(403).json({ error: "Not authorized" });
    }

    return res.status(500).json({ error: err.message });
  }

  //Trae todos los carritos

  getCarts = async (req, res) => {
    try {
      const carts = await this.service.getCarts();
      res.status(200).send({ carts });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Crea un nuevo carrito

  addCart = async (req, res) => {
    try {
      const cart = await this.service.addCart();
      res.status(200).send({ "Carrito creado": cart });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Busca un carrito por su id

  getCartById = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const cart = await this.service.getCartById(cartId);
      res.status(200).json({ cart });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Agrega un producto al carrito

  addProductToCart = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const prodId = req.params.pId;
      const user = req.session.user;
      if (cartId !== user.cart) {
        throw new Error("not authorized");
      }
      const addedProduct = await this.service.addProductToCart(cartId, prodId);
      res.status(200).send({ "Producto agregado": addedProduct });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Limpiar carrito

  cleanCart = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const user = req.session.user;
      if (cartId !== user.cart) {
        throw new Error("not authorized");
      }
      const cleanedCart = await this.service.cleanCart(cartId);
      res.status(200).send({ cleanedCart });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Eliminar producto del carrito

  deleteProductFromCart = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const prodId = req.params.pId;
      const user = req.session.user;
      if (cartId !== user.cart) {
        throw new Error("not authorized");
      }
      await this.service.deleteProductFromCart(cartId, prodId);
      res
        .status(200)
        .send(`Se eliminó el producto con id${prodId} del carrito`);
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Actualiza productos del carrito

  updateProductsFromCart = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const data = req.body;
      const user = req.session.user;
      if (cartId !== user.cart) {
        throw new Error("not authorized");
      }
      await this.service.updateProductsFromCart(cartId, data);
      const cart = await this.service.getCartById(cartId);
      res.status(200).json({ cart });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Actualiza la cantidad de un producto del carrito

  updateQuantityProductFromCart = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const prodId = req.params.pId;
      const data = req.body;
      const user = req.session.user;
      if (cartId !== user.cart) {
        throw new Error("not authorized");
      }
      const updatedCart = await this.service.updateQuantityProductFromCart(
        cartId,
        prodId,
        data
      );
      res.status(200).json({ updatedCart });
    } catch (err) {
      return this.#handleError(res, err);
    }
  };

  //Finaliza la compra
  purchase = async (req, res) => {
    try {
      const cartId = req.params.cId;
      const user = req.session.user;
      const productManager = req.app.get("productManager");
      if (cartId !== user.cart) {
        throw new Error("not authorized");
      }
      const ticket = await this.service.purchase(
        cartId,
        user.email,
        productManager
      );
      res.status(200).json(ticket);
    } catch (err) {
      return this.#handleError(res, err);
    }
  };
}

module.exports = { CartController };
