const persistentDataAccess = require('../data-access/persistent');

const tokenStore = persistentDataAccess('tokens');

const authCheck = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader === undefined) {
    res.status(400).send({ message: 'no auth header' });
    return;
  }
  const authToken = authHeader.split(' ')[1];
  const allTokens = await tokenStore.all();
  const currentToken = allTokens.find((t) => t.token === authToken);
  if (authToken === undefined || !currentToken) {
    console.log('please provide valid token');
    res.status(400).send({ message: 'invalid user token' });
  } else {
    console.log('you are logged in');
    req.user = currentToken.user;
    console.log(req.user);
    next();
  }
};

module.exports = authCheck;