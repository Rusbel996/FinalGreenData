const {connect} = require("mongoose")



const dbConnect = async()=>{
    await connect("mongodb+srv://database:07JAVQTHo2ZsepcP@cluster0.ivi9k9w.mongodb.net/test")
    .then(()=>{
        console.log("conexion correcta a mongodb")
    })
    .catch((error)=>{
        console.log(error)
    })

}

dbConnect()