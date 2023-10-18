const socket = io();

socket.on("productUpdates", (products) => {
  let displayedProducts;
  const filteredProducts = products.docs.filter(product => product.owner !== sessionUser._id);
  const isPremiumUser = sessionUser.isPremium === 'true';
  
  displayedProducts = isPremiumUser ? products.docs : filteredProducts;

  const productContainer = document.getElementById("product-container");
  const productRows = displayedProducts.map((product) => `
    <div class="product-card">
      <img src="img.png" alt="Product Image" class="product-image">
      <div class="product-details">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Code: ${product.code}</p>
        <p>Price: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
        <p>Category: ${product.category}</p>
      </div>
      <div class="product-actions">
        <button class="btn btn-danger" onclick="removeFromCart('${product._id}')">Remove</button>
        <button class="btn btn-success" onclick="addToCart('${product._id}')">Add to Cart</button>
      </div>
    </div>
  `);

  productContainer.innerHTML = productRows.join("");
  const pagination = document.querySelector('.pagination');

  const previousPage = products.hasPrevPage
    ? `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${products.prevPage})"><-- </a></li>`
    : '';
  const nextPage = products.hasNextPage ?
    `<li class="page-item"><a class="page-link" href="#" onclick="onFilterChange(${products.nextPage})"> --></a></li>` : '';

  const paginationHTML = `
    ${previousPage}
    <li class="page-item"><a class="page-link">${products.page} of ${products.totalPages} pages</a></li>
    ${nextPage}
  `;

  pagination.innerHTML = paginationHTML;
});

socket.on("cartUpdates", (cartUpdate) => {
  const cartBody = document.getElementById("cart-items");
  const cartItems = cartUpdate.cartProducts.map((cartProduct) => `
    <p class="cart-item">${cartProduct.idProduct.title} x ${cartProduct.quantity}</p>  
  `);
  cartBody.innerHTML = cartItems.join("");
});

function onFilterChange(page) {
  const filterLimit = parseInt(document.getElementById("filterLimit").value);
  const filterSort = document.getElementById("filterSort").value;
  const filterAttName = document.getElementById("filterAttName").value;
  const filterText = document.getElementById("filterText").value;
  const filterPage = page ? page : 1;
  socket.emit("filterChanged", filterLimit, filterPage, filterSort, filterAttName, filterText);
}

function addToCart(productId) {
  socket.emit("addToCart", productId, sessionUser.idCart);
  Swal.fire({
    icon: 'success',
    title: 'Product Added',
    text: 'The product has been added to your cart.',
    showConfirmButton: false,
    timer: 1500,
  });
}

function removeFromCart(productId) {
  socket.emit("removeFromCart", productId, sessionUser.idCart);
  Swal.fire({
    icon: 'success',
    title: 'Product Removed',
    text: 'The product has been removed from your cart.',
    showConfirmButton: false,
    timer: 1500,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const deleteInactiveUsersButton = document.querySelector("#deleteInactiveUsers");

  if (deleteInactiveUsersButton) {
    deleteInactiveUsersButton.addEventListener("click", () => {
      fetch("/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Inactive users deleted',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            console.error("Failed to delete inactive users.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
});

function deleteProduct(productId) {
  fetch(`/products/delete/${productId}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire('Deleted!', 'Product deleted successfully', 'success');
      } else {
        Swal.fire('Error!', 'An error occurred while deleting the product', 'error');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Swal.fire('Error!', 'An error occurred while deleting the product', 'error');
    });
}
