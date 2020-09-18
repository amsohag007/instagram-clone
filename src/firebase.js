import firebase from "firebase";

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyAPgbMPFPZXSKIBIhTSfLtA3ifC_RxnWoU",
    authDomain: "instagram-clone-rf.firebaseapp.com",
    databaseURL: "https://instagram-clone-rf.firebaseio.com",
    projectId: "instagram-clone-rf",
    storageBucket: "instagram-clone-rf.appspot.com",
    messagingSenderId: "86722510652",
    appId: "1:86722510652:web:b73a850a3d062b27f0e839" 
})

    const db=firebaseApp.firestore();
    const auth=firebaseApp.auth();
    const storage=firebaseApp.storage();

export {db,auth, storage};