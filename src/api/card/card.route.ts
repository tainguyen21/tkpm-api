import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import cardController from './card.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/card', [jwt_auth], cardController.get);
router.get('/card/:id', cardController.getById);
router.post('/card', [jwt_auth, adminRole], cardController.post);
router.put('/card/:id', [jwt_auth, adminRole], cardController.put);
router.delete('/card/:id', [jwt_auth, adminRole], cardController.delete);

module.exports = router;
