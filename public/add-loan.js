document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loanForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      fileNumber: document.getElementById("fileNumber").value,
      clientName: document.getElementById("clientName").value,
      executive: document.getElementById("executive").value,
      bankRM: document.getElementById("bankRM").value,
      product: document.getElementById("product").value,
      loanAmount: parseFloat(document.getElementById("loanAmount").value),
      assetType: document.getElementById("assetType").value,
      tenor: parseInt(document.getElementById("tenor").value),
      roi: parseFloat(document.getElementById("roi").value),
      bankName: document.getElementById("bankName").value,
      status: document.getElementById("status").value
    };

    try {
      const response = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Loan added successfully!");
        window.location.href="loan_applications.html";
      } else {
        alert("Failed to add loan: " + result.message);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
});
