if (window.location.href.includes("products.html")) {
  retrieveAllProducts();
}

function retrieveAllProducts () {
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
};
