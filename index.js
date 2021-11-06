const express = require('express');

const app = express();
const fs = require('fs');
const util = require('util');

const read = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const bodyParser = require('body-parser');

app.use(bodyParser.text());
const logger = require('../middleware/logger');

// middleware

app.use(logger);
console.log(logger);
// read a file -- /files/tim --> tim.txt
// GET
app.get('/files/:name', async (req, res) => {
  try {
    const content = await read(`./files/${req.params.name}.txt`, 'utf8');
    res.send(content);
  } catch (error) {
    res.status(404).send({ ok: false, message: 'file not found' });
  }
});

// create file
// POST
app.post('/files/:name', async (req, res) => {
  const path = `./files/${req.params.name}.txt`;
  if (fs.existsSync(path)) {
    res
      .status(409)
      .send({ ok: false, message: 'file with that name already exists!' });
    return;
  }
  try {
    await write(path, req.body);
    res.send({ ok: true, message: `file ${path} created successfully` });
  } catch (error) {
    res
      .status(500)
      .send({ ok: false, message: 'error writing file', err: error });
  }
});

// update a file
// PUT
app.put('/files/:name', async (req, res) => {
  const path = `./files/${req.params.name}.txt`;
  if (!fs.existsSync(path)) {
    res
      .status(409)
      .send({ ok: false, message: 'file with that name does not exist!' });
    return;
  }
  try {
    await write(path, req.body);
    res.send({ ok: true, message: `file ${path} updated successfully` });
  } catch (error) {
    res
      .status(500)
      .send({ ok: false, message: 'error writing file', err: error });
  }
});

app.listen(3000);

app.use(
  morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }),
  })
);

if (config.MODE === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', api);

app.use('/', express.static(path.join(__dirname, config.STATIC_DIR)));




/* eslint-disable */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(config.PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      `listening at http://localhost:${config.PORT} (${config.MODE} mode)`
    );
  }
});
