import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import bookController from './book.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/books', bookController.get);
router.post('/books', [jwt_auth, adminRole], bookController.post);
router.put('/books/:id', [jwt_auth, adminRole], bookController.put);
router.delete('/books/:id', [jwt_auth, adminRole], bookController.delete);

module.exports = router;
