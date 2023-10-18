import { CartModel } from '../dao/models/cartsModel.js';
import { ProductModel } from '../dao/models/productsModel.js';

export default class CartService {
  async createCart() {
    try {
      const cart = await CartModel.create({});
      return cart;
    } catch (err) {
      throw err;
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId }).populate('products.productId').lean();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const product = await ProductModel.findOne({ _id: productId });
      if (!product) {
        throw new Error('Product not found');
      }
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        throw new Error('Cart not found');
      }
      const existingProductIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
      const savedCart = await cart.save();
      return savedCart;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        throw new Error('Cart not found');
      }

      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex === -1) {
        throw new Error('Product not found in the cart');
      }

      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }

      const savedCart = await cart.save();
      return savedCart;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        throw new Error('Cart not found');
      }
      cart.products = [];
      const clearedCart = await cart.save();
      return clearedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        throw new Error('Cart not found');
      }
      cart.products = products.map((product) => ({
        productId: product._id,
        quantity: product.quantity,
      }));
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart) {
        throw new Error('Cart not found');
      }
      const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId);
      if (productIndex === -1) {
        throw new Error('Product not found in the cart');
      }
      const updatedQuantity = cart.products[productIndex].quantity + quantity;
      cart.products[productIndex].quantity = updatedQuantity;
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw error;
    }
  }
};
export const cartService = new CartService();
