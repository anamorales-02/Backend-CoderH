import fetch from 'node-fetch';

const form = document.querySelector('.form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const codeInput = document.getElementById('code');
const stockInput = document.getElementById('stock');

async function deleteProductWithSocket(id) {
  socket.emit('product:delete', id);
}

async function deleteProduct(id) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'delete'
  });

  if (response.ok) {
    const div = document.getElementById(id);
    div.remove();
  } else {
    alert('Cannot delete product');
  }
}

try {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = titleInput.value;
    const description = descriptionInput.value;
    const price = parseFloat(priceInput.value);
    const code = codeInput.value;
    const stock = parseInt(stockInput.value);

    const product = {
      title,
      description,
      price,
      code,
      stock
    };

    try {
      socket.emit('addProduct', product);
    } catch (error) {
      const res = await fetch('/api/products', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      });

      if (res.ok) {
        const productData = (await res.json()).data;
        const container = document.getElementById('product-container');
        const productListElement = document.createElement('div');
        productListElement.innerHTML = `
          <div class="product">
            <h2>${productData.title}</h2>
            <img src="${productData.thumbnails}" alt="">
            <p><strong>Price:</strong> $${productData.price}</p>
            <p><strong>Stock:</strong> ${productData.stock}</p>
            <button class="delete-btn" onclick="deleteProduct('${productData._id}')">Delete</button>
          </div>
        `;
        container.appendChild(productListElement);
      }
    }
  });
} catch (e) {}

async function addToCart(productId) {
  try {
    let cartId = localStorage.getItem('cartId');

    if (!cartId) {
      const response = await fetch('http://localhost:8080/api/carts', {
        method: 'POST'
      });

      const data = await response.json();
      cartId = data.payload._id;
      localStorage.setItem('cartId', cartId);
    }

    await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
      method: 'POST'
    });

    alert('Product added correctly');
  } catch (error) {
    alert('Failed to add to cart');
  }
}

async function updateCartBadge() {
  try {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
      document.getElementById('badgeCart').textContent = '';
      return;
    }

    const response = await fetch(`http://localhost:8080/api/carts/${cartId}`);
    const data = await response.json();

    if (data.payload && data.payload[0] && data.payload[0].products) {
      const cart = data.payload[0];
      const itemCount = cart.products.length;
      document.getElementById('badgeCart').textContent = itemCount.toString();
    } else {
      document.getElementById('badgeCart').textContent = '';
    }
  } catch (error) {
    document.getElementById('badgeCart').textContent = '';
  }
}

let userMail = '';

async function askEmail() {
  const { value: name } = await Swal.fire({
    title: 'Enter your email',
    input: 'text',
    inputLabel: 'Your email',
    inputValue: '',
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write your email!';
      }
    }
  });

  userMail = name;
}

askEmail();

const chatBox = document.getElementById('chat-box');

chatBox.addEventListener('keyup', ({ key }) => {
  if (key === 'Enter') {
    socket.emit('msg-front-to-back', {
      user: userMail,
      message: chatBox.value
    });
    chatBox.value = '';
  }
});

try {
  socket.on('productAdded', async (product) => {
    const container = document.getElementById('product-container');
    const productListElement = document.createElement('div');
    productListElement.innerHTML = `
      <div id="${product._id}" class="product">
        <h2>${product.title}</h2>
        <img src="${product.thumbnails}" alt="">
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <button class="delete-btn" onclick="deleteProductWithSocket('${product._id}')">Delete</button>
      </div>
    `;

    container.appendChild(productListElement);
  });

  socket.on('product:deleted', (id) => {
    const div = document.getElementById(id);
    div.remove();
  });

  socket.on('msg-back-to-front', async (msgs) => {
    let formattedMsgs = '';

    msgs.forEach((msg) => {
      formattedMsgs += '<div style="border: 1px solid black">';
      formattedMsgs += '<p>' + msg.user + '</p>';
      formattedMsgs += '<p>' + msg.message + '</p>';
      formattedMsgs += '</div>';
    });

    const divMsgs = document.getElementById('div-msgs');
    divMsgs.innerHTML = formattedMsgs;
  });
} catch (error) {}
