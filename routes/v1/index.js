const express = require('express');
const router = express.Router();
const fs = require('firebase-admin');

const { sendResponse, sendError } = require('../../helpers/utils');
const { userTypeSchema } = require('../../schemas/userType.schema');

const db = fs.firestore();

//Get all the userTypes
router.get('/userTypes', async (req, res) => {
  try {
    const userRef = await db.collection('userTypes')
          .select("ID", "UserType", "Status")
          .get()
          .then((value) => {
          const data = value.docs.map((doc) => doc.data());
          return data;
        });

      if (userRef.length == 0) {
        return sendError(res, 'No User types found');
      }
      else {
        return sendResponse(res, userRef);
      }
  }catch(error) {
      res.send(error);
  }
});

//Create New userTypes
router.post('/userTypes', async (req, res) => {
    try {
        const { error } = userTypeSchema.validate(req.body);
        if (error) {
          return sendError(res, error.message);
        }

        const userRef = await db.collection('userTypes')
          .where("UserType", "==", req.body.UserType)
          .get()
          .then((value) => {
          const data = value.docs.map((doc) => doc.data());
          return data;
        });

        if (userRef.length == 1) {
          return sendError(
          res,
          `${req.body.UserType} type already exists`
          );
        }
        else {
        
            let userRef = db.collection('userTypes').doc();
            userRef.set({ 
              ID: userRef.id, 
              UserType: req.body.UserType,
              Status: 'Active'
          })
          
          return sendResponse(res, { "message": "User type created successfully"});
        }
    } catch(error) {
      res.send(error);
    }
});

//Update role
router.patch('/userTypes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const userRef = await db.collection("userTypes").doc(id)
    .update(req.body);

    return sendResponse(res, "user types updated sucessfully");
  } catch (error) {
    sendError(res, error.message);
  }
});


//delete role
router.delete('/userTypes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
 
    const userRef = await db.collection("userTypes").doc(id)
    .delete();

    return sendResponse(res, "user types deleted sucessfully");
  } catch (error) {
    sendError(res, error.message);
  }
});

module.exports = router;