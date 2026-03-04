import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "dummy-project-id",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "00000000000",
  appId: "1:00000000000:web:00000000000000"
};

// Validate config to prevent "projects/undefined" errors
// Since we are using dummy values, this check is technically redundant but kept for structure
if (!firebaseConfig.projectId || firebaseConfig.projectId === 'dummy-project-id') {
  console.warn(
    'Using dummy Firebase configuration. Real backend connections will fail.\n' +
    'The application is running in mock mode.'
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);