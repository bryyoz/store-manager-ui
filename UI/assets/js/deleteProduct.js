
function deleteProduct (id) {
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
          if (data.errors || data.status === "failed") {
            alert(`${data.message} !`);
          }
          if (data.msg) {
            alert(`${data.msg}, Kindly sign in or register !`);
          }
          if (data.status === "ok") {
            window.location = `${baseUrlUi}UI/html/products.html`;
            alert(`product id ${id} has been deleted`);
          }
        });
    }
  }
