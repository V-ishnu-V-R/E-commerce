// process= require("process")


// // Download the helper library from https://www.twilio.com/docs/node/install
// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceid =process.env.TWILIO_SERVICE_SID
// const client=require("twilio")(accountSid,authToken)


// exports.doSms=function(userData){
        
//     return new Promise(async(resolve,reject)=>{
//         let res={}
     
//         await client.verify.services(serviceid).verifications.create({
           
//             to :`+91${userData.number}`,
//             channel:"sms"
//         }).then((reeee)=>{
//             res.valid=true;
//            resolve(res)
//             console.log(reeee);
//         }).catch((err)=>{
            
//             console.log(err);

//         })
//     })
// }
// exports. otpVerify=(otpData,userData)=>{
//  return new Promise(async(resolve,reject)=>{
//       await client.verify.services(serviceid).verificationChecks.create({
//           to: `+91${userData.number}`,
//           code: otpData
//       }).then((verifications) => {
//           console.log(verifications);
//           resolve(verifications.valid)
//       });
//   })
// }