const { exec } = require('child_process');

console.log('🚀 Starting EventEase Backend...');

// Generate Prisma client on startup
exec('npx prisma generate', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Prisma generate failed:', error);
  } else {
    console.log('✅ Prisma client generated successfully');
  }
  
  // Start the server
  require('./src/index.js');
});