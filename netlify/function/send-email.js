// This file uses 'npm install nodemailer' which will be installed automatically by Netlify
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // These credentials should be stored in Netlify's Environment Variables for security
    const YOUR_EMAIL = process.env.EMAIL_USER;
    const YOUR_APP_PASSWORD = process.env.EMAIL_PASS;

    if (!YOUR_EMAIL || !YOUR_APP_PASSWORD) {
        return {
            statusCode: 500,
            body: 'Email credentials are not configured.',
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        const { name, email, message } = data;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: YOUR_EMAIL,
                pass: YOUR_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${email}>`, // Use sender's name and email
            to: YOUR_EMAIL, // Your receiving email address
            subject: `New Inquiry from ${name} on South Waves Website`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Reply-to Email:</strong> ${email}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email.' }),
        };
    }
};