// Javascript code to consume the API
// Constants
const baseUrl = "https://stoman.herokuapp.com/api/v2";
const baseUrlUi = "https://waracci.github.io/store-manager-ui/";

// Onpage Load Function
function checkPageCredentials() {
  // Contains all page checks before load
  checkAccessToken();
  if (window.location.href.includes("products.html")) {
    retrieveAllProducts();
  }
  if (window.location.href.includes("single-product.html")) {
    retrieveSingleProduct();
  }
  if (window.location.href.includes("edit-product.html")) {
    retrieveSingleProductEdit();
  }
  if (window.location.href.includes("sales.html")) {
    retrieveAllSales();
  }
  if (window.location.href.includes("sale-cart.html")) {
    retrieveCartProducts();
  }
  if (window.location.href.includes("sale-cart.html?id=")) {
    const productIdParam = new URLSearchParams(window.location.search).get(
      "id"
    );
    const productQtyParam = new URLSearchParams(window.location.search).get(
      "product_qty"
    );
    sellProduct(productIdParam, productQtyParam);
  }
  if (window.location.href.includes("add-attendant.html")) {
    fetchAllAttendants();
  }
  if (window.location.href.includes("logout.html")) {
    logout();
  }
}
console.log(`Bearer ${localStorage.getItem("token")}`);
console.log(window.location.href);

function checkAccessToken() {
  accessToken = localStorage.getItem("token");
  if (!accessToken || accessToken.includes("undefined")) {
    document.getElementById("panel").innerHTML = `
      <a href="index.html" class="logo">store-manager</a>
      <nav>
      <ul class="nav">
          <li><a href="index.html">home</a></li>
      </ul>
  </nav>
      <div class="center mb">
      <p class="red">Please login or register to access protected routes</p>
      <a href="login.html" class="button button-green">sign in</a>
      <a href="register.html" class="button button-blue">sign up</a>
      </div>
      <div class="center">
      <img src="../assets/images/warning.png" alt="">
      </div>`;
  }
}
function retrieveToken() {
  if (localStorage.getItem("token")) {
    return `Bearer ${localStorage.getItem("token")}`;
  } else {
    return;
  }
}

loginForm = document.getElementById("form-login");
addproductForm = document.getElementById("add-product");
regForm = document.getElementById("form-register");
if (regForm) {
  regForm.addEventListener("submit", userRegister);
}
if (loginForm) {
  loginForm.addEventListener("submit", userLogin);
}
if (addproductForm) {
  addproductForm.addEventListener("submit", addProduct);
}

const messageText = document.getElementById("messages");

function userRegister(event) {
  event.preventDefault();
  // Dom Elements
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirm_password = document.getElementById("confirmPassword").value;
  try {
  var role = document.getElementsByName("role")[0].value;    
  } catch (error) {
    role = "attendant"
  }
  fetch(`${baseUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ email, password, confirm_password, role })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      } else {
        messageText.innerHTML = "Attendant created!";
        window.location = `${baseUrlUi}UI/html/add-attendant.html`;
      }
    });
}

function userLogin(event) {
  event.preventDefault();
  // Dom Elements
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      } else {
        // Store Access Token in local storage
        // Check for Browser support for localStorage
        if (typeof Storage !== "undefined") {
          // Access Local Storage
          localStorage.setItem("token", data.token);
          messageText.innerHTML = data.message;
          window.location = `${baseUrlUi}UI/html/dashboard.html`;
        } else {
          alert("browser doesnt support local storage");
        }
      }
    });
}

function logout() {
  fetch(`${baseUrl}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      localStorage.removeItem("token")
      window.location = `${baseUrlUi}UI/html/login.html`;
    });
}

function addProduct(event) {
  event.preventDefault();
  const product_name = document.getElementById("name").value;
  const product_description = document.getElementById("description").value;
  const product_price = parseInt(document.getElementById("price").value);
  const product_quantity = parseInt(document.getElementById("quantity").value);
  const product_category = document.getElementById("category").value;
  const product_minorder = parseInt(document.getElementById("minorder").value);
  fetch(`${baseUrl}/products`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    },
    body: JSON.stringify({
      product_name,
      product_description,
      product_price,
      product_price,
      product_quantity,
      product_category,
      product_minorder
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.status == "ok") {
        messageText.innerHTML = data.message;
        window.location = `${baseUrlUi}UI/html/products.html`;
      }
    })
    .catch(err => {
      messageText.innerHTML = err;
    });
}

function retrieveAllProducts() {
  const productsTable = document.getElementById("products-table");
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
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.products) {
        if (data.products.length == 0) {
          messageText.innerHTML = "Empty Resource";
        }
        data.products.forEach((product, index) => {
          productsTable.innerHTML += `
          <tr>
          <td>${index + 1}</td>
          <td><a href="single-product.html?id=${product.id}">${
            product.name
          }</a></td>
          <td>${product.description}</td>
          <td>${product.price}Ksh</td>
          <td>${product.quantity}</td>
          <td>${product.category}</td>
          <td>${product.date_created}</td>
          <td>
          <a href="edit-product.html?id=${
            product.id
          }" class="button button-blue">Edit product</a>
          </td>
          <td>
              <a href="#" class="button button-red" onclick="deleteProduct(${
                product.id
              })">delete</a>
          </td>
      </tr>`;
        });
      } else {
        noProductsDispl.innerHTML = `<div class="center">No products found <br> <a href="add-product.html" class="button button-green"
        >add a product</a
      ></div>`;
      }
    });
}

