const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true},
    information: { type: String, required: true, trim: true },
    recommendation: { 
      low: {type: String, default: "Mantenga una dieta equilibrada respecto con estos alimentos."},
      high: {type: String, default: "Se recomienda no consumir en abundancia esta fruta por el alto azúcar que tiene."}
    },
    picture: {
      url: {
        type: String,
        required: true,
      },
      public_id: { type: String, default: "" }
    }
  },
  {
    timestamps: true
  }
);

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.updatedAt;
  }
});

module.exports = model("Product", productSchema);