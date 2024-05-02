const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../model/User')

const userController = {
    register: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body
        
        // Validation data
        if(!username || !email || !password){
            throw new Error('All fields are required')
            res.json({ message: "All fields are required", error: true })
        }

        const userExists = await User.findOne({email});
        if (userExists){
            throw new Error('User already exists')
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create User
        const userCreated = await User.create({username,email,password:hashedPassword})

        // Send response
        res.json({  message: "User created successfuly! ",
                    content:{
                        username:userCreated.username,
                        email: userCreated.email,
                        password: userCreated.password,
                        id: userCreated._id
                    }
                })
    }),
    login: asyncHandler(async (req,res) => {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user){
            throw new Error('Invalid login credentials')
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            throw new Error('Invalid login credentials')
        }

        const token = jwt.sign({id: user._id}, 'vivalavida', {
            expiresIn: '1d'
        })

        res.json({
            message: 'Login Success!',
            token,
            id: user._id,
            email: user.email,
            username: user.username
        })

    }),
    profile: asyncHandler(async (req, res) =>{        
        const user = await User.findById(req.verifiedIdUser)
        if(!user){
            throw new Error('User not found!')
        }

        res.json({username: user.username, email: user.email})
    }),
    changeUserPassword: asyncHandler(async (req, res) => {
        const {newPassword} = req.body

        const user = await User.findById(req.verifiedIdUser)
        if(!user){
            throw new Error('User not found!')
        }
        
        // TODO: agregar validación de de password actual antes de cambiar
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        user.password = hashedPassword
        await user.save()

        res.json({message: 'Password change successfuly!'})


    }),
    updateUserProfile: asyncHandler(async (req, res) => {
        const {email, username} = req.body
        
        // TODO: se pueden agregar más campos para modificar y verificación de password para grabar los cambios
        const updatedUser = await User.findByIdAndUpdate(req.verifiedIdUser,{username, email},{new: true})

        res.json({message: 'User Profile updated successfuly!', user: updatedUser})


    })
}

module.exports = userController;