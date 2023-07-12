import express from 'express';
import { isAdmin, isUser } from '../middlewares/auth.js';
import passport from 'passport';

export const authRouter = express.Router();

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'No se pudo cerrar la sesión' });
    }
    return res.redirect('/auth/login');
  });
});

authRouter.get('/profile', isUser, (req, res) => {
  const user = req.session.user;
  return res.render('profile', { user });
});

authRouter.get('/administration', isUser, isAdmin, (req, res) => {
  return res.send('Datos solo visibles por administradores');
});

authRouter.get('/login', (req, res) => {
  return res.render('login', {});
});

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'Credenciales inválidas' });
  }
  try {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin
    };
    return res.json({ msg: 'ok', payload: req.user });
  } catch (e) {
    console.log(e);
    return res.status(400).render('error', { error: 'No se pudo iniciar sesión' });
  }
});

authRouter.get('/register', (req, res) => {
  return res.render('register', {});
});

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }), async (req, res) => {
  if (!req.user) {
    return res.json({ error: 'Algo salió mal' });
  }
  try {
    req.session.user = {
      _id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin
    };

    return res.json({ msg: 'ok', payload: req.user });
  } catch (e) {
    console.log(e);
    return res.status(400).render('error', { error: 'No se pudo crear el usuario. Intente con otro correo electrónico' });
  }
});

authRouter.get('/failregister', async (req, res) => {
  return res.json({ error: 'Error al registrarse' });
});

authRouter.get('/session', (req, res) => {
  return res.send(JSON.stringify(req.session));
});

authRouter.get('/faillogin', async (req, res) => {
  return res.json({ error: 'Error al iniciar sesión' });
});
