const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const config = require('./firebase-applet-config.json');
const app = initializeApp(config);
const auth = getAuth(app);
signInAnonymously(auth).then(() => console.log('success')).catch(e => console.error(e));
