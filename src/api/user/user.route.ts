import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import userController from './user.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/users', [jwt_auth, adminRole], userController.get);
router.put('/users/:id', [jwt_auth], userController.put);
router.delete('/users/:id', [jwt_auth, adminRole], userController.delete);

module.exports = router;
