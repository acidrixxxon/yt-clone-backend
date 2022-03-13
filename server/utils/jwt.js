import jwt from 'jsonwebtoken'

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_TOKEN,{
        expiresIn: '30d'
    })
}

export const decodeToken = (token) => {
    return jwt.verify(token,process.env.JWT_TOKEN,)
}