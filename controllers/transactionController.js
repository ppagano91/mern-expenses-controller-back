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
            user: verifiedId, type, category, amount, description, date: new Date(date)
        })

        res.status(201).json(transaction)

        
    }),
    filteredListTransactions: asyncHandler(async (req,res) => {
        const {startDate, endDate, type, category} = req.query
        const {verifiedId} = req
        let filters = {
            user: verifiedId
        }
        // const transactions = await Transaction.find(filters)

        if(startDate){
            filters.date = {...filters.date, $gte: new Date(startDate)}
        }
        if(endDate){
            filters.date = {...filters.date, $lte: new Date(endDate)}
        }
        if(type){
            filters.date = type
        }
        if(category){
            if(category === 'all'){

            }
            else if(category === 'Uncategorized'){
                filters.category = 'Uncategorized'
            }else{
                filters.category = category
            }
        }
        const transactions = await Transaction.find(filters).sort({data:-1})

        res.status(200).json(transactions)
    }),
    update: asyncHandler(async (req, res) =>{        
    }),
    delete: asyncHandler(async (req, res) => {
    })
}

module.exports = transactionController;