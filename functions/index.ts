import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteCollaboratore = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated and is an admin
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Solo gli amministratori possono eliminare i collaboratori.'
    );
  }

  const { uid } = data;

  if (!uid) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'UID del collaboratore mancante.'
    );
  }

  try {
    // 1. Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // 2. Delete user document from Firestore (optional if handled by client, but safer here)
    // await admin.firestore().collection('users').doc(uid).delete();

    return { success: true, message: 'Collaboratore eliminato con successo.' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Errore durante l\'eliminazione del collaboratore.'
    );
  }
});
