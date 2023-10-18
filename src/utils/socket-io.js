import { Server } from "socket.io";
import { MessageModel } from '../dao/models/messagesModel.js';
import { productsService } from "../services/productsService.js";
import { cartService } from "../services/cartService.js";

// Manejador del servidor de sockets
export function setupSocketServer(httpServer) {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
    console.log("A client-socket has connected: " + socket.id);

    // Manejador de cambios en filtros
    socket.on("filterChange", async (filterLimit, filterPage, filterSort, filterAttName, filterText) => {
      try {
        const limit = filterLimit;
        const page = filterPage;
        const filter = filterText;
        const sort = filterSort;
        const attribute = filterAttName;
        const products = await productsService.paginateProducts(limit, page, filter, sort, attribute);
        socket.emit("updatedProducts", products);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    // Manejador para agregar al carrito
    socket.on("addToCart", async (productId, cartId) => {
      try {
        await cartService.addProductToCart(cartId, productId)
        const cartUpdated = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdated);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    socket.on("removeFromCart", async (productId, cartId) => {
      try {
        await cartService.deleteProductFromCart(cartId, productId)
        const cartUpdated = await cartService.getProductsByCartId(cartId);
        socketServer.emit("dinamic-list-cart", cartUpdated);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    // Manejador para agregar un nuevo producto
    socket.on("addProduct", async (newProduct) => {
      try {
        await productsService.addProduct({ ...newProduct });
        const productsList = await productsService.getProductsByOwner(newProduct.owner);
        socketServer.emit("productsList", productsList);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    // Manejador para eliminar un producto
    socket.on("deleteProduct", async (productId) => {
      try {
        const deletedProduct = await productsService.deleteProduct(productId);
        const updatedProducts = await productsService.getProductsByOwner(deletedProduct.owner);
        socketServer.emit("productsList", updatedProducts);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });

    // Manejador para mensajes
    socket.on("message", async (message) => {
      try {
        await MessageModel.create(message);
        const messages = await MessageModel.find();
        socketServer.emit('messageLogs', messages);
      } catch (err) {
        console.log({ Error: `${err}` });
      }
    });
  });
}
