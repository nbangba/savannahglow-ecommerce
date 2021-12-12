const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require('cors')({
  origin: true,
});
const { default: axios } = require("axios");

admin.initializeApp();
const fs = admin.firestore()
fs.settings({ ignoreUndefinedProperties: true })

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
      data, 
    );
   
   
    
    if(info && response){
      

      if(response.status == 'success')
        try {
          
                  info.items.map((item)=>{

                  fs.runTransaction(async (transaction)=>{
                    console.log(item)
                    const itemRef  = fs.collection('product').doc(item.id);
                    const itemDoc = await transaction.get(itemRef)
                    if (!itemDoc.exists) {
                      throw "Document does not exist!";
                    }
                    const newAvailable = itemDoc.data().available - item.quantity

                    transaction.update(itemRef,{available:newAvailable})
                  } )
              
              })

        await fs.runTransaction(async (transaction) => {
          const docRef = fs.collection("ordersMetadata").doc("ordersMetadata");
          const ordersMetaDataDoc  = await transaction.get(docRef);

          if (!ordersMetaDataDoc.exists) {
            throw "Document does not exist!";
          }

          const newNumberOfOrders = ordersMetaDataDoc.data().numberOfOrders + 1;

          let newNumberOfInvoices
          if(info.payment === 'POD'){
            newNumberOfInvoices = ordersMetaDataDoc.data().numberOfInvoices + 1;
            transaction.update(docRef, { numberOfOrders: newNumberOfOrders });
            transaction.update(docRef, { numberOfInvoices: newNumberOfInvoices })
            return {orderID:newNumberOfOrders,invoiceID:newNumberOfInvoices}
          }
          
          let newNumberOfReceipts
          if(info.payment === 'paystack'){
            newNumberOfReceipts = ordersMetaDataDoc.data().numberOfReceipts + 1;
            transaction.update(docRef, { numberOfOrders: newNumberOfOrders });
            transaction.update(docRef, { numberOfReceipts: newNumberOfReceipts });

            return{orderID:newNumberOfOrders,receiptID:newNumberOfReceipts}
          }
          
        })
        .then((result)=>
           admin.firestore().collection("orders").doc(response.reference).set({
            order:{...info},
            response:{...response},
            orderCreated: admin.firestore.Timestamp.now(),
            orderStatus:'received',
            ...result,
            user:context.auth.uid,
          })
          .then(()=>admin.firestore().collection("carts").doc(context.auth.uid).set({
          items:[],
          numberOfItems:0,
          },{merge:true})
          ).then(()=>{
            const secret = functions.config().paystack.key;
            const options = {
              baseURL: 'https://api.paystack.co',
              url: `/transaction/verify/${response.reference}`,
              method: 'get',
              headers: {
                Authorization: `Bearer ${secret}`,
              }
            }

            axios.request(options)
            .then((response)=>{

              console.log('RESPONSE',response.data)
              if(response.data.data.authorization.reusable)
              admin.firestore().collection("cards").add({ 
                authorization:response.data.data.authorization,
                dateAdded:admin.firestore.Timestamp.now(),
                reference: response.data.data.reference ,
                owner:context.auth.uid,
            })
            .then(()=> console.log('New card added'))
            .catch((e)=>console.log(e))
          })
            .catch(e=>console.log(e))
          }
          )
        );
        console.log("Transaction successfully committed!");
      } 
      catch (e) {
        console.log("Transaction failed: ", e);
      }
        
    }
 
    return {
     status:'complete'
    };
  });

 exports.chargeCard = functions
 .runWith({
  timeoutSeconds: 540,
  memory: '2GB',
})
.https.onCall(async (data, context) => {
  const {docId,info} = data
  const docRef = fs.collection("cards").doc(docId);
 const result = await docRef.get().then(async(doc)=>{
    if (doc.exists) {
      console.log("Document data:", doc.data());
      const secret = functions.config().paystack.key;
      const cardData = doc.data()
      const options = {
        url: 'https://api.paystack.co/transaction/charge_authorization',
        method: 'post',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json'
        },
        data:{
          "authorization_code" : cardData.authorization.authorization_code,
          "email" : info.orderAddress.email,
          "amount" : info.amount*100
        }
      }

       return await  axios(options)
               .then(async(response)=>{
                 console.log('RESPONSE',response.data);
                 const data = response.data.data
                 if(data.status == 'success'){

                  

                 try {
                  
          
                    info.items.map((item)=>{
                      
                          fs.runTransaction(async (transaction)=>{
                          const itemRef  = fs.collection('product').doc(item.id);
                          const itemDoc = await transaction.get(itemRef)
                          if (!itemDoc.exists) {
                            throw "Document does not exist!";
                          }
                          const newAvailable = itemDoc.data().available - item.quantity
          
                          transaction.update(itemRef,{available:newAvailable})
                        } )
                    
                    })
              

                return  await fs.runTransaction(async (transaction) => {
                    
                    const docRef = fs.collection("ordersMetadata").doc("ordersMetadata");
                    const ordersMetaDataDoc  = await transaction.get(docRef);
          
                    if (!ordersMetaDataDoc.exists) {
                      throw "Document does not exist!";
                    }
          
                    const newNumberOfOrders = ordersMetaDataDoc.data().numberOfOrders + 1;
          
                    let newNumberOfInvoices
                    if(info.payment === 'POD'){
                      newNumberOfInvoices = ordersMetaDataDoc.data().numberOfInvoices + 1;
                      transaction.update(docRef, { numberOfOrders: newNumberOfOrders });
                      transaction.update(docRef, { numberOfInvoices: newNumberOfInvoices })
                      return {orderID:newNumberOfOrders,invoiceID:newNumberOfInvoices}
                    }
                    
                    let newNumberOfReceipts
                    if(info.payment === 'paystack'||info.paystackOptions=='defaultCard'){
                      newNumberOfReceipts = ordersMetaDataDoc.data().numberOfReceipts + 1;
                      transaction.update(docRef, { numberOfOrders: newNumberOfOrders });
                      transaction.update(docRef, { numberOfReceipts: newNumberOfReceipts });
          
                      return{orderID:newNumberOfOrders,receiptID:newNumberOfReceipts}
                    }
                    
                  
                  })
                  .then((result)=>
                     admin.firestore().collection("orders").doc(data.reference).set({
                      order:{...info},
                      response:{reference:data.reference, status:data.status,transaction:data.id},
                      orderCreated: admin.firestore.Timestamp.now(),
                      orderStatus:'received',
                      ...result,
                      user:context.auth.uid,
                    })
                    .then(()=>admin.firestore().collection("carts").doc(context.auth.uid).set({
                    items:[],
                    numberOfItems:0,
                    },{merge:true})
                    )
                    
                  )
                  .then(()=> data.status) 
                  .catch(e=>{console.log(e);return e.message});
                } 
                catch (e) {
                  console.log("Transaction failed: ", e);
                  return e.message
                }
              }

                else return data.status

               } )
               .catch(error=>{if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Response",error.response.data);
                console.log("Response",error.response.status);
                console.log("Response",error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config)
              return 'unsuccessful';})
              
              
  } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return  'unsuccessful'
     
  }
  }).catch((error) => {
    console.log("Error getting document:", error);
    return error.message()
});  

