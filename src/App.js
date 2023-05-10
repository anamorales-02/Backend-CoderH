const express = require("express");
const app = express();
const port = 8080;
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const productsRouter = require('./Routes/productsRouter.js');
const cartsRouter = require('./Routes/cartsRouter.js');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port,() => {
    console.log(`Server running on port http://localhost:${port}`)
});
  