const User = require('./userModel')
const jwt = require('jsonwebtoken')



const userController = {
    register: async (req, res) => {
        try {
            const {name, email, password} = req.body
            const user = await User.findOne({email})
            if(user) {
                return res.status(400).json({msg : "this user already exist"})
            }
            if(password.length < 6){
                return res.status(400).json({msg : "password length should be greater or equal 6 character"})
            }
            const newUser = User({
                name, email, password
            })
            await newUser.save()

            //jsonwebtoken for authentication
            const accesstoken = createAccessToken({ id : newUser._id })
            const refreshtoken = createRefreshToken({ id : newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly : true,
                path : '/api/refresh_token'
            })

            res.json({accesstoken})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if(!user){
                return res.status(400).json({msg : "this user is not exist"})
            }
            if(password != user.password){
                return res.status(400).json({msg : "password is incorrect"})
            }
            const accesstoken = createAccessToken({ id : user._id })
            const refreshtoken = createRefreshToken({ id : user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly : true,
                path : '/api/refresh_token',
                maxAge: 7*24*60*60*1000 
            })

            res.json({accesstoken})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path : "/api/refresh_token"})
            return res.json({msg : "loggedout successfully"})
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken : (req, res) => {
        try{
            const rf_token = req.cookies.refreshtoken
            console.log(rf_token)
            if(!rf_token){
                return res.status(400).json({msg : "please login or register"})
            }
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err){
                    return res.status(400).json({msg : "please login or register"})
                }
                const accesstoken = createAccessToken({id : user.id})
                res.json({ user, accesstoken })
            })
        }catch(err){
            res.status(500).json({msg : err.message})
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userController;