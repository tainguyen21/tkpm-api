import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import cardController from './card.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/languages', [jwt_auth], cardController.get);
router.post('/languages', [jwt_auth, adminRole], cardController.post);
router.put('/languages/:id', [jwt_auth, adminRole], cardController.put);
router.delete('/languages/:id', [jwt_auth, adminRole], cardController.delete);

module.exports = router;
