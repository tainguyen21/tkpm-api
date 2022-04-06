require('dotenv').config();

import cors from 'cors';
import express from 'express';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3001;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// ROUTING
router(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
