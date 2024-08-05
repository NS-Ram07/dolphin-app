const { where } = require('sequelize')
const model = require('../models')
const productTable = model.Products



const create = async function (req,res) {
    try {
        const data =  req.body
        await productTable.create(data)
        res.json({
            message: 'Product created successfully',
            status: 200,
            data : data
        })
    } catch (error) {
        res.json({
            status: 401,
            message: 'Error creating product',
            error: error
        })
    }
}

const view = async function (req,res) {
    try {
      const products =  await productTable.findAll()
      res.json({
        status: 200,
        data: products
      })
    } catch (error) {
        res.json({
            status: 401,
            message: 'Error getting product',
            error: error
        })
    }
}
const viewById = async function (req,res) {
    try {
        const id = req.params.id
      const products =  await productTable.findOne({where:{id:id}})
      res.json({
        status: 200,
        data: products
      })
    } catch (error) {
        res.json({
            status: 401,
            message: 'Error getting product',
            error: error
        })
    }
}



module.exports = {
    create,view,viewById
  
}