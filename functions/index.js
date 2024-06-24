/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Function to handle user creation
exports.syncUserCreation = functions.auth.user().onCreate((user) => {
  const userRef = admin.firestore().collection("users").doc(user.uid);

  return userRef.set({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    // Add any additional fields you want here
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Function to handle user deletion
exports.syncUserDeletion = functions.auth.user().onDelete((user) => {
  const userRef = admin.firestore().collection("users").doc(user.uid);

  return userRef.delete();
});
