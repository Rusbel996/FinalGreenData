const { uploadAvatar, deleteAvatar } = require("../helpers/cloudinary");
const { access, refresh } = require("../helpers/createToken");
const userSchema = require("../schemas/user");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");

const userController = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ msg: "completar todos los campos" });
      }
      const user = await userSchema.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "correo utilizado" });
      }
      const newUser = new userSchema({ name, email, password });

      await newUser.save();
      return res.status(200).json({ msg: `Registrado exitosamente` });
    } catch (error) {
      next(error);
    }
  },
  logIn: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userSchema.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({ msg: "El correo no pertenece a una cuenta" });


      if (user.password !== password)
        return res.status(400).json({ msg: "Contraseña incorrecta" });

      const rf_token = refresh({ id: user._id });

      res.cookie("rftoken", rf_token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax"
      });

      res.status(200).json({ name: user.name, catalogue: user.catalogue.length });
    } catch (error) {
      next(error);
    }
  },
  accessToken: async (req, res, next) => {
    try {
      const rf_token = req.cookies.rftoken;

      if (!rf_token)
        return res
          .status(400)
          .json({ msg: "Por favor, inicie sesión nuevamente" });

      jwt.verify(rf_token, "CYZ8axB206", (err, user) => {
        if (err)
          return res
            .status(400)
            .json({ msg: "Por favor, inicie sesión nuevamente" });

        const ac_token = access({ id: user.id });

        return res.status(200).json({ ac_token });
      });
    } catch (error) {
      next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await userSchema
        .findById(req.user.id)
        .select("-password -__v -updatedAt").populate({path: "catalogue", populate: {path: "product"}});

      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
  updateAvatar: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await userSchema.findById(id);

      if (!user)
        return res.status(404).json({ msg: "Usuario no existente" });

      let image = null;

      if (user.avatar.public_id === "") {
        const result = await uploadAvatar(req.file.path);
        await fs.remove(req.file.path);
        image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } else {
        await deleteAvatar(user.avatar.public_id);
        const result = await uploadAvatar(req.file.path);
        await fs.remove(req.file.path);
        image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      }

      user.avatar.url = image.url;
      user.avatar.public_id = image.public_id;

      const updatedUser = await userSchema.findByIdAndUpdate(
        id,
        user,
        {
          new: true
        }
      );

      return res.status(200).json({url: updatedUser.avatar.url, public_id: updatedUser.avatar.public_id});
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const newUserInfo = req.body;

      const user = await userSchema.findById(id);

      if (!user)
        return res.status(404).json({ msg: "Usuario no existente" });


      await userSchema.findByIdAndUpdate(id, newUserInfo, {
        new: true
      });

      return res.status(200).json("UPDATED");
    } catch (error) {
      next(error);
    }
  },
  signOut: async (req, res, next) => {
    try {
      res.clearCookie("rftoken");

      return res.status(200).json({ msg: "Ha cerrado sesión" });
    } catch (error) {
      next(error);
    }
  },

};

module.exports = userController;
