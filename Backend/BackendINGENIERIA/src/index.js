const PORT= 5000
const express = require("express")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express()

app.use(
    cors({
        origin: ["http://localhost:3000"],
      credentials: true
    })
  );
app.use(express.json())
app.use(cookieParser());

require("./conexion")
const userRoute = require("./routes/user")
const productRoute = require("./routes/product");
const catalogueRoute = require("./routes/catalogue");



app.use("/api/user",userRoute)
app.use("/api/product", productRoute);
app.use("/api/catalogue", catalogueRoute);


app.use((error, req, res, next) => {
    console.log("Error name: ", error.name);
    console.log("Error: ", error);
    console.log(error.message);
    return res.status(500).json({ msg: error.message });
  });

app.get("/",(req,res)=>{
    res.send("servidor activado")
})


app.listen(PORT,()=>{
    console.log("el servidor se esta ejecutando en el puerto ",PORT)
})

