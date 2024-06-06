class ProductService {
  constructor(productManager) {
    this.manager = productManager;
  }

  //Trae los productos

  getProducts = async (limit, page, sort, category, avaiability) => {
    try {
      return await this.manager.getProducts(
        limit,
        page,
        sort,
        category,
        avaiability
      );
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Trae el producto buscado

  getProductById = async (prodId) => {
    try {
      if (prodId === ":pId") {
        throw new Error("invalid parameters");
      }
      return this.manager.getProductById(prodId);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Crea un producto

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status
  ) => {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        throw new Error("invalid product data");
      }
      return this.manager.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status
      );
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Modifica un producto

  updateProduct = async (product) => {
    try {
      try {
        if (product.id === ":pId") {
          throw new Error("invalid parameters");
        }
        await this.manager.getProductById(product.id);
      } catch (err) {
        throw Error(err.message);
      }
      await this.manager.updateProduct(product);
    } catch (err) {
      throw Error(err.message);
    }
  };

  //Elimina un producto

  deleteProduct = async (prodId) => {
    try {
      try {
        if (prodId === ":pId") {
          throw new Error("invalid parameters");
        }
        await this.manager.getProductById(prodId);
      } catch (err) {
        throw Error(err.message);
      }
      await this.manager.deleteProduct(prodId);
    } catch (err) {
      throw Error(err.message);
    }
  };
}

module.exports = { ProductService };
