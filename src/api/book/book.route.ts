import { Request, Response, Router } from 'express';

const router = Router();

router.get('/books', (_: Request, res: Response) => {
  return res.send('Test route');
});

module.exports = router;
