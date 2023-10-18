import { Router } from 'express';
import passport from 'passport';
import { customSessionsController } from '../controller/sessionController.js';

export const sessionsRouter = Router();

// Ruta para iniciar sesión con GitHub
sessionsRouter.get('/api/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback para autenticación con GitHub
sessionsRouter.get('/api/sessions/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), customSessionsController.handleDashboard);

// Ruta para obtener la sesión actual
sessionsRouter.get('/api/sessions/current', customSessionsController.getCurrentSession);

export default sessionsRouter;
