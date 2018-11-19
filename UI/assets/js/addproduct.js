addproductForm = document.getElementById("add-product");
if (addproductForm) {
  addproductForm.addEventListener("submit", addProduct);
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
      if (data.errors || data.status === "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.status === "ok") {
        messageText.innerHTML = data.message;
        window.location = `${baseUrlUi}UI/html/products.html`;
      }
    })
    .catch(err => {
      messageText.innerHTML = err;
    });
}
