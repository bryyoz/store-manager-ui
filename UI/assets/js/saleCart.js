if (window.location.href.includes("sale-cart.html")) {
  retrieveCartProducts();
}
if (window.location.href.includes("sale-cart.html?id=")) {
  const productIdParam = new URLSearchParams(window.location.search).get("id");
  const productQtyParam = new URLSearchParams(window.location.search).get(
    "product_qty"
  );
  sellProduct(productIdParam, productQtyParam);
}

function retrieveCartProducts() {
  const productsTable = document.getElementById("sales-cart-table");
  const noProductsDispl = document.getElementById("noProducts");
  fetch(`${baseUrl}/products`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status === "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.products) {
        if (data.products.length === 0) {
          messageText.innerHTML = "Empty Resource";
        }
        data.products.forEach((product, index) => {
          productsTable.innerHTML += `
            <tr>
            <td>${index + 1}</td>
            <td><a href="single-product.html?id=${product.id}">${
            product.name
          }</a></td>
            <td>${product.price}Ksh</td>
            <td>${product.quantity} pcs</td>
            
            <td>
            <form>
            <input type="hidden" name="id" value="${product.id}">
            <input type="text" placeholder="Enter product qty" class="form-input" name="product_qty" required>
            <button type="submit" class="button button-green">sell item</button>
            </form>
            </td>
            <td>
            </td>
        </tr>       
           `;
        });
      } else {
        noProductsDispl.innerHTML = `<div class="center">No products found <br> <a href="add-product.html" class="button button-green"
          >add a product</a
        ></div>`;
      }
    });
}

function sellProduct(product_id, product_quantity) {
  fetch(`${baseUrl}/sales`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    },
    body: JSON.stringify({ product_id, product_quantity })
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status === "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.status === "ok") {
        messageText.innerHTML = data.status;
        window.location = `${baseUrlUi}UI/html/sale-cart.html`;
      }
    });
}
