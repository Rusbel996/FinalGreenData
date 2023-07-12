const { Schema, model } = require("mongoose");

const catalogueSchema = new Schema(
  {
    product: 
        {
          type: Schema.Types.ObjectId,
          ref: "Product"
        }
      ,
    quantity: { type: Number, required: true, trim: true},
    weight: {type: Number, required: true, trime:true},
    start: { type: Date, required: true, trim: true },
    expiration: { type: Date, required: true, trim: true },
    videos: {type: [String], default: []},
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

catalogueSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.updatedAt;
  }
});

module.exports = model("Catalogue", catalogueSchema);