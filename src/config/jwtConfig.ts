import jwt from "jsonwebtoken"

const JWT_TOKEN = process.env.SECRET_TOKEN as jwt.Secret

export default JWT_TOKEN