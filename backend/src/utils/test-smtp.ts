// Diagnostic script to test SMTP connectivity on Render.com
// Run this temporarily to see which ports work

import nodemailer from 'nodemailer';

const testSMTPConnection = async (port: number, secure: boolean) => {
  console.log(`\nTesting SMTP on port ${port} (secure: ${secure})...`);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: port,
    secure: secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000,
  } as any);

  try {
    await transporter.verify();
    console.log(`✅ Port ${port} works!`);
    return true;
  } catch (error: any) {
    console.log(`❌ Port ${port} failed: ${error.message}`);
    return false;
  }
};

export const runSMTPDiagnostics = async () => {
  console.log('=== SMTP Diagnostics ===');
  console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com');
  console.log('SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Not set');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '✗ Not set');
  
  await testSMTPConnection(587, false);  // Standard SMTP
  await testSMTPConnection(465, true);   // SMTP with SSL
  await testSMTPConnection(2525, false); // Alternative port (some services)
  
  console.log('\n=== Diagnostics Complete ===\n');
};
