import { Router } from 'express';
import passport from 'passport';
import { adminRole } from '../../middlewares/permission';
import orderController from './order.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/orders', [jwt_auth], orderController.get);
router.post('/orders', [jwt_auth, adminRole], orderController.post);

router.put('/orders/:id', [jwt_auth, adminRole], orderController.put);
router.put('/orders/:id/detail/:detailId', [jwt_auth, adminRole], orderController.doneDetail);

module.exports = router;
