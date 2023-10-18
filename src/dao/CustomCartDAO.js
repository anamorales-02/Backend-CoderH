import { CartModel } from './models/cartsModel.js';

export class CustomCartDAO {
  async getCarts(limit) {
    try {
      const carts = await CartModel.find().limit(limit);
      return carts;
    } catch (err) {
      throw (`Error obtaining data from carts`);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      return cart;
    } catch (err) {
      throw (`Didn't find the cart with ID ${cartId}.`);
    }
  }

  async addCart() {
    try {
      const createdCart = await CartModel.create({});
      return createdCart;
    } catch (err) {
      throw (`Error creating a new cart`);
    }
  }
 
  async addProductToCart(cartId, cart) {
    try {
      const updatedCart = await CartModel.findByIdAndUpdate(cartId, cart, { new: true });
      return updatedCart;
    } catch (err) {
      throw (`Error adding a product to the cart`);
    }
  }

  async getProductsByCartId(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate('products.idProduct').lean();
      const cartProducts = cart.products;
      return { cartProducts };
    } catch (err) {
      throw (`Error obtaining products from the cart`);
    }
  }

  async deleteProductFromCart(cartId, cart) {
    try {
      const updatedCart = await CartModel.findByIdAndUpdate(cartId, cart, { new: true });
      return updatedCart;
    } catch (err) {
      throw (`Error deleting a product from the cart`);
    }
  }

  async updateCart(cid, cartUpdate) {
    try {
      const updatedCart = await CartModel.findOneAndUpdate(cid, cartUpdate, { new: true });
      return updatedCart;
    } catch (err) {
      throw (`Error updating the cart`);
    }
  }

  async emptyCart(cid) {
    try {
      const emptyCart = await CartModel.findOneAndUpdate(cid, { products: [] }, { new: true });
      return emptyCart;
    } catch (err) {
      throw (`Error emptying the cart`);
    }
  }

  async deleteCart(id) {
    try {
      const deletedCart = await CartModel.findOneAndDelete(id);
      return deletedCart;
    } catch (err) {
      throw (`Error deleting the cart`);
    }
  }
}

export const customCartDAO = new CustomCartDAO();
