import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import publisherController from './publisher.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/publisher', publisherController.get);
router.post('/publisher', [jwt_auth, adminRole], publisherController.post);
router.put('/publisher/:id', [jwt_auth, adminRole], publisherController.put);
router.delete('/publisher/:id', [jwt_auth, adminRole], publisherController.delete);

module.exports = router;
