const express = require("express");
const ProductManager = require("../ProductManager");
const dataProd = new ProductManager("productsDB");

const hbsRoutes = express.Router();

hbsRoutes.get("/", async (req, res) => {
  try {
    const version = parseInt(req.query.v);
    const products = await dataProd.getProducts();
    let template = version === 2 ? "home2" : "home";

    return res.render(template, { products });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error", payload: {} });
  }
});

module.exports = hbsRoutes;
