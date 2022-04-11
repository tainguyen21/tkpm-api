import { Router } from 'express';
import authController from './auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
