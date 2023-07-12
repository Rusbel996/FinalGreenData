const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    size: { type:Number, default: 0},
    weight: {type:Number, default: 0},
    avatar: {
        url: {
          type: String,
          default: "https://res.cloudinary.com/dzgiu2txq/image/upload/v1665616153/avatar/blank_profile_picture_hf0cjj.png"
        },
        public_id: { type: String, default: "" }
    },
    catalogue:  [{
      type: Schema.Types.ObjectId,
      ref: "Catalogue"
    }]
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
