const { text } = require("express");
const Model = require("../models");
const otpTable = Model.OTP;
const userTable = Model.User;

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


const createOtp = async (req, res) => {
  try {
    const {email} = req.body;


   

    await userTable.findOne({ where: { email: email } }).then(async (user) => {
      if (!user) {
        res.json({
          message: "Email is not registered yet",
          status: 400,
        });
      } else {
    let otp = Math.floor(1000 + Math.random() * 9000);

        await otpTable
          .findOne({ where: { email: email } })
          .then(async (otpUserCheck) => {
            if (otpUserCheck) {

             
                    await otpTable.update(
                      { otp: otp },
                      { where: { email: otpUserCheck.email } }
                    );
             send(otpUserCheck.email,otp)

            } else {

              await otpTable.create({email,otp})
             send(otpUserCheck.email,otp)
            }

            async function send(email,otp) {
              try {
                let info = await transporter.sendMail({
                  from: "Dolphin <nsramv@gmail.com>",
            to: email,
            subject:"Your Otp For Dolphin Verification",
            html: `<h1>${otp}</h1>`
              });
            
              res.json({
                message: "OTP sent successfully",
                status: 200,
              })
              }
              catch (error) {
                res.json({
                  message: "Failed to send OTP",
                  error: error,
                  status: 400,
                });
              }}

          });
      }
    });
  } catch (error) {
    res.json({
      message: "error creating in otp",
      error: error,
      status: 400,
    });
  }
};





const authenticateOtp = async function (req, res) {
  try {
    const { email, otp } = req.body;
    await otpTable
      .findOne({ where: { email: email } })
      .then(async (otpMAil) => {
        if (otpMAil) {
          if (otpMAil.otp === otp) {
            res.json({
              message: "OTP matched successfully",
              status: 200,
            });
          } else {
            res.json({
              message: "Incorrect OTP",
              status: 400
            });
          }
        } else {
          res.json({
            message: "Email is not registered yet",
            status: 400,
          });
        }
      });
  } catch (error) {
    res.json({
      message: "error in otp authentication",
      error: error,
      status: 400,
    });
  }
};

module.exports = {
  createOtp,
  authenticateOtp,
};
