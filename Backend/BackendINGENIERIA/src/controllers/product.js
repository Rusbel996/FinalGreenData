const { uploadPicture } = require("../helpers/cloudinary");
const productSchema = require("../schemas/product");
const fs = require("fs-extra");

const productController = {
  createProduct: async (req, res, next) => {
    try {
      const product = req.body;

      if (req.file) {
        const result = await uploadPicture(req.file.path);
        await fs.remove(req.file.path);
        const image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
        product.picture = image;
      }

      const newProduct = new productSchema(product);
      await newProduct.save();

      return res.status(200).json("CREATED");
    } catch (error) {
      next(error);
    }
  },
  getProducts: async (req, res, next) => {
    try {
      const products = await productSchema.find({});

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;