import dayjs from 'dayjs';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');
import Subscription from '../models/Subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';

const Reminders = [7,5,2,1];



export const sendReminders = serve(async(context)=>{
    const {subscriptionId} = context.requestPayload;
    const subcription = await fetchSubscription(context,subscriptionId);

    if(!subcription || Subscription.status !== 'active') return;

    if(renewalDate.isBefore(dayjs())){
        console.log(`renewal date are passed for subscription ${subscriptionId}. stopping workflow.`);
        return;
    }

    for(const dayBefore  of Reminders){
        const reminderdate = renewalDate.subtract(dayBefore,'day');
        if(reminderdate.isAfter(dayjs)){
            await sleepUntillReminder(context, `${dayBefore} days before reminder`, reminderdate);
        }
        await triggerReminder(context,`Reminder ${dayBefore} days before.`);
    }
});

const fetchSubscription = async(context,subscriptionId)=>{
    return await context.run('get subscription',async ()=>{
        return await Subscription.findById(subscriptionId).populate('user','name email');
    })
};

const sleepUntillReminder = async (context , label, date )=>{
    console.log(`sleeping untill ${label} reminder at ${date}`);
    await context.sleepUntill(label,date.toDate());
}

const triggerReminder = async (context,label)=>{
    return await context.run(label,async ()=>{
        console.log(`Triggering ${label} Reminder.`);
        // send email , SMS, Push Notification

        await sendReminderEmail({
            to:Subscription.updateSearchIndex.email,
            type: label,
            subscription,
        })

    })
} 
