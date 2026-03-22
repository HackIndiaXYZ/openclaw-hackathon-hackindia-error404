const { encryptData, decryptData } = require('./edusync/packages/shared/utils/security.ts');

const secret = "INSTITUTIONAL_ID_9988";
try {
  const encrypted = encryptData(secret);
  console.log('Encrypted:', encrypted);
  const decrypted = decryptData(encrypted);
  console.log('Decrypted:', decrypted);
  if (secret === decrypted) {
    console.log('✅ AES-256-GCM Verification Success');
  } else {
    console.log('❌ Decryption Mismatch');
  }
} catch (err) {
  console.error('Security Test Failure:', err.message);
}
