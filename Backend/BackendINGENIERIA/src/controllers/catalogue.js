const userSchema = require("../schemas/user");
const productSchema = require("../schemas/product")
const catalogueSchema = require("../schemas/catalogue")

const catalogueController = {
  createCatalogue: async (req, res, next) => {
    try {
      const catalogue = req.body;
      const { userId, productId } = req.body;

      const user = await userSchema.findById(userId);

      if (!user) return res.status(404).json({ msg: "Usuario no autenticado" });

      const product = await productSchema.findById(productId);

      if (!product)
        return res.status(404).json({ msg: "Producto no encontrado" });

      catalogue.start = new Date(catalogue.start.replaceAll("-","/")).toISOString();
      catalogue.expiration = new Date(catalogue.expiration.replaceAll("-","/")).toISOString();

      catalogue.user = user._id
      catalogue.product = product._id;

      const newCatalogue = new catalogueSchema(catalogue);
      const createdCatalogue = await newCatalogue.save();
      const populateCatalogue = await createdCatalogue.populate("product");

      user.catalogue = user.catalogue.concat(createdCatalogue._id);

      await user.save();

      return res.status(200).json(populateCatalogue);
    } catch (error) {
      next(error);
    }
  },
  getCatalogue: async (req, res, next) => {
    try {
        const catalogue = await catalogueSchema.find({}).populate("product");

      return res.status(200).json(catalogue);
    } catch (error) {
        next(error)
    }
  },
  getSingleCatalogue: async (req, res, next) => {
    try {
      const { id } = req.params;

      const catalogue = await catalogueSchema
        .findById(id).populate("product")

      if (!catalogue)
        return res.status(404).json({ msg: "Catálogo no existente" });

      return res.status(200).json(catalogue);
    } catch (error) {
        next(error)
    }
  },
  updateCatalogue: async (req, res, next) => {
    try {
      const { id } = req.params;
      const newProductInfo = req.body;

      const product = await catalogueSchema.findById(id);

      if (!product)
        return res.status(404).json({ msg: "Producto no existente" });


      await catalogueSchema.findByIdAndUpdate(id, newProductInfo, {
        new: true
      });

      return res.status(200).json("UPDATED");
    } catch (error) {
      next(error);
    }
  },
  deleteCatalogue: async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const catalogue = await catalogueSchema.findByIdAndRemove(id);
  
      const user = await userSchema.findById(catalogue.user);
  
      user.catalogue = user.catalogue.filter(
        (catalogueDelete) => catalogueDelete.toString() !== catalogue._id.toString()
      );
  
      await user.save();
  
      res.json("DELETED");
    } catch (error) {
      next(error);
    }
  }
};

module.exports = catalogueController;
