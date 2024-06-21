import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { validationResult } from "express-validator";
import userModel from '../Models/User.js'


export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }


  const password = req.body.password
  // salt es algoritmo de hasheo de bcrypt
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const doc = new userModel({
    email: req.body.email,
    fullName: req.body.fullName,
    passwordHash:hash,
  })

  const user = await doc.save()
// secret123 es la llave como encriptar asi para decriptar
  const token = jwt.sign({
    _id: user._id
  }, 'secret123', {
    expiresIn : '30d'
  })

  const {passwordHash, ...userData} = user._doc

  res.json({
    ...userData,
    token
  })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'No se pudo registrarse'
    })
  }
}

export const login =  async (req,res) => {
  try {
    const user = await userModel.findOne({email: req.body.email})

    if (!user) {
      return res.status(404).json({message:'Usuario no encontrado'})
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      return res.status(400).json({message:'Usuario o Contraseña incorrecta CTM'})
    }

    const token = jwt.sign({
      _id: user._id
    }, 'secret123', {
      expiresIn : '30d'
    })

    const {passwordHash, ...userData} = user._doc

    res.json({
    ...userData,
    token
  })
  } 

  catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'No se pudo autorizarse'
    })
  }
}

export const getMe = async(req, res) => {
  try {
    const user = await userModel.findById(req.userId)

    if (!user) {
    return  res.status(404).json('Usuario no encontrado')
    }
    const {passwordHash, ...userData} = user._doc

  res.json(userData)
  } 
  catch (error) {
    
  }
}