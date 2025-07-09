document.getElementById("signup-form").addEventListener("submit",async function (e){
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try{
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({name, email, password})
    });

    const data = await response.json();
    if(response.ok){
      alert("Signup successful! Redirecting to Login Page...");
      window.location.href="login.html";
    }else{
      alert(data.message);
    }
  }catch(error){
    console.error("Error:",error);
    alert("Something went wrong. Please try again.");
  }

});