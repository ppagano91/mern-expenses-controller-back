const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
const User = require('../model/User')

const userController = {
    register: asyncHandler(async(req, res) => {
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
}

module.exports = userController;