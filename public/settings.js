document.addEventListener("DOMContentLoaded", () => {
  const saveProfileBtn = document.querySelector('#profile button');
  const profileInputs = document.querySelectorAll('#profile input');
  const nameInput = profileInputs[0];
  const emailInput = profileInputs[1];
  const homeBtn = document.getElementById('homeBtn');
  const updatePasswordBtn = document.querySelector('#security + div button');
  const passwordInput = document.querySelector('#security + div input');
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  const userId = localStorage.getItem("userID");

  if (!userId) {
    alert(" User not logged in. Redirecting to login page.");
    window.location.href = "login.html";
    return;
  }

  //  Fetch user profile on page load
  fetch(`http://localhost:5000/api/users/${userId}`)
    .then(res => res.json())
    .then(user => {
      nameInput.value = user.name;
      emailInput.value = user.email;
    })
    .catch(err => {
      console.error("Failed to fetch user info:", err);
      alert("Error fetching user info.");
    });

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation function
  function isStrongPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Save Profile button logic
  saveProfileBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
      alert("Please fill in all profile fields.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    fetch(`http://localhost:5000/api/users/update-profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + data.error);
      }
    })
    .catch(error => {
      alert("Server error: " + error.message);
    });
  });

  // Update Password button logic
  updatePasswordBtn.addEventListener('click', () => {
    const newPassword = passwordInput.value.trim();

    if (!isStrongPassword(newPassword)) {
      alert("Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters.");
      return;
    }

    fetch(`http://localhost:5000/api/users/update-password/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: newPassword })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Password updated successfully!");
        passwordInput.value = '';
      } else {
        alert("Failed to update password: " + data.error);
      }
    })
    .catch(error => {
      alert("Server error: " + error.message);
    });
  });

  // Theme toggle logic
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("darkmode");
    } else {
      document.documentElement.classList.remove("darkmode");
    }
    localStorage.setItem("theme", theme);
  };

  themeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      applyTheme(radio.value);
    });
  });

  // Load and apply saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  const selectedThemeRadio = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);
  if (selectedThemeRadio) {
    selectedThemeRadio.checked = true;
    applyTheme(savedTheme);
  }

  // Home button redirect
  homeBtn.addEventListener('click', () => {
    window.location.href = 'admin.html'; 
  });
});
