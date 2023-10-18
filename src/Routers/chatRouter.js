import { Router } from 'express';
import { conversationsController } from '../controller/chatController.js';
import { isLogged } from '../middlewares/auth.js';

const routerChat = Router();

routerChat.get("/chat", isLogged, conversationsController.getChatPage);

export default routerChat;