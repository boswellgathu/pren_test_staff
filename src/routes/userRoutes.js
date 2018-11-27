const express = require('express');
const { IsAdmin, VerifyToken } = require('../controllers/AuthController');
const {
  createUser, updateUser, deleteUser, signIn
} = require('../controllers/UserController');

const UserRouter = express.Router();

UserRouter.post('/user', VerifyToken, IsAdmin, createUser);
UserRouter.post('/user/signin', signIn);
UserRouter.put('/user/:id', updateUser);
UserRouter.delete('/user/:id', deleteUser);

module.exports = UserRouter;