return {status:result}
}) 

exports.payOnDelivery = functions
.runWith({
  timeoutSeconds: 540,
  memory: '2GB',
})
.https.onCall(async (data, context) => {
  const {info} = data;
  
      

  try {

          info.items.map((item)=>{

                fs.runTransaction(async (transaction)=>{
                const itemRef  = fs.collection('product').doc(item.id);
                const itemDoc = await transaction.get(itemRef)
                if (!itemDoc.exists) {
                  throw "Document does not exist!";
                }
                const newAvailable = itemDoc.data().available - item.quantity

                transaction.update(itemRef,{available:newAvailable})
              } )
            
          })

    await fs.runTransaction(async (transaction) => {
      const docRef = fs.collection("ordersMetadata").doc("ordersMetadata");
      const ordersMetaDataDoc  = await transaction.get(docRef);

      if (!ordersMetaDataDoc.exists) {
        throw "Document does not exist!";
      }

      const newNumberOfOrders = ordersMetaDataDoc.data().numberOfOrders + 1;

      let newNumberOfInvoices
      if(info.payment === 'POD'){
        newNumberOfInvoices = ordersMetaDataDoc.data().numberOfInvoices + 1;
        transaction.update(docRef, { numberOfOrders: newNumberOfOrders });
        transaction.update(docRef, { numberOfInvoices: newNumberOfInvoices })
        return {orderID:newNumberOfOrders,invoiceID:newNumberOfInvoices}
      }
      
      let newNumberOfReceipts
      if(info.payment === 'paystack'){
        newNumberOfReceipts = ordersMetaDataDoc.data().numberOfReceipts + 1;
        transaction.update(docRef, { numberOfOrders: newNumberOfOrders });
        transaction.update(docRef, { numberOfReceipts: newNumberOfReceipts });

        return{orderID:newNumberOfOrders,receiptID:newNumberOfReceipts}
      }
      
    
    })
    .then((result)=>
       admin.firestore().collection("orders").add({
        order:{...info},
        orderCreated: admin.firestore.Timestamp.now(),
        orderStatus:'received',
        ...result,
        user:context.auth.uid,
      })
      .then(()=>admin.firestore().collection("carts").doc(context.auth.uid).set({
        items:[],
        numberOfItems:0,
      },{merge:true})
      ) 
    );
    console.log("Transaction successfully committed!");
  } 
  catch (e) {
    console.log("Transaction failed: ", e);
  }

  return {
    status:'complete'
   };
})


