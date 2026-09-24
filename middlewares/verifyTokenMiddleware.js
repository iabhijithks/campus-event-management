import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

export function verifyToken(req,res,next){

    let token = req.cookies?.token

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Token not found"
        })
    }

    try{

        let decodedToken = jwt.verify(token,process.env.JWT_SECRET)

        req.user = decodedToken

        next()

    }
    catch(error){

        res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        })

    }

}