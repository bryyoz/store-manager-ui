loginForm = document.getElementById("form-login");

if (loginForm) {
  loginForm.addEventListener("submit", userLogin);
}
function userLogin (event) {
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
        if (data.status === "failed") {
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
            alert("browser does not support local storage");
          }
        }
      });
  }
