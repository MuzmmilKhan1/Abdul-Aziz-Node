// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const qrCode = require('qrcode');
const bcrypt = require('bcrypt');


const uri = "mongodb+srv://mail:JCUXYZ2yaf65aFwj@users.s8qduxn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// MongoDB function to insert data
async function insertUserData(name, email, number) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Insert data into the 'Users' collection
    const database = client.db('Users');
    const collection = database.collection('User_data'); // Replace with your collection name
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      // Email already exists, return an error or handle accordingly
      throw new Error('Email is already registered.');
    }
    const documentToInsert = { name, email, number, played: 0 };
    const result = await collection.insertOne(documentToInsert);
    return result.insertedId; // Return the generated _id
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


  
  router.post('/registration', async (req, res) => {
    const { name, email, number } = req.body;
    let subject = "Registration"
    
    if (!name.trim()) {
        return res.status(400).send('Name cannot be empty');
    }
    
    if (!email.trim()) {
        return res.status(400).send('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send('Invalid email format');
    }

    if(!number.trim()){
        return res.status(400).send('Phone cannot be empty');
    }
    
    if (number.trim().length < 11) {
      return res.status(400).send('Phone number should have at least 11 digits');
  }

  const Secret = "NoSecret"



    try {
    // Insert user data into MongoDB and get the generated _id
    const userId = await insertUserData(name, email, number);

    // Generate the QR code from the user ID
    const qrCodeImage = await generateQRCode(userId);

    // Attempt to send the email with QR code attachment
    await sendMail(email, subject, name, number, qrCodeImage);

    // If successful, send a success response
    res.json({
      message: 'Form data received and email sent successfully!',
      imageBase64: qrCodeImage,
    });
      } catch (error) {
        // If an error occurs during email sending, handle the specific error
        console.error(error)
    
        if (error.message === 'Email is already registered.') {
          // Send a response indicating that the email is already registered
          res.status(400).send('Email is already registered.');
        } else if (error.code === 'EENVELOPE' && error.responseCode === 550) {
          // Handle recipient rejection errors
          res.status(400).send('Recipient email is invalid or does not exist.');
        } else {
          // Handle other errors
          res.status(500).send('Internal Server Error');
        }
      }
  });


  function sendMail(to, subject, name, number,qrCodeImage ){
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
                from: 'mail@g4goal.com', // Sender's email address
                to: [to,'mail@g4goal.com'], // Receiver's email address
                subject: `${subject}`,
                text: `Player Registered: \n Name: ${name} \n Email: ${to} \n Phone: ${number}  `,
                attachments: [
                  {
                    filename: 'qrcode.png',
                    content: qrCodeImage,
                    encoding: 'base64',
                  },
                ]
              };
              
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            // Close the transporter when done
            transporter.close();
    
            if (error) {
              reject(error); // Reject the promise if there's an error
            } else {
              resolve(); // Resolve the promise if the email is sent successfully
            }
          });
        } catch (error) {
          reject(error); // Reject the promise if an exception occurs
        }
      });
    }


// Options for generating the QR code
const options = {
  color: {
    dark: '#000', // Color for dark modules
    light: '#fff', // Color for light modules
  },
};

// Function to generate QR code
function generateQRCode(data) {
  return new Promise((resolve, reject) => {
    qrCode.toDataURL(data.toString(), (err, url) => {
      if (err) {
        reject(err);
      } else {
        // Extract the base64-encoded image data
        const base64Data = url.split(',')[1];
        resolve(base64Data);
      }
    });
  });
}


module.exports = router;
