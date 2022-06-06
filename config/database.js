
var admin = require("firebase-admin");

var serviceAccount = require("./coinless-db8bf-firebase-adminsdk-adfl3-ebb4eaadb1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://coinless-db8bf-default-rtdb.asia-southeast1.firebasedatabase.app"
});


const db = admin.firestore();

let userRef = db.collection('users');

userRef.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
        console.log(doc.data());
    })
})