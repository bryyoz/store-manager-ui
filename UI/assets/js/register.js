regForm = document.getElementById("form-register");
if (regForm) {
  regForm.addEventListener("submit", userRegister);
}
function userRegister (event) {
    event.preventDefault();
    // Dom Elements
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirmPassword").value;
    try {
      var role = document.getElementsByName("role")[0].value;
    } catch (error) {
      role = "attendant";
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
        if (data.status === "failed") {
          messageText.innerHTML = `${data.message} !`;
        } else {
          messageText.innerHTML = "Attendant created!";
          window.location = `${baseUrlUi}UI/html/add-attendant.html`;
        }
      });
  }
