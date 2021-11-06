'use strict';

const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config');
const routes = require('./routes/index');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const authCheck = require('./middleware/auth-check');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(
  morgan('combined', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
      flags: 'a',
    }),
  }),
);

if (config.MODE === 'development') {
  app.use(morgan('dev'));
}

//register
app.use('/api/register', registerRoute);

//login
app.use('/api/login', loginRoute);

app.use(authCheck);

app.use('/api', routes);

app.use('/', express.static(path.join(__dirname, '..', config.STATIC_DIR)));

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
      `listening at http://localhost:${config.PORT} (${config.MODE} mode)`,
    );
  }
});