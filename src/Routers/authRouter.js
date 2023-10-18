import express from 'express';
import { isAdmin, isLogged } from '../middlewares/auth.js';
import passport from 'passport';
import { customUsersController } from '../controller/usersController.js';

const authRouter = express.Router();

// Ruta para registrarse
authRouter.get('/auth/register', customUsersController.register);
authRouter.post('/auth/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), customUsersController.registerPassport);
authRouter.post('/auth/register', customUsersController.registerFail);

// Ruta para iniciar sesión
authRouter.get('/auth/login', customUsersController.login);
authRouter.post('/auth/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), customUsersController.loginPassport);
authRouter.post('/auth/login', customUsersController.loginFail);

// Ruta para cerrar sesión
authRouter.get('/auth/logout', customUsersController.logOut);

// Ruta para ver el perfil
authRouter.get('/auth/profile', isLogged, customUsersController.profile);

// Ruta para el panel de control
authRouter.get('/auth/dashboard', isLogged, customUsersController.dashboard);

// Ruta para cambiar a usuario premium
authRouter.get('/api/users/upgrade/:uid', isLogged, customUsersController.changePremiumUser);

// Ruta para cambiar el rol del usuario
authRouter.get('/api/users/role/:uid', customUsersController.changeUserRole);

export default authRouter;

