var dotenv = require('dotenv');
dotenv.config();
process= require("process")


// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceid =process.env.TWILIO_SERVICE_SID
const client=require("twilio")(accountSid,authToken,serviceid)


exports.sendOtp = async (userData) => {
    
    const data = await client.verify.v2.services(serviceid).verifications.create({
        to: `+91${userData.number}`,
        channel: 'sms'
    })
}

exports.verifyOtp = async (otpData, userData) => {
    return new Promise(async(resolve,reject)=>{
        await client.verify.services(serviceid).verificationChecks.create({
            to: `+91${userData.number}`,
            code: otpData
        }).then((verifications) => {
           //console.log(verifications);
            resolve(verifications.valid)
        });
    })
}















