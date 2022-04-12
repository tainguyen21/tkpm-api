import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import bookController from './rule.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/rule', bookController.get);
router.post('/rule', [jwt_auth, adminRole], bookController.post);
router.put('/rule/:id', [jwt_auth, adminRole], bookController.put);
router.delete('/rule/:id', [jwt_auth, adminRole], bookController.delete);

module.exports = router;
