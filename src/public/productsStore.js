const socket = io();

const productForm = document.getElementById("productForm");
const productNameInput = document.getElementById("productName");
const productDescriptionInput = document.getElementById("productDescription");
const productPriceInput = document.getElementById("productPrice");
const productCodeInput = document.getElementById("productCode");
const productStockInput = document.getElementById("productStock");
const productCategoryInput = document.getElementById("productCategory");
const productThumbnailInput = document.getElementById("productThumbnail");

socket.on("product", (productsList) => {
  const productListContainer = document.getElementById("product-list-container");
  const productRows = productsList.map((product) => `
    <div class="product">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>In Stock: ${product.stock} units</p>
        <p>Category: ${product.category}</p>
        <p>Thumbnail: <img src="${product.thumbnail}" alt="Product Thumbnail"></p>
      </div>
      <div class="product-actions">
        <button class="btn btn-danger" onclick="removeProduct('${product._id}')">Remove</button>
      </div>
    </div>
  `);
  productListContainer.innerHTML = productRows.join("");
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let owner;

  if (sessionUser.isPremium === 'true') {
    owner = sessionUser._id;
  } else {
    owner = 'admin';
  }

  const newProduct = {
    name: productNameInput.value,
    description: productDescriptionInput.value,
    price: parseFloat(productPriceInput.value),
    code: productCodeInput.value,
    stock: parseInt(productStockInput.value),
    category: productCategoryInput.value,
    owner,
    thumbnail: productThumbnailInput.value,
  };
  
  socket.emit("add-product", newProduct);
  productForm.reset();
});

function removeProduct(productId) {
  socket.emit('remove-product', productId);
}
