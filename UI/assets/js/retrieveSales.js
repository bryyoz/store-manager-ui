if (window.location.href.includes("sales.html")) {
  retrieveAllSales();
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
      if (data.errors || data.status === "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.sales) {
        if (data.sales.length === 0) {
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
