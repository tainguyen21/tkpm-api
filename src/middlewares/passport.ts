import { PassportStatic } from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User';

const passportJwt = (passport: PassportStatic) =>
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET_KEY,
        algorithms: ['HS256'],
        passReqToCallback: true,
      },
      (jwt_payload, done) => {
        User.findById(jwt_payload._id)
          .exec()
          .then((user) => {
            if (!user) return done(null, false);

            return done(null, user);
          })
          .catch((err) => done(err, false));
      }
    )
  );

export default passportJwt;
