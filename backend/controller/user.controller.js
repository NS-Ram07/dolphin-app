const model = require('../models')
const userTable = model.User
const secret = '9876567887'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const { where } = require('sequelize')

const createUser = async function (req,res) {
    try {
        let data = req.body
let {password , email}= data
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
        data.password = hash

         await userTable.findAll({where:{email:email}})
        .then(async(userdata)=>{
            if (userdata.length > 0) {
                res.json({
                    message: "email already exists",
                    status:400
                })

               
            }
            else{
                   await userTable.create(data)
                   .then( async (currentData)=>{
                        const token = jwt.sign({id:currentData.id},secret,{expiresIn:"120hr"})

                        await userTable.update({token:token},{where:{id:currentData.id}})


                        res.json({
                            message: "User registered successfully",
                            status:200,
                            data: {
                                token: token,
                                id: currentData.id
                            }
                        })
                   })
                   .catch((err)=>{
                    res.json({
                        status:400,
                        message: "Failed to Register User",
                        error: err
                    })
                   })
            }
        })




    } catch (error) {
        res.json({
            status:400,
            message: "failed to Register User",
            error: error
        })
    }
}


const viewAll = async function (req,res) {
    try {
        const userAcc = await userTable.findAll()
        res.json({
            status:200,
            message: "All Users",
            data: userAcc
        })
    } catch (error) {
        res.json({
            status:400,
            message: "Failed to view Users",
            error: error
        })
    }
}
const login = async function(req,res){
try {

    const {email, password} = req.body
    await userTable.findOne({where:{email: email}})
    .then(async(loginCheck)=>{
if (!loginCheck) {
    res.json({
        message: "Email is not registered yet",
        status: 400
    })
} else {
    const isPassValid = bcrypt.compareSync(password,loginCheck.password)
    if (!isPassValid) {
        res.json({
            message: "Incorrect Password",
            status: 400
        })
    }
    else{
        const token = jwt.sign({id: loginCheck.token},secret,{expiresIn:"120hr"})
        await userTable.update({token: token},{where:{email:loginCheck.email}})
        res.json({
            message: "Login Successful",
            status: 200,
            data: {
                token: token,
                id: loginCheck.id
            }
        })
    }
}
    })
    .catch((err)=>{
        res.json({
            message: "Failed to Login User",
            error: err.message
        })
    })
} catch (error) {
    res.json({
        status:400,
        message: "Failed to Login User",
        error: error
    })
}
}

const forgetPass = async(req,res) =>{
try {
    const {password , email} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password,salt)
    await userTable.update({password: hash},{where:{email:email}})
    res.json({
        message: "Password updated successfully",
        status: 200
    })
} catch (error) {
    res.send({
        status:400,
        message: "Failed to update password",
        error: error
    })
}
}
module.exports= {
    createUser,
    viewAll,
    login,
    forgetPass
}
