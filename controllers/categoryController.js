const asyncHandler = require('express-async-handler');
const Category = require('../model/Category')

const categoryrController = {
    create: asyncHandler(async (req, res) => {        
        const {name, type} = req.body
        const {verifiedId} = req

        if(!name || !type){
            throw new Error('Name and type are required for creating a category')
        }

        const normalizedName = name.toLowerCase();
        const validTypes = ['income','expense']

        if(!validTypes.includes(type.toLowerCase())){
            throw new Error('Invalid category type'+type)
        }

        const categoryExists = await Category.findOne({
            name: normalizedName,
            user: verifiedId
        })

        if (categoryExists){
            throw new Error(
                `Category ${categoryExists.name} already exists in the database`
            )
        }

        const category = await Category.create(
            {
                name: normalizedName,
                user: verifiedId,
                type,
            }
        );
        res.status(201).json(category)
    }),
    list: asyncHandler(async (req,res) => {
        const {verifiedId} = req
        const categories = await Category.find({user: verifiedId})
        res.status(200).json(categories)
    }),
    update: asyncHandler(async (req, res) =>{        
    }),
    delete: asyncHandler(async (req, res) => {
    })
}

module.exports = categoryrController;