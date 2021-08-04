import jwt from 'jsonwebtoken'
import User from '../models/AdminSchema.js'

const Authenticate= async (req, res , next) => {
    
    try {
        
        const token = req.cookies.token;
        console.log(token)
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY)
    
        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token": token})
        console.log(rootUser)
    
        if(!rootUser){throw new Error('user not found')}
        req.token = token
        req.rootUser = rootUser
        req.userID = rootUser._id
        req.Name = rootUser.name
    
        next()
        
    } catch (error) {
        res.status(401).send("unautherized")
        console.log(error)
        
    }
    }
    
    export default Authenticate;