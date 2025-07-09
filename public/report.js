// Ensure DOM is fully loaded before executing anything
document.addEventListener("DOMContentLoaded", () => {
  // Load all loans on page load
  loadLoans();

  // Filter button click handler
  document.getElementById("filterBtn").addEventListener("click", () => {
    const status = document.getElementById("statusFilter").value;
    const bankName = document.getElementById("bankFilter").value;
    loadLoans(status, bankName);
  });
});

// Load and display loans (all or filtered)
async function loadLoans(status = "", bankName = "") {
  let url = "http://localhost:5000/api/loans/report?";
  if (status) url += `status=${encodeURIComponent(status)}&`;
  if (bankName) url += `bankName=${encodeURIComponent(bankName)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    // Check if response is an array or has a 'data' property
    const loans = Array.isArray(json) ? json : json.data;

    if (!Array.isArray(loans)) throw new Error("Invalid loan data");

    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    loans.forEach((loan) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2 border">${loan.fileNumber}</td>
        <td class="p-2 border">${loan.clientName}</td>
        <td class="p-2 border">${loan.contactNo}</td>
        <td class="p-2 border">${loan.executive}</td>
        <td class="p-2 border">${loan.bankRM}</td>
        <td class="p-2 border">${loan.product}</td>
        <td class="p-2 border">₹${Number(loan.loanAmount).toLocaleString()}</td>
        <td class="p-2 border">${loan.assetType}</td>
        <td class="p-2 border">${loan.tenor}</td>
        <td class="p-2 border">${loan.roi}%</td>
        <td class="p-2 border">${loan.bankName}</td>
        <td class="p-2 border">${loan.status}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading loans:", error);
    alert("Could not fetch loans. Please check server and try again.");
  }
}
