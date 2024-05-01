const asyncHandler = require('express-async-handler');
const Transaction = require('../model/Transaction')

const transactionController = {
    create: asyncHandler(async (req, res) => {        
        const {type, category, amount, date, description} = req.body
        const {verifiedId} = req

        if(!amount || !type || !date){
            throw new Error('Type, amount and Date are required')
        }

        const transaction = await Transaction.create({
            user: verifiedId, type, category, amount, description
        })

        res.status(201).json(transaction)

        
    }),
    list: asyncHandler(async (req,res) => {
        const {verifiedId} = req
        const transactions = await Transaction.find({user: verifiedId})
        res.status(200).json(transactions)
    }),
    update: asyncHandler(async (req, res) =>{        
    }),
    delete: asyncHandler(async (req, res) => {
    })
}

module.exports = transactionController;