const { PORT } = require('./config');
const app = require('./app');

const findAvailablePort = (startPort, maxAttempts = 10) => {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    const tryPort = () => {
      if (attempts >= maxAttempts) {
        reject(new Error(`Could not find available port after ${maxAttempts} attempts`));
        return;
      }

      const server = app.listen(currentPort, () => {
        console.log(`🚀 EventEase API running on http://localhost:${currentPort}`);
        resolve(server);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${currentPort} is busy, trying ${currentPort + 1}`);
          currentPort++;
          attempts++;
          tryPort();
        } else {
          reject(err);
        }
      });
    };

    tryPort();
  });
};

findAvailablePort(PORT).catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