exports.createRefund = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {

    const {transactionID,amount} = data
    const secret = functions.config().paystack.key;
    const options = {
      url: 'https://api.paystack.co/refund',
      method: 'post',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json'
      },
      data:{
        transaction:transactionID,
        amount:amount
      }
    }

    const result = await axios(options)
               .then(async (response)=>{console.log('RESPONSE',response.data);
                 const data = response.data
                 if(data.status){
                   console.log('Status',data.status)
                return await admin.firestore().collection("orders").doc(transactionID).set({
                    orderStatus:'cancelled',
                  },{merge:true})
                  .then(()=>{
                    const orderRef = fs.collection("orders").doc(transactionID);
                    orderRef.get().then((doc)=>{
                      const result = doc.data()
                        result.order.items.map((item)=>{
                          try{
                              fs.runTransaction(async (transaction)=>{
                              const itemRef  = fs.collection('product').doc(item.id);
                              const itemDoc = await transaction.get(itemRef)
                              if (!itemDoc.exists) {
                                throw "Document does not exist!";
                              }
                              const newAvailable = itemDoc.data().available + item.quantity

                              transaction.update(itemRef,{available:newAvailable})
                            } )
                          }
                          catch(e){
                            console.log(e)
                          }
                        })
                    })
                    console.log('doc updated');return data.status})
                  .catch((e)=>{console.log(e.message);return e.message})
                 }
               } )
               .catch(error=>{if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log("Response",error.response.data);
                console.log("Response",error.response.status);
                console.log("Response",error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config);
              return 'Refund Failed';
            })     

            return {status:result}
  })

  exports.listUsers = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {
      admin.auth().listUsers(50,nextPageToken)
      .then((listUsersResult) => {
        return listUsersResult
      })
      .catch((error) => {
        console.log('Error listing users:', error);
      });
  })

  exports.createUserInFirestore = functions.auth.user().onCreate((user) => {
    
   return admin.auth().getUser(user.uid)
          .then((user)=>{
            console.log('user',user.displayName)
          return admin.firestore().collection("users").doc(user.uid).set({
                  email:user.email,
                  displayName:user.displayName,
                  phoneNumber:user.phoneNumber,
                  photoURL:user.photoURL,
                  uid:user.uid,   
                  deleted:false,
                  disabled:false,
          })
          .then(result=>  result)
          .catch(e=>console.log(e))
          })
          .catch(e=>console.log(e))
  })

  exports.deleteUsers = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {

    const{selectedRows} = data
    console.log(selectedRows)
   const deleteUsersFn = selectedRows.map(element => {
     return admin.auth().deleteUser(element.uid)
      .then(()=> 
        admin.firestore().collection("users").doc(element.uid).set({
        deleted:true,
       },{merge:true})
       .then(()=>{console.log(`user ${element.displayName} deleted`)})
       .catch((error)=>console.log(error))
       )
     .catch((error)=>console.log(error))
    });
    
    const result = await Promise.all(deleteUsersFn)
    return {
      result,
    };

  })

  exports.assignRole = functions.runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall(async (data, context) => {

    const {role,selectedRows} = data
    const assignRoleFn = await selectedRows.map(element => {
          return  admin.auth()
              .setCustomUserClaims(element.uid, role)
              .then(() => {
                // The new custom claims will propagate to the user's ID token the
                // next time a new one is issued.
                admin.firestore().collection("users").doc(element.uid).set({
                  ...role
                 },{merge:true})
                 .then((result)=>console.log(result))
                 .catch((e)=>console.log(e))
                console.log(`User now has these ${roles}` )
                return role
              })
              .catch((e)=>console.log(e))
          })

          const result = await Promise.all(assignRoleFn)
    return {
      result,
    };

  })