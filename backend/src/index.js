const { PORT } = require('./config');
const app = require('./app');

app.listen(PORT, () => {
  console.log(`🚀 EventEase API running on http://localhost:${PORT}`);
});
