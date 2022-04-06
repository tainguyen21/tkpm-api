import { Application } from 'express';
import glob from 'glob';

const router = (_: Application) => {
  glob(`${__dirname}/api/**/*.route.+(js|ts)`, {}, (error, files) => {
    if (error) throw error;

    console.log(require(files[0]));
  });
};

export default router;
