import * as admin from 'firebase-admin';
import * as path from 'path';

export const FirebaseProvider = {
  provide: 'FIREBASE_APP',
  useFactory: () => {
    if (admin.apps.length === 0) {
      const serviceAccount = path.join(
        process.cwd(),
        'src/config/firebase-service-account.json',
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Firebase Admin SDK Initialized via Provider.');
    }
    return admin;
  },
};
