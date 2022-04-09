import cors from 'cors';
import express from 'express';
import { connectDB } from './configs/database';
import router from './routes';
import morgan from 'morgan';

require('dotenv').config();

const app = express();
const PORT: number = +(process.env.PORT || 3001);
const HOST: string = process.env.HOST || '127.0.0.1';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// ROUTING
router(app);

connectDB();

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
