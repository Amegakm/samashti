import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const env = fs.readFileSync('.env', 'utf-8');
const config = {};
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) config[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const firebaseConfig = {
  apiKey: config.VITE_FIREBASE_API_KEY,
  authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: config.VITE_FIREBASE_DATABASE_URL,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
  storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

createUserWithEmailAndPassword(auth, 'amegakm13@gmail.com', 'Admin@123')
  .then(() => {
    console.log('User created successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error creating user:', error);
    process.exit(1);
  });
