
  if (window.location.href.includes("single-product.html")) {
    retrieveSingleProduct();
  }

function retrieveSingleProduct () {
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
        if (data.errors || data.status === "failed") {
          messageText.innerHTML = `${data.message} !`;
        }
        if (data.msg) {
          messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
        }
        if (data.product) {
          if (data.product[0].length === 0) {
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
