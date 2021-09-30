const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();



exports.payStackWebhooks = functions.https.onRequest(async (req, res) => {
  let event;
  var crypto = require('crypto');
  console.log('secret',functions.config())
  try {
    const secret = functions.config().paystack.key;
    
    var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        // Retrieve the request's body
        event = req.body;
        // Do something with event  
        }
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.");
    return res.sendStatus(400);
  };
  const dataObject = event.data;
/*if(event.event){
    await admin.firestore().collection("orders").doc().set({
        checkoutSessionId: dataObject.id,
        paymentStatus: dataObject.status,
        amountTotal: dataObject.amount,
      });
};*/
  

  return res.sendStatus(200);
});

exports.payStackTransctionVerification = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {
    // Only allow admin users to execute this function.
    if (!(context.auth )) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Must be an administrative user to initiate delete.'
      );
    }

    const {info,response} = data;
    console.log(
      data
    );
     
    if(info && response){
        await admin.firestore().collection("orders").doc().set({
            ...info,
            ...response,
            orderCreated: admin.database.ServerValue.TIMESTAMP,
          });
    }
    return {
      status:'completed' ,
    };
  });

