const TicketModel = require("../dao/models/ticket.model");
const moment = require("moment-timezone");

class CartService {
  constructor(cartManager) {
    this.manager = cartManager;
  }

  //Trae todos los carritos

  getCarts = async () => {
    try {
      return await this.manager.getCarts();
    } catch (err) {
      return [];
    }
  };

  //Crea un nuevo carrito

  addCart = async () => {
    try {
      return await this.manager.addCart();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  //Busca un carrito por su id

  getCartById = async (cartId) => {
    try {
      if (cartId === ":cId") {
        throw new Error("invalid parameters");
      }
      return await this.manager.getCartByIdPopulate(cartId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Agrega un producto al carrito

  addProductToCart = async (cartId, productId) => {
    try {
      if (cartId === ":cId" || productId === ":pId") {
        throw new Error("invalid parameters");
      }
      return await this.manager.addProductToCart(cartId, productId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Limpiar carrito

  cleanCart = async (cartId) => {
    try {
      try {
        if (cartId === ":cId") {
          throw new Error("invalid parameters");
        }
        await this.manager.getCartById(cartId);
      } catch (err) {
        throw Error(err.message);
      }
      return await this.manager.cleanCart(cartId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Eliminar producto del carrito

  deleteProductFromCart = async (cartId, productId) => {
    try {
      if (cartId === ":cId" || productId === ":pId") {
        throw new Error("invalid parameters");
      }
      await this.manager.deleteProductFromCart(cartId, productId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Actualiza productos del carrito

  updateProductsFromCart = async (cartId, data) => {
    try {
      if (cartId === ":cId" || Object.keys(data).length === 0) {
        throw new Error("invalid parameters");
      }
      let formatedData = data.map((p) => {
        if (!p.product || !p.quantity || typeof p.quantity !== "number") {
          throw new Error("invalid parameters");
        }
        return { product: p.product, quantity: p.quantity };
      });
      await this.manager.updateProductsFromCart(cartId, formatedData);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Actualiza la cantidad de un producto del carrito

  updateQuantityProductFromCart = async (cartId, prodId, data) => {
    try {
      if (
        !data.quantity ||
        typeof data.quantity !== "number" ||
        cartId === ":cId" ||
        prodId === ":cId"
      ) {
        throw new Error("invalid parameters");
      }
      return await this.manager.updateQuantityProductFromCart(
        cartId,
        prodId,
        data
      );
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Finaliza la compra

  purchase = async (cartId, userEmail, productManager) => {
    try {
      if (cartId === ":cId") {
        throw new Error("invalid parameters");
      }
      const cart = await this.manager.getCartByIdPopulate(cartId);
      const products = cart[0].products;

      const productsInStock = products.filter(
        (p) => p.quantity <= p.product.stock
      );
      const productsOutOfStock = products.filter(
        (p) => p.quantity > p.product.stock
      );

      if (productsInStock.length === 0 && productsOutOfStock.length === 0) {
        throw new Error("empty cart");
      }

      if (productsInStock.length === 0) {
        throw new Error("Selected products are out of stock");
      }

      const totalPrice = (products) => {
        return products.reduce((total, p) => {
          return total + p.product.price * p.quantity;
        }, 0);
      };
      const amount = totalPrice(productsInStock);

      const date = () => {
        const dateAndHour = moment().tz("America/Argentina").format();
        return dateAndHour;
      };
      let purchase_datetime = date();

      const newStock = productsInStock.map((p) => {
        return { id: p.product._id, stock: p.product.stock - p.quantity };
      });
      newStock.map(async (p) => {
        await productManager.updateProduct(p);
      });

      const tickets = await TicketModel.find();
      let code = tickets.length + 1;

      if (productsOutOfStock.length === 0) {
        await this.cleanCart(cartId);
        return {
          ticket: await TicketModel.create({
            code,
            purchase_datetime,
            amount,
            purchaser: userEmail,
          }),
        };
      } else {
        await this.manager.updateProductsFromCart(cartId, productsOutOfStock);
        return {
          ticket: await TicketModel.create({
            code,
            purchase_datetime,
            amount,
            purchaser: userEmail,
          }),
          sinComprar: productsOutOfStock,
        };
      }
    } catch (err) {
      throw Error(err.message);
    }
  };
}

module.exports = { CartService };
