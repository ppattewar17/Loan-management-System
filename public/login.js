document.getElementById("login-form").addEventListener("submit", async function(e){
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try{
    const response = await fetch("http://localhost:5000/api/auth/login",{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email, password})
    });

    const data = await response.json();
    if(response.ok){
      localStorage.setItem("token", data.token);
      localStorage.setItem("userID", data.user._id); 

      alert("Login Successful! Redirecting to Home Page...");
      window.location.href="admin.html";
    }else{
      alert(data.message);
    }
  }catch(error){
    console.error("Error: ",error);
    alert("Something went wrong. Please try again.");
  }

});