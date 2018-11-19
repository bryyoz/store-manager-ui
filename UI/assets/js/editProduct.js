if (window.location.href.includes("edit-product.html")) {
  retrieveSingleProductEdit();
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
      if (data.errors || data.status === "failed") {
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
function updateProduct (event) {
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
      if (data.errors || data.status === "failed") {
        messageText.innerHTML = `${data.message} !`;
      } else if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      } else {
        messageText.innerHTML = "success";
        window.location = `${baseUrlUi}UI/html/products.html`;
      }
    });
};
