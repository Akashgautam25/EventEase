const { PORT } = require('./config');
const app = require('./app');

const server = app.listen(PORT, () => {
  console.log(`🚀 EventEase API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
    server.listen(PORT + 1);
  }
});
