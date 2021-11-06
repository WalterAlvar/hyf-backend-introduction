// const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenSecret =
  'Ipif{l}]`"m(FA~B&WWIU]C->P/knVx^Y"MyeL7Z~X+9U`|^ajBVo)?9b.TrHCG';

const persistentDataAccess = require('../data-access/persistent');

const userStore = persistentDataAccess('users');
const tokenStore = persistentDataAccess('tokens');

const objectId = require('objectid');

exports.loginManager = {
  read: async (user, pass) => {
    const loginData = {
      user,
      pass,
    };
    const allUsers = await userStore.all();
    const userExist = allUsers.find((e) => e.user === loginData.user);

    const token = jwt.sign(
      {
        user,
      },
      tokenSecret,
      {
        expiresIn: '15m',
      },
    );
    const id = objectId().toString();

    const allTokens = await tokenStore.all();
    const tokenExist = allTokens.find((e) => e.user === loginData.user);
    if (!tokenExist) {
      await tokenStore.create({ user, id, token });
    } else {
      await tokenStore.remove(tokenExist.id);
      await tokenStore.create({ user, id, token });
    }
    const cryptCheck = async (p1, p2) => {
      const checkResult = await bcrypt.compare(p1, p2);
      return [checkResult, token];
    };

    return cryptCheck(loginData.pass, userExist.pass);
  },
};