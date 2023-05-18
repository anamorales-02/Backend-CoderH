// Conectarse al servidor Socket.IO
const socket = io();

// Obtener referencias a los elementos del formulario y a los campos de entrada
const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputDescript = document.getElementById("form-description");
const inputPrice = document.getElementById("form-price");
const inputCode = document.getElementById("form-code");
const inputStock = document.getElementById("form-stock");
const inputThumbnail = document.getElementById("form-thumbnail");

// Escuchar eventos del servidor Socket.IO
socket.on("products", (products) => {
  const productList = document.querySelector(".productListUpdated");
  productList.innerHTML = products
    .map(
      (product) => `
      <tr>
        <th scope="row">${product.id}</th>
        <td>${product.title}</td>
        <td>${product.description}</td>
        <td>${product.price}</td>
        <td>${product.code}</td>
        <td>${product.stock}</td>
        <td><img src="${product.thumbnail}" alt="${product.id}" title="Foto de ${product.title}" style="width: 50px; min-height: 100%; max-height: 50px;"></td>
        <td><button type="button" class="btn btn-danger" onclick="deleteProduct('${product.id}')">X</button></td>
      </tr>
    `
    )
    .join("");
});

// Manejar envío de formulario
formProducts.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: inputTitle.value,
    description: inputDescript.value,
    price: +inputPrice.value,
    thumbnail: inputThumbnail.value,
    code: inputCode.value,
    stock: +inputStock.value,
  };
  socket.emit("new-product", newProduct);
  formProducts.reset();
});

// Función para eliminar un producto
function deleteProduct(productId) {
  socket.emit("delete-product", productId);
}
