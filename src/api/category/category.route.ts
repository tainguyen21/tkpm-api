import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import categoryController from './category.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/categories', categoryController.get);
router.post('/categories', [jwt_auth, adminRole], categoryController.post);
router.put('/categories/:id', [jwt_auth, adminRole], categoryController.put);
router.delete('/categories/:id', [jwt_auth, adminRole], categoryController.delete);

module.exports = router;
