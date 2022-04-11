import cors from 'cors';
import express from 'express';
import { connectDB } from './configs/database';
import router from './routes';
import morgan from 'morgan';
import passportJwt from './middlewares/passport';
import passport from 'passport';

require('dotenv').config();

const app = express();
const PORT: number = +(process.env.PORT || 3001);
const HOST: string = process.env.HOST || '0.0.0.0';

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// PASSPORT
passportJwt(passport);

// ROUTING
router(app);

//DATABASE
connectDB();

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