function retrieveSingleProduct() {
  productDetails = document.getElementById("singleProductDetails");
  const productIdParam = new URLSearchParams(window.location.search).get("id");
  fetch(`${baseUrl}/products/${productIdParam}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.product) {
        if (data.product[0].length == 0) {
          messageText.innerHTML = "Empty Resource";
        }
        var product = data.product[0];
        productDetails.innerHTML = `<h1>Product name: ${product.name}</h1>
      <p> <b>Description: </b> ${product.description}</p>
      <p><b>Price:</b> ${product.price}Ksh</p>
      <p><b>Quantity</b> ${product.quantity}</p>
      <p><b>Category</b> ${product.category}</p>
      <p><b>minimum order quantity:</b> ${product.minorder}</p>
      <p><b>Date added: </b> ${product.date_created}</p>
      <hr>
      <h4>For admin only</h4>
      <a href="edit-product.html?id=${
        product.id
      }" class="button button-blue">Edit product</a>
      <a href="#" class="button button-red" onclick="deleteProduct(${
        product.id
      })">delete</a>`;
      }
    })
    .catch(err => {
      throw err;
    });
}

function deleteProduct(id) {
  if (confirm("delete this product")) {
    fetch(`${baseUrl}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: retrieveToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.errors || data.status == "failed") {
          alert(`${data.message} !`);
        }
        if (data.msg) {
          alert(`${data.msg}, Kindly sign in or register !`);
        }
        if (data.status == "ok") {
          window.location = `${baseUrlUi}UI/html/products.html`;
          alert(`product id ${id} has been deleted`);
        }
      });
  }
}

function retrieveSingleProductEdit() {
  const productIdParam = new URLSearchParams(window.location.search).get("id");
  const editproductForm = document.getElementById("edit-product");
  fetch(`${baseUrl}/products/${productIdParam}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.product) {
        const productArr = data.product[0];
        editproductForm.innerHTML = `
      <div class="form-item">
          <label for="name">Enter product name</label>
          <input type="text" class="form-input" name="name" placeholder="Enter product name" id="name" value="${
            productArr.name
          }">
      </div>
      <div class="form-item">
          <label for="name">Enter product description</label>
          <textarea rows="3" cols="50" class="form-input" name="description" placeholder="Enter product description" id="description">${
            productArr.description
          }</textarea>
      </div>
      <div class="form-item">
          <label for="price">Enter product price</label>
          <input type="number" class="form-input" name="price" placeholder="Enter product price" id="price" value="${
            productArr.price
          }">
      </div>
      <div class="form-item">
          <label for="quantity">Enter product quantity</label>
          <input type="number" class="form-input" name="quantity" placeholder="Enter product quantity" id="quantity" value="${
            productArr.quantity
          }">
      </div>
      <div class="form-item">
          <label for="category">Enter product category</label>
          <input type="text" class="form-input" name="category" placeholder="Enter product category" id="category" value="${
            productArr.category
          }">
      </div>
      <div class="form-item">
          <label for="minorder">Enter Minimum Order Quanity(minorder)</label>
          <input type="number" class="form-input" name="minorder" placeholder="Enter minorder" id="minorder"  value="${
            productArr.minorder
          }">
      </div>
      <div class="form-item">
          <button type="submit" class="button button-green">edit product</button>
          <button type="button" class="button button-red" onclick="window.location ='${baseUrlUi}UI/html/products.html'">cancel</button>
          
      </div>`;
      }
    });
}
editproductForm = document.getElementById("edit-product");
if (editproductForm) {
  editproductForm.addEventListener("submit", updateProduct);
}
const productIdParam = new URLSearchParams(window.location.search).get("id");
function updateProduct(event) {
  event.preventDefault();
  const product_name = document.getElementById("name").value;
  const product_description = document.getElementById("description").value;
  const product_price = parseInt(document.getElementById("price").value);
  const product_quantity = parseInt(document.getElementById("quantity").value);
  const product_category = document.getElementById("category").value;
  const product_minorder = parseInt(document.getElementById("minorder").value);
  fetch(`${baseUrl}/products/${productIdParam}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    },
    body: JSON.stringify({
      product_name,
      product_description,
      product_price,
      product_price,
      product_quantity,
      product_category,
      product_minorder
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      } else if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      } else {
        messageText.innerHTML = "success";
        window.location = `${baseUrlUi}UI/html/products.html`;
      }
    });
}

function retrieveAllSales() {
  const salesTable = document.getElementById("sales-table");
  const nosalesDispl = document.getElementById("noSales");
  fetch(`${baseUrl}/sales`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.sales) {
        if (data.sales.length == 0) {
          messageText.innerHTML = "No sales made";
        }
        data.sales.forEach((sale, index) => {
          salesTable.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>Product name ${sale.product_name}</td>
            <td>Quantity Sold: ${sale.product_quantity}</td>
            <td>Sales Total: ${sale.sales_total} Ksh</td>
            <td>Made by: ${sale.made_by}</td>
            <td>Date of Sale: ${sale.date_created}</td>            
          </tr>`;
        });
      } else {
        nosalesDispl.innerHTML = `<div class="center">No sales made</div>`;
      }
    });
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
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.products) {
        if (data.products.length == 0) {
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
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.status == "ok") {
        messageText.innerHTML = data.status;
        window.location = `${baseUrlUi}UI/html/sale-cart.html`;
      }
    });
}

function fetchAllAttendants() {
  const attendantsTable = document.getElementById("attendants-list");
  fetch(`${baseUrl}/auth/attendants`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.errors || data.status == "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.attendants) {
        if (data.attendants.length == 0) {
          messageText.innerHTML = "no attendants in store";
        }
        data.attendants.forEach((attendant, index) => {
          attendantsTable.innerHTML += `
          <tr>
              <td>${index + 1}</td>
              <td>Date added: ${attendant.created_at}</td>
              <td>Email: ${attendant.email}</td>
              <td>Role: ${attendant.role}</td>
          </tr>
          `;
        });
      }
    });
}


