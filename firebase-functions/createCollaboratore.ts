// @ts-nocheck
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Inizializza l'app Firebase Admin se non è già stata inizializzata
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Configurazione Nodemailer per l'invio delle email
// (Da configurare con le proprie credenziali SMTP tramite environment variables o Firebase config)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
});

/**
 * Genera una password sicura di lunghezza specificata.
 * Include almeno una lettera maiuscola, una minuscola, un numero e un simbolo.
 */
function generateSecurePassword(length = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Assicurati che ci sia almeno un carattere per tipo
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Riempi il resto della password
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mescola i caratteri della password per evitare pattern prevedibili
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

export const createCollaboratore = functions.region('europe-west1').https.onCall(async (data, context) => {
  // Verifica autenticazione
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Devi essere autenticato per eseguire questa operazione.'
    );
  }

  // Opzionale: verifica che chi chiama la funzione sia un amministratore
  // if (context.auth.token.role !== 'admin') {
  //   throw new functions.https.HttpsError('permission-denied', 'Solo gli amministratori possono creare collaboratori.');
  // }

  const { nome, cognome, email, filiale, gruppiCompetenza, ruolo } = data;

  // Validazione input
  if (!nome || !cognome || !email || !filiale || !gruppiCompetenza || !ruolo) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Tutti i campi (nome, cognome, email, filiale, gruppiCompetenza, ruolo) sono obbligatori.'
    );
  }

  if (!Array.isArray(gruppiCompetenza)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Il campo gruppiCompetenza deve essere un array.'
    );
  }

  try {
    // 1. Genera password temporanea sicura (12 caratteri)
    const passwordTemporanea = generateSecurePassword(12);

    // 2. Crea l'utente in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password: passwordTemporanea,
      displayName: `${nome} ${cognome}`,
    });

    const newUid = userRecord.uid;

    // 3. Imposta i customClaims
    await admin.auth().setCustomUserClaims(newUid, {
      role: 'collaboratore',
      mustChangePassword: true,
    });

    // 4. Salva i dati in Firestore nella collection "users"
    await db.collection('users').doc(newUid).set({
      uid: newUid,
      email,
      nome,
      cognome,
      filiale,
      gruppiCompetenza,
      role: 'collaboratore',
      ruoloSpecifico: ruolo, // Salviamo anche il ruolo specifico (es. CITY_MANAGER, OPERATOR)
      status: 'attivo',
      passwordTemporanea,
      mustChangePassword: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid,
    });

    // 5. Invia email di conferma (usando Nodemailer come fallback alla Firebase Extension)
    const mailOptions = {
      from: '"StanzaSemplice" <noreply@stanzasemplice.com>',
      to: email,
      subject: 'Benvenuto in StanzaSemplice',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Benvenuto in StanzaSemplice, ${nome}!</h2>
          <p>Il tuo account collaboratore è stato creato con successo.</p>
          <p>Di seguito le tue credenziali di accesso temporanee:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password Temporanea:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${passwordTemporanea}</code></p>
          </div>
          <p style="color: #dc2626; font-size: 14px;"><strong>Nota importante:</strong> Al tuo primo accesso ti verrà richiesto di cambiare obbligatoriamente la password.</p>
          <br>
          <p>Cordiali saluti,<br><strong>Il team di StanzaSemplice</strong></p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Errore durante l'invio dell'email di benvenuto:", emailError);
      // Non blocchiamo l'esecuzione se l'email fallisce, ma lo registriamo nei log
    }

    // 6. Ritorna il risultato
    return {
      success: true,
      uid: newUid,
      passwordTemporanea,
    };

  } catch (error: any) {
    console.error("Errore nella creazione del collaboratore:", error);
    
    // Gestione errori specifici di Firebase Auth
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'L\'indirizzo email fornito è già in uso da un altro account.'
      );
    }
    
    if (error.code === 'auth/invalid-email') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'L\'indirizzo email fornito non è valido.'
      );
    }
    
    if (error.code === 'auth/weak-password') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'La password generata non è sufficientemente sicura.'
      );
    }

    // Errore generico
    throw new functions.https.HttpsError(
      'internal',
      'Si è verificato un errore interno durante la creazione del collaboratore. Riprova più tardi.'
    );
  }
});
