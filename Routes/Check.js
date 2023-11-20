
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');


const mongoURI = "mongodb+srv://mail:JCUXYZ2yaf65aFwj@users.s8qduxn.mongodb.net/?retryWrites=true&w=majority";


router.post('/check', async (req, res) => {
    try {
      const { _id } = req.body;
      const foundDocument = await findDocumentById(_id);
  
      if (foundDocument) {
        console.log(foundDocument)
        res.json({ success: true, message: `Document found.
        id: ${foundDocument._id.toString()}
        name: ${foundDocument.name.toString()}
        email: ${foundDocument.email.toString()} 
        Phone: ${foundDocument.number.toString()} 
        Played ${foundDocument.played.toString()}` });
      } else {
        res.json({ success: false, message: 'Document not found.' });
      }
    } catch (error) {
      console.error('Error checking document:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  
  router.post('/update', async (req, res) => {
    try {
      const { _id } = req.body;
      const updatedDocument = await updatePlayedField(_id);
  
      if (updatedDocument) {
        res.json({ success: true, message: 'User Marked As Played' });
      } else {
        res.json({ success: false, message: 'Failed to update played field.' });
      }
    } catch (error) {
      console.error('Error updating played field:', error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  });
  
  async function findDocumentById(_id) {
    const client = new MongoClient(mongoURI);
    await client.connect();
  
    const database = client.db('Users');
    const collection = database.collection('User_data');
  
    const foundDocument = await collection.findOne({ _id: new ObjectId(_id) });
  
    await client.close();
  
    return foundDocument;
  }
  
  async function updatePlayedField(_id) {
    const client = new MongoClient(mongoURI);
    await client.connect();
  
    const database = client.db('Users');
    const collection = database.collection('User_data');
  
    const updatedDocument = await collection.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $inc: { played: 1 } },
      { returnDocument: 'after' }
    );
  
    await client.close();
  
    return updatedDocument;
  }
  
  module.exports = router;