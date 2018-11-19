// Javascript code to consume the API
// Constants
const baseUrl = "https://stoman.herokuapp.com/api/v2";
// const baseUrlUi = "https://waracci.github.io/store-manager-ui/";
const baseUrlUi = "http://127.0.0.1:5500/"

// Onpage Load Method
const checkPageCredentials = () => {
  // Contains all page checks before load
  checkAccessToken();
  
  
  
  
  if (window.location.href.includes("logout.html")) {
    logout();
  }
}

const checkAccessToken = () => {
  accessToken = localStorage.getItem("token");
  if (!accessToken || accessToken.includes("undefined")) {
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

const retrieveToken = () => {
  if (localStorage.getItem("token")) {
    return `Bearer ${localStorage.getItem("token")}`;
  } else {
    return;
  }
}



const messageText = document.getElementById("messages");

const logout = () => {
  fetch(`${baseUrl}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: retrieveToken()
    }
  })
    .then(res => res.json())
    .then(data => {
      localStorage.removeItem("token");
      window.location = `${baseUrlUi}UI/html/login.html`;
    });
}








