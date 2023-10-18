import { Router } from 'express';
import { customTicketsController } from '../controller/tiketController.js';
import { isLogged, isUser } from '../middlewares/auth.js';

const ticketRouter = Router();

// Ruta para la compra de un ticket
ticketRouter.get('/purchase', isLogged, customTicketsController.createTicket);

// Ruta para la confirmación del ticket
ticketRouter.get('/confirmation', isLogged, customTicketsController.checkout);

export default ticketRouter;