const admin = require("firebase-admin");

var serviceAccount = require("../fashionappdatabase-firebase-adminsdk-3z6kz-c267adc6f6.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fashionappdatabase-default-rtdb.firebaseio.com",
    storageBucket: 'fashionappdatabase.appspot.com'
});

const db = admin.database();
const bucket = admin.storage().bucket();
const storage = admin.storage();


module.exports = {db, bucket, storage};