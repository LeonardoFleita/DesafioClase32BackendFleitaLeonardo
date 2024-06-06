const { CustomError } = require("../errors/customError");
const { ErrorCodes } = require("../errors/errorCodes");
const { generateInvalidProductData, invalidId } = require("../errors/errors");

class ProductController {
  constructor(productService) {
    this.service = productService;
  }

  #handleError(req, err) {
    if (err.message === "invalid product data") {
      const data = req.body;
      throw CustomError.createError({
        name: err.message,
        cause: generateInvalidProductData({
          title: data.title,
          description: data.description,
          price: data.price,
          code: data.code,
          stock: data.stock,
          category: data.category,
        }),
        message: "Error trying to create a new product",
        code: ErrorCodes.INVALID_PARAMETERS,
      });
    }

    if (err.message === "invalid parameters") {
      const id = req.params.pId;
      throw CustomError.createError({
        name: err.message,
        cause: invalidId(id),
        message: "Error finding a product",
        code: ErrorCodes.INVALID_PARAMETERS,
      });
    }

    if (err.message === "not found") {
      throw CustomError.createError({
        name: err.message,
        cause: "Product not found",
        message: "There is not product with the provided id ",
        code: ErrorCodes.NOT_FOUND,
      });
    }

    throw CustomError.createError({
      name: err.message,
      cause: err.message,
      message: err.message,
      code: ErrorCodes.DATABASE_ERROR,
    });
  }

  //Trae los productos

  getProducts = async (req, res) => {
    try {
      const limit = req.query.limit;
      const page = req.query.page;
      const sort = req.query.sort;
      const category = req.query.category;
      const avaiability = req.query.avaiability;
      const products = await this.service.getProducts(
        limit,
        page,
        sort,
        category,
        avaiability
      );

      let data = {
        status: products ? "success" : "error",
        payload: products.docs,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        prevLink: products.prevPage
          ? `/api/products?limit=${products.limit}&page=${products.prevPage}${
              category ? `&category=${category}` : ""
            }${avaiability ? `&avaiability=${avaiability}` : ""}${
              sort ? `&sort=${sort}` : ""
            }`
          : null,
        nextLink: products.nextPage
          ? `/api/products?limit=${products.limit}&page=${products.nextPage}${
              category ? `&category=${category}` : ""
            }${avaiability ? `&avaiability=${avaiability}` : ""}${
              sort ? `&sort=${sort}` : ""
            }`
          : null,
      };
      res.status(200).json(data);
    } catch (err) {
      return this.#handleError(req, err);
    }
  };

  //Trae el producto buscado

  getProductById = async (req, res) => {
    try {
      const pId = req.params.pId;
      const product = await this.service.getProductById(pId);
      res.status(200).json({ product });
    } catch (err) {
      return this.#handleError(req, err);
    }
  };

  //Crea un producto

  addProduct = async (req, res) => {
    try {
      const product = req.body;
      await this.service.addProduct(
        product.title,
        product.description,
        product.price,
        product.thumbnail,
        product.code,
        product.stock,
        product.category,
        product.status
      );
      res.status(200).send({ "Producto agregado": product });
    } catch (err) {
      return this.#handleError(req, err);
    }
  };

  //Modifica un producto

  updateProduct = async (req, res) => {
    try {
      const pId = req.params.pId;
      const newData = req.body;
      await this.service.updateProduct({ ...newData, id: pId });
      const updatedProduct = await this.service.getProductById(pId);
      res.status(200).send({ "Producto actualizado": updatedProduct });
    } catch (err) {
      return this.#handleError(req, err);
    }
  };

  //Elimina un producto

  deleteProduct = async (req, res) => {
    try {
      const pId = req.params.pId;
      await this.service.deleteProduct(pId);
      res.status(200).send("Producto eliminado exitosamente");
    } catch (err) {
      return this.#handleError(req, err);
    }
  };
}

module.exports = { ProductController };
