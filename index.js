const express = require('express');
const app = express();
const port = 8000; // You can choose any available port
const contactRouter = require('./Routes/Contact')
const registrationRouter = require("./Routes/Register")
const checkingRouter = require("./Routes/Check")
const bodyParser = require('body-parser');
const cors = require('cors')
const mysql = require('mysql2')
/*
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

// Create an email message
const mailOptions = {
  from: '_mainaccount@g4goal.com', // Sender's email address
  to: 'muzmmil.khan16@gmail.com', // Receiver's email address
  subject: 'Hello, this is a test email',
  text: 'Hello, this is the email content!',
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});

// Close the transporter when done
transporter.close();

*/

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', checkingRouter)
app.use('/', contactRouter)
app.use('/', registrationRouter)


// Define a basic route
app.get('/test', (req, res) => {
  res.send('Server is Running');
});

// Start the server
app.listen(port, '192.168.10.9' ,() => {
  console.log(`Server is running on http://localhost:${port}`);
});
