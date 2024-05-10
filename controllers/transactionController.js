const asyncHandler = require('express-async-handler');
const Transaction = require('../model/Transaction')

const transactionController = {
    create: asyncHandler(async (req, res) => {        
        const {type, category, amount, date, description} = req.body
        const {verifiedIdUser} = req

        if(!amount || !type || !date){
            throw new Error('Type, amount and Date are required')
        }

        const transaction = await Transaction.create({
            user: verifiedIdUser, type, category, amount, description, date: new Date(date)
        })

        res.status(201).json(transaction)

        
    }),
    filteredListTransactions: asyncHandler(async (req,res) => {
        const {startDate, endDate, type, category} = req.query
        const {verifiedIdUser} = req
        let filters = {
            user: verifiedIdUser
        }
        // const transactions = await Transaction.find(filters)

        if(startDate){
            filters.date = {...filters.date, $gte: new Date(startDate)}
        }
        if(endDate){
            filters.date = {...filters.date, $lte: new Date(endDate)}
        }
        if(type){
            filters.type = type
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
        const {verifiedIdUser} = req
        const transaction = await Transaction.findById(req.params.id)        

        if(transaction && transaction.user.toString() === verifiedIdUser.toString()){
            transaction.type = req.body.type || transaction.type;
            transaction.category = req.body.category || transaction.category;
            transaction.amount = req.body.amount || transaction.amount;
            transaction.date = req.body.date || transaction.date;
            transaction.description = req.body.description || transaction.description;

            const updatedTranscation = await transaction.save()
            res.json(updatedTranscation)
        }
    }),
    delete: asyncHandler(async (req, res) => {
        const {verifiedIdUser} = req
        const transaction = await Transaction.findById(req.params.id)

        if(transaction && transaction.user.toString() === verifiedIdUser.toString()){
            await Transaction.findByIdAndDelete(req.params.id)
            res.json({message:'Transaction removed'})
        }

    })
}

module.exports = transactionController;