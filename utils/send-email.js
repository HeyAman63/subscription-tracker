import dayjs from "dayjs";
import { emailTemplates } from "./email-template.js";
import transporter,{ accountEmail } from "../config/nodemail.js";

export const sendReminderEmail = async ({to, type, subscription})=>{
    if(!to || !type){
        throw new Error("Required parameter missing");
    }
    const template = emailTemplates.find((t)=>t.label == type);
    if(!template) throw new Error("Invalid Email type");

    const mailInfo = {
        userName : subscription.user.name,
        subscriptionName : subscription.name,
        renewalDate : dayjs(subscription.renewalDate).format('MMM-D-YYYY'),
        planeName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod : subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);
    const mailOption = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    }
    transporter.sendMail(mailOption,(err, info)=>{
        if(err) return console.log("Error Sending Email");

        console.log("Email Sent : " + info.response);
    })
}