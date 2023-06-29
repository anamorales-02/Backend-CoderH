import express from 'express';
import http from 'http';
import { productsRouter } from './Routers/productsRouter.js';
import { cartRouter } from './Routers/cartsRouter.js';
import { clientRouter } from './Routers/clientRouter.js';
import { connectMongo, connectSocket } from './utils.js';

import { ProductManager } from './dao/ProductManager.js';
const data = new ProductManager('productsDB');

import exphbs from 'express-handlebars';
import path from 'path';

const PORT = 8080;
const app = express();
const httpServer = http.createServer(app);
const io = connectSocket(httpServer);

connectMongo(); // Conecta a la base de datos MongoDB
connectSocket(httpServer); // Conecta el servidor de sockets

const server = httpServer.listen(PORT, () =>
  console.log(`📢 Server listening on port: ${PORT}`)
);

server.on('error', (error) => console.log(`Server error: ${error}`));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')));

// Using handlebars engine for templates
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layout')
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', productsRouter);
app.use('/api', cartRouter);
app.use('/', clientRouter);


io.on('connection', (socket) => {
  console.log(`New Client Connection with ID: ${socket.id}`);

  socket.on('new-product', async (newProd) => {
    try {
      await data.addProduct({ ...newProd });
      const productsList = await data.getProducts();
      io.emit('products', productsList);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('delete-product', async (delProd) => {
    try {
      const id = parseInt(delProd);
      await data.deleteProduct(id);
      const productsList = await data.getProducts();
      io.emit('products', productsList);
    } catch (error) {
      console.log(error);
    }
  });
});

app.get('*', (req, res) =>
  res.status(404).send('<h3>We cannot access the requested route</h3>')
);
