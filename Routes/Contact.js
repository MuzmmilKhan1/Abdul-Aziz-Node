// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Define home routes
router.post('/contact', async (req, res) => {
      // Destructure the data sent from the contact form
  const { name, email, subject, message, number } = req.body;

  // Validation checks
  if (!name.trim()) {
    return res.status(400).send('Name cannot be empty');
  }

  if (!email.trim()) {
    return res.status(400).send('Email cannot be empty');
  }

  // You can add more complex email validation if needed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send('Invalid email format');
  }

  if (!number.trim()) {
    return res.status(400).send('Phone Number cannot be empty');
  }

  if (!subject.trim()) {
    return res.status(400).send('Subject cannot be empty');
  }

  if (!message.trim()) {
    return res.status(400).send('Message cannot be empty');
  }

  
    // Check if the phone number has less than 11 digits
    if (number.trim().length < 11) {
      return res.status(400).send('Phone number should have at least 11 digits');
  }


    try {
    // Attempt to send the email
    await sendMail(email, subject, message, name, number);
    
    // If successful, send a success response
    res.send('Thanks For Contacting Us!');
  } catch (error) {
    // If an error occurs during email sending, handle the specific error
    console.error(error);

    if (error.code === 'EENVELOPE' && error.responseCode === 550) {
      // Handle recipient rejection errors
      res.status(400).send('Recipient email is invalid or does not exist.');
    } else {
      // Handle other errors
      res.status(500).send('Internal Server Error');
    }
  }
});



function sendMail(to, subject, message, name, number ){
return new Promise((resolve, reject) => {
    try {
      
        // Create a transporter using your SMTP server details
        const transporter = nodemailer.createTransport({
            host: 'mail.g4goal.com',
            port: 465, // Your SMTP server's port (this is a common port, but it may vary)
            secure: true, // Set to true if your SMTP server requires a secure connection
            auth: {
              user: '_mainaccount@g4goal.com',
              pass: 'rL#6*M1cE85zkC',
            },
          });
          
          if (!transporter.options.auth.user || !transporter.options.auth.pass) {
            throw new Error('SMTP authentication details are missing.');
          }

          // Create an email message
          const mailOptions = {
            from: `${to}`, // Sender's email address
            to: 'mail@g4goal.com', // Receiver's email address
            subject: `${subject}`,
            text: `Name: ${name} \n Phone: ${number} \n  ${message}`,
          };
          
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        // Close the transporter when done
        transporter.close();

        if (error) {
          console.error(error);
          reject(error); // Reject the promise if there's an error
        } else {
          console.log('Email sent: ' + info.response);
          resolve(); // Resolve the promise if the email is sent successfully
        }
      });
    } catch (error) {
      reject(error); // Reject the promise if an exception occurs
    }
  });
}

module.exports = router;
