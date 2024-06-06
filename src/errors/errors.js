module.exports = {
  generateInvalidProductData: ({
    title,
    description,
    price,
    code,
    stock,
    category,
  }) => {
    return `Invalid product data:
        *title: should be a non-empty String, received ${title} (${typeof title})
        *description: should be a non-empty String, received ${description} (${typeof description})
        *price: should be a non-empty Number, received ${price} (${typeof price})
        *code: should be a non-empty String, received ${code} (${typeof code})
        *stock: should be a non-empty Number, received ${stock} (${typeof stock})
        *category: should be a non-empty String, received ${category} (${typeof category})`;
  },
  invalidId: (id) => {
    return `Invalid id:
        *id: should be a non-empty and valid String, received ${id} (${typeof id})`;
  },
};
