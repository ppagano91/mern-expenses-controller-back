const asyncHandler = require('express-async-handler');
const Category = require('../model/Category');
const Transaction = require('../model/Transaction');

const categoryrController = {
    create: asyncHandler(async (req, res) => {        
        const {name, type} = req.body
        const {verifiedIdUser} = req

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
            user: verifiedIdUser
        })

        if (categoryExists){
            throw new Error(
                `Category ${categoryExists.name} already exists in the database`
            )
        }

        const category = await Category.create(
            {
                name: normalizedName,
                user: verifiedIdUser,
                type,
            }
        );
        res.status(201).json(category)
    }),
    list: asyncHandler(async (req,res) => {
        const {verifiedIdUser} = req
        const categories = await Category.find({user: verifiedIdUser})
        res.status(200).json(categories)
    }),
    byId: asyncHandler(async (req,res) => {
        const {id: categoryId} = req.params;
        // const {verifiedIdUser} = req
        const category = await Category.findById(categoryId)
        res.status(200).json(category)
    }),
    update: asyncHandler(async (req, res) =>{       
        const {id: categoryId} = req.params;
        const {type, name} = req.body;
        const {verifiedIdUser} = req;
        const normalizedName = name.toLowerCase()
        const category = await Category.findById(categoryId)
        if(category && category.user.toString() !== verifiedIdUser.toString()){
            throw new Error("Category not found or user not authorized")
        }

        const oldName = category.name
        category.name = normalizedName || category.name
        category.type = type || category.type

        const updatedCategory = await category.save()

        if(oldName !== updatedCategory.name){
            await Transaction.updateMany({user: verifiedIdUser, category:oldName},{ $set:{category: updatedCategory.name}})
        }

        res.json(updatedCategory)
    }),
    delete: asyncHandler(async (req, res) => {
        const {id: categoryId} = req.params
        const {verifiedIdUser} = req
        const category = await Category.findById(req.params.id)
    
    if(category && category.user.toString() === verifiedIdUser.toString()){
        // Update transactions
        const defaultCategory = 'Uncategorized'
        await Transaction.updateMany(
            {
                user: verifiedIdUser,
                category: category.name
            },
            {
                category: defaultCategory
            }
        )
        await Category.findByIdAndDelete(categoryId)
        res.json({message:'Category removed and transactions updated'})
        
    } else {
        res.json({message: 'Category not found or user not authorized'})
    }
    })
}

module.exports = categoryrController;