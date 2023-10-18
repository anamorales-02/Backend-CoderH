import { Router } from 'express';
import { cartsController } from '../controller/cartController.js';
import { isLogged, isUser } from '../middlewares/auth.js';

const customCartRouter = Router();

// Ruta para mostrar todos los carritos  
customCartRouter.get('/custom/carts', isUser, cartsController.createCart);

// Ruta para mostrar productos en un carrito específico  
customCartRouter.get('/custom/carts/:cid', isUser, cartsController.getProductsByCartId);

// Ruta para crear un nuevo carrito  
customCartRouter.post('/custom/carts/new', isUser, cartsController.addCart);

// Ruta para agregar un producto a un carrito  
customCartRouter.put('/custom/carts/:cid/products/:pid', isUser, cartsController.addProductToCart); 

// Ruta para eliminar un producto de un carrito  
customCartRouter.delete('/custom/carts/:cid/products/:pid', isUser, cartsController.deleteProductFromCart);

// Ruta para vaciar un carrito  
customCartRouter.delete('/custom/carts/:cid', isUser, cartsController.emptyCart);

// Ruta para eliminar todos los carritos  
customCartRouter.delete('/custom/carts/deleteAll/:cid', isUser, cartsController.deleteCart);

// Ruta para mostrar productos en un carrito (usando Handlebars, requiere autenticación de usuario)
customCartRouter.get('/custom/carts/products/:cid', isUser, cartsController.getProductsByCartId_Handlebars);

// Ruta para mostrar la tienda  
customCartRouter.get('/custom/store', isUser, cartsController.getProductsByCartId_Paginate);

export default customCartRouter;
