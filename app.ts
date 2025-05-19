import express from 'express';
import path from 'path';
import router from './src/routes';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/lib', express.static(path.join(__dirname, 'public/lib')));

app.use('/', router);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
