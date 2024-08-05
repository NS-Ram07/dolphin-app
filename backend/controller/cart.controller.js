const Model = require('../models')
const cartTable = Model.Cart
const productTable = Model.Products
const userTable = Model.User



const nodemailer = require("nodemailer");




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nsramv@gmail.com',
    pass: 'ypay uojk hkuf xqic',
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});


const createCart = async(req,res)=>{
    try {
        const data = req.body
        // const {userId,ProductId,Quantity,status,total} = data
        data.status = "InCart"
       await cartTable.create(data)
        res.json({
            message:"Product Added successfully",
            status:200,
            data:data
        })
    } catch (error) {
        res.json({
            message:"Error in creating cart",
            status:400,
            error:error
        })
    }
}

const viewCart = async(req,res)=>{
    try {
        const {userId} = req.params

        await cartTable.findAll({where:{userId:userId},
        include :[{
            model : productTable,
            as : 'Product'
        }]
    })
        .then((data)=>{

            if (data.length<1) {
                res.json({
                    message:"Your Cart is Empty",
                    status:200,
                    data:data
                })
            } else {
                res.json({
                    message:"Cart fetched successfully",
                    status:200,
                    data:data
                })
            }
         
        })

    } catch (error) {
        res.json({
            message:"Error in viewing cart",
            status:400,
            error:error
        })
    }
}




const checkOut = async function (req,res) {
    try {
        const {userId} = req.params
        // const {name , email , contact, productDetails} = req.body
        await cartTable.update({status: "Checkout"}, {where: {userId: userId}})
        await userTable.findOne({where:{id:userId}})
        .then(async(checkOutUser)=>{
                await transporter.sendMail({
                    from: 'Dolphin <nsramv@gmail.com>',
                    to: checkOutUser.email,
                    subject: 'Your Order Placed Successfully',
                    text: 'Your order has been successfully placed. Your order will be delivered soon. Our Team will contact you soon',
                    // text: data
                });
        
                res.json({
                    message: "Checkout successful",
                    status: 200,
                })
        })


    
    } catch (error) {
        res.json({
            message: "Error in checkout",
            error: error,
            status: 400,
        })
    }
}


const viewCheckout = async function (req,res) {
    try {
        const email = req.body.email
     var getUser =   await userTable.findOne({where:{email: email}})
        await cartTable.findAll({where:{status: "Checkout", userId:getUser.id},
        include :[{
            model : productTable,
            as : 'Product'
        }]})
        .then(async(chekoutList)=>{
var productlist = chekoutList.map(function (checkout) {
    return checkout.Product
})
            if (productlist.length<1) {
                res.json({
                    message:"No checkout found",
                    status:200,
                    data:chekoutList
                })
            } else {
                res.json({
                    message:"Checkout list fetched successfully",
                    status:200,
                    data:chekoutList
                })
            }
        })
    } catch (error) {
        res.json({
            message: "Error in viewing checkoutLIST",
            error: error,
            status: 400,
        })
    }
}

module.exports = {
    createCart,
    viewCart,
    checkOut,
    viewCheckout
}