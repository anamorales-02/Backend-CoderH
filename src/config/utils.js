import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { ProductModel } from '../dao/models/productsModel.js';
import { MessageModel } from '../dao/models/messagesModel.js';

export async function connectMongo() {
  try {
    await mongoose.connect(
      'mongodb+srv://akmorales02:xn2xxYykPwDiFrOD@mongocoder.v2vc0us.mongodb.net/?retryWrites=true&w=majority'
    );
    console.log('Connected to MongoDB!');
  } catch (e) {
    console.log(e);
    throw 'Cannot connect to the database';
  }
}

export function connectSocket(httpServer) {
  const io = new Server(httpServer);

  io.on('connection', async (socket) => {
    console.log('A socket connection opened: ' + socket.id);

    const products = await ProductModel.find({});
    io.emit('products', products);

    socket.on('addProduct', async (product) => {
      try {
        const newProduct = await ProductModel.create(product);
        io.emit('productAdded', newProduct);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on('product:delete', async (id) => {
      await ProductModel.findByIdAndDelete(id);
      io.emit('product:deleted', id);
    });

    socket.on('msg-front-to-back', async (msg) => {
      const msgCreated = await MessageModel.create(msg);
      const msgs = await MessageModel.find({});
      io.emit('msg-back-to-front', msgs);
    });
  });
}
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword)