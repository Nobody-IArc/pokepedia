import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();



router.get('/pokemon', (req: Request, res: Response) => {
  const dir = path.join(__dirname, '../../data');
  const files = fs.readdirSync(dir);

  const pokemons = files.map(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    return JSON.parse(content);
  });

  pokemons.sort((a, b) => a.korName.localeCompare(b.korName));

  const page = Number(req.query.page) || 1;
  const perPage = 25;
  const total = pokemons.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = pokemons.slice(start, start + perPage);

  console.log({
    page,
    total,
    totalPages,
    start,
    perPage,
    hasFiles: files.length,
    pageQuery: req.query.page
  });

  res.render('pokemonList.ejs', {
    pokemons: paginated,
    currentPage: page,
    totalPages: totalPages,
  });
});

router.get('/detail/:name', (req: Request, res: Response) => {
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