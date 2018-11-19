if (window.location.href.includes("add-attendant.html")) {
  fetchAllAttendants();
}
regForm = document.getElementById("form-register");
if (regForm) {
  regForm.addEventListener("submit", userRegister);
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
      if (data.errors || data.status === "failed") {
        messageText.innerHTML = `${data.message} !`;
      }
      if (data.msg) {
        messageText.innerHTML = `${data.msg}, Kindly sign in or register !`;
      }
      if (data.attendants) {
        if (data.attendants.length === 0) {
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
