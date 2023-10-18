import { Router } from 'express';
import { ProductService } from '../services/productsService.js';
import { customProductsController } from '../controller/productController.js';
import { isUser, isAdmin, isLogged } from '../middlewares/auth.js';

const productRouter = Router();
const productService = new ProductService(); 

// Ruta para obtener todos los productos 
productRouter.get("/products", customProductsController.getProducts);

productRouter.get("/productsP", customProductsController.getProductsPaginate);

// Ruta para obtener un producto por ID 
productRouter.get('/products/:pid', customProductsController.getProductsPaginate);

// Ruta para agregar un nuevo producto 
productRouter.post("/products/new", isAdmin, customProductsController.createProduct);

// Ruta para actualizar un producto por ID 
productRouter.put("/products/:pid", isAdmin, customProductsController.updateProduct);

// Ruta para eliminar un producto por ID  
productRouter.delete("/products/:pid", isUser, customProductsController.deleteProduct);

// Ruta para obtener productos en tiempo real  
productRouter.get("/realtimeproducts", isUser, customProductsController.renderRealtimeProducts);

// Ruta para renderizar una página HTML con productos  
productRouter.get("/html/products", isUser, customProductsController.renderProductsPage);

export default productRouter;
