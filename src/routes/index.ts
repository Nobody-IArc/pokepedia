import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

router.get('/:name', (req: Request, res: Response) => {
  const name = req.params.name.toLowerCase();
  const filePath = path.join(__dirname, '../../data', `${name}.json`);

  if (!fs.existsSync(filePath)) {
    res.status(404).send('파일 없음');
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(content);

  res.render('index.ejs', jsonData);
});

export default router;