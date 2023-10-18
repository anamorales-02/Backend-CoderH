import { ProductModel } from './models/productsModel.js';

export class CustomProductDAO {
  async getProducts(limit) {
    try {
      const products = await ProductModel.find().limit(5).lean().exec();
      return products;
    } catch (err) {
      throw (`Error obtaining products ${err}`);
    }
  }

  async getProductsPaginate(filter, limit, lean, page, sort) {
    try {
      const products = await ProductModel.paginate(filter, limit, lean, page, sort);
      return products;
    } catch (err) {
      throw (`Error obtaining products ${err}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.find({ _id: id });
      return product;
    } catch (err) {
      throw (`Didn't find the product ${err}`);
    }
  }

  async addProduct(newProd) {
    try {
      const createdProduct = await ProductModel.create(newProd);
      return createdProduct;
    } catch (err) {
      throw (`Error adding the product ${err}`);
    }
  }

  async updateProduct(id, fieldsToUpdate) {
    try {
      const prodUpdated = await ProductModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
      return prodUpdated;
    } catch (err) {
      throw (`Couldn't update the product with ID ${id}. ${err}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await ProductModel.findOne({ _id: id }).populate('owner').lean();
      await ProductModel.deleteOne({ _id: id });
      console.log({ product });
      return product;
    } catch (err) {
      throw (`Error deleting the product ${err}`);
    }
  }
}

export const customProductDAO = new CustomProductDAO();
