// backend/server.js
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./src/routes/tasks.routes');
const { getInsights } = require('./src/services/insight.service');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);

app.get('/insights', (req, res) => {
  try {
    const insights = getInsights();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});