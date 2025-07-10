import express from 'express';
import path from 'path';

const app = express();
const distPath = path.resolve('./dist');

app.use(express.static(distPath));

app.get('*', (_, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;
