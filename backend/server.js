const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

app.use('/api/files', fileRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
