import express from "express"
import mongoose from "mongoose";
import { registerValidator, loginValidator } from "./Validations/validations.js";
import checkAuth from "./Utils/checkAuth.js";
import { register, login, getMe } from "./Controllers/userControllers.js";

// conectamos con base de datos
mongoose
.connect("mongodb+srv://admin:admin1234@cluster1.jam19oj.mongodb.net/blog?")
.then(() => {console.log("DB online")})
.catch((err) => {console.log(`Server failed due to ${err}`)})


// arranca servidor
const app = express();
// enseña a express comprender formato JSON
app.use(express.json())


app.post("/auth/register", registerValidator, register)
app.post("/auth/login",loginValidator, login);
app.get("/auth/me", checkAuth, getMe)

// Define a que puerto debe de escuchar el servidor
app.listen(3000, (err) => {
  if(err) {
    console.log(err)
  }

  console.log("Server online")
})