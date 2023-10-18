import express from 'express';
import { customUsersController } from '../controller/usersController.js';
import { isAdmin, isLogged } from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/all-users', isLogged, isAdmin, customUsersController.getUsers);
userRouter.post('/change-role/:uid', isLogged, isAdmin, customUsersController.changeUserRole);
userRouter.delete('/delete-inactive', isLogged, isAdmin, customUsersController.deleteInactiveUsers);
userRouter.delete('/delete/:uid', isLogged, isAdmin, customUsersController.deleteUser);

export default userRouter;
