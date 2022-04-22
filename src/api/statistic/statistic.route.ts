import { Router } from 'express';
import passport from 'passport';
import statisticController from './statistic.controller';

const router = Router();

const jwt_auth = passport.authenticate('jwt', { session: false });

router.get('/statistic/books', [jwt_auth], statisticController.getBooks);
router.get('/statistic/users', [jwt_auth], statisticController.getUsers);

module.exports = router;
