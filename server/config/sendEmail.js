import { Resend } from 'resend';
import dotenv from 'dotenv'
import logger from '../utils/logger.js'
dotenv.config()

if(!process.env.RESEND_API){
    logger.warn("RESEND_API not found in .env file")
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async({sendTo, subject, html })=>{
    try {
        // Use Resend's test email in development
        const fromEmail = process.env.NODE_ENV === 'production' 
            ? 'Blinkey It <noreply@blinkeyit.co.in>'
            : 'Blinkey It <onboarding@resend.dev>';

        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            logger.error('Email sending error:', error)
            return null
        }

        logger.info('Email sent successfully to:', sendTo)
        return data
    } catch (error) {
        logger.error('Email service error:', error)
        return null
    }
}

export default sendEmail

