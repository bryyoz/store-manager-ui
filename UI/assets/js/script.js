// Javascript code to consume the API
// Constants
const baseUrl = "http://127.0.0.1:5000/api/v2";
const baseUrlUi = "http://127.0.0.1:5500/";

// Onpage Load Function
function checkPageCredentials() {
  // Contains all page checks before load
  checkAccessToken();
}
console.log(`Bearer ${localStorage.getItem("token")}`);

function checkAccessToken() {
  accessToken = localStorage.getItem("token");
  if (!accessToken || accessToken.includes('undefined')) {
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


// Register a new User
regForm = document.getElementById("form-register");
loginForm = document.getElementById("form-login");
addproductForm = document.getElementById("add-product");
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
  const role = "admin";
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
        messageText.innerHTML = data.message;
        window.location = `${baseUrlUi}UI/html/login.html`;
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
      console.log(data)
      //GEt LOGIN ERRORS HERE
      if (data.status == "failed"){
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

function addProduct(event) {
  event.preventDefault();
  const product_name = document.getElementById("name").value;
  console.log(product_name);
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
      if (data.status == "ok"){
        messageText.innerHTML = data.message;
        window.location = `${baseUrlUi}UI/html/products.html`;
      }
      console.log(data);
    })
    .catch(err => {
      messageText.innerHTML = err;
    });
}

function retrieveAllProducts(){
  fetch(`${baseUrl}/products`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => console.log(data))
}
