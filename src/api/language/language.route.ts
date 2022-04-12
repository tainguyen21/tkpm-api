import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import languageController from './language.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/languages', languageController.get);
router.post('/languages', [jwt_auth, adminRole], languageController.post);
router.put('/languages/:id', [jwt_auth, adminRole], languageController.put);
router.delete('/languages/:id', [jwt_auth, adminRole], languageController.delete);

module.exports = router;
