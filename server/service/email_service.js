const nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
        user: 'mail.ciscoraj@gmail.com',
        pass: 'HACKciscoraj22' // naturally, replace both with your real credentials or an application-specific password
    }
});


module.exports = {

    emailController: (req, res) => {      
        
        console.log('to address', req.body.toEmail);
        var mailOptions = {
            from: 'OneTECH Team <no-reply@onetechcreation.com.au>',
            // replyTo: 'no-reply@onetechcreation.com.au',
            to: req.body.toEmail,
            subject: 'Nodemailer test',
            text: 'Hey there, it’s our first message sent with Nodemailer ',
            html: req.body.html,
            // attachments: [
            //   {
            //     filename: 'mailtrap.png',
            //     path: __dirname + '/mailtrap.png',
            //     cid: 'uniq-mailtrap.png' 
            //   }
            // ]
        };
    
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(200).json({
                    success: 0,
                    data: error
                })
            }
            console.log('Message sent: %s', info.messageId);

            return res.status(200).json({
                success: 1,
                data: info.messageId
            })
        });
    },

    sendVerificationEmail: (req, res) => {

        console.log('to address', req.body.toEmail);
        var mailOptions = {
            from: 'OneTECH Team <no-reply@onetechcreation.com.au>',
            to: req.body.toEmail,
            subject: 'Please verify your email address',
            text: 'Hey there, it’s our first message sent with Nodemailer ',
            html: req.body.html            
        };
    
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(200).json({
                    success: 0,
                    data: error
                })
            }
            console.log('Message sent: %s', info.messageId);

            return res.status(200).json({
                success: 1,
                data: info.messageId
            })
        });
    }

    
}