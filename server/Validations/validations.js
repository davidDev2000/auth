import { body } from "express-validator";

// Aqui se van a validar los datos enviados en el body
export const registerValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('fullName').isLength({ min: 3 }),
]

// Aqui validamos autentificacion de usuario al entrar a su cuenta 
export const loginValidator = [
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
]