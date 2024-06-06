const { fakerES: faker } = require("@faker-js/faker");

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: [faker.image.url()],
    code: faker.string.alphanumeric({ length: { min: 5, max: 5 } }),
    stock: faker.number.int({ min: 0, max: 200 }),
    image: faker.image.url(),
    category: faker.commerce.productAdjective(),
    status: true,
  };
};

module.exports = { generateProduct };
