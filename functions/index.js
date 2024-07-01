const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  //if (!context.auth.token.admin) {
    //throw new functions.https.HttpsError('permission-denied', 'Only admins can set roles');
  //}

  const { uid, role } = data;
  const customClaims = { role };

  await admin.auth().setCustomUserClaims(uid, customClaims);
  
  return {
    message: `Success! ${role} claims added to user ${uid}`
  };
});
