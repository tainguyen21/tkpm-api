import { Request } from 'express';
import { VerifyCallback } from 'jsonwebtoken';
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
      (_: Request, jwt_payload: any, done: VerifyCallback) => {
        User.findById(jwt_payload._id)
          .exec()
          .then((user) => {
            if (!user) return done(null, undefined);

            return done(null, user);
          })
          .catch((err) => done(err, undefined));
      }
    )
  );

export default passportJwt;
