document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.querySelector(".loan-table tbody");

  try {
    const response = await fetch("http://localhost:5000/api/loans");
    const loans = await response.json();

    if (!Array.isArray(loans)) throw new Error("Invalid data");

    loans.forEach((loan) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${loan.fileNumber}</td>
        <td>${loan.clientName}</td>
        <td>${loan.executive}</td>
        <td>${loan.bankRM}</td>
        <td>${loan.product}</td>
        <td>₹${loan.loanAmount.toLocaleString()}</td>
        <td>${loan.assetType}</td>
        <td>${loan.tenor}</td>
        <td>${loan.roi}%</td>
        <td>${loan.bankName}</td>
        <td>${loan.status}</td>
       <td class="actions">
      <div class="action-buttons">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn" data-id="${loan.id || loan._id}">Delete</button>
      </div>
    </td>

      `;

      tableBody.appendChild(row);
    });

    // Handle delete and edit buttons
    tableBody.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        if (confirm("Are you sure you want to delete this loan?")) {
          try {
            const res = await fetch(`http://localhost:5000/api/loans/${id}`, {
              method: "DELETE",
            });

            if (res.ok) {
              e.target.closest("tr").remove();
            } else {
              alert("Failed to delete loan.");
            }
          } catch (error) {
            console.error(error);
            alert("Error deleting loan.");
          }
        }
      }

      // EDIT BUTTON CLICK
      if (e.target.classList.contains("edit-btn")) {
        const row = e.target.closest("tr");
        const loan = {
          id: row.querySelector(".delete-btn").dataset.id,
          fileNumber: row.children[0].innerText,
          clientName: row.children[1].innerText,
          executive: row.children[2].innerText,
          bankRM: row.children[3].innerText,
          product: row.children[4].innerText,
          loanAmount: parseFloat(row.children[5].innerText.replace(/[₹,]/g, '')),
          assetType: row.children[6].innerText,
          tenor: row.children[7].innerText,
          roi: parseFloat(row.children[8].innerText),        
          bankName: row.children[9].innerText,
          status: row.children[10].innerText,

        };
        openModal(loan);
      }
      
      
    });
  } catch (error) {
    console.error("Error fetching loans:", error);
    tableBody.innerHTML = "<tr><td colspan='7'>Failed to load loan applications.</td></tr>";
  }
});



// Modal open/close
function openModal(loan) {
  document.getElementById("edit-id").value = loan.id;
  document.getElementById("edit-fileNumber").value = loan.fileNumber;
  document.getElementById("edit-clientName").value = loan.clientName;
  document.getElementById("edit-executive").value = loan.executive;
  document.getElementById("edit-bankRM").value = loan.bankRM;
  document.getElementById("edit-product").value = loan.product;
  document.getElementById("edit-loanAmount").value = loan.loanAmount;
  document.getElementById("edit-assetType").value = loan.assetType;
  document.getElementById("edit-tenor").value = loan.tenor;
  document.getElementById("edit-roi").value = loan.roi;
  document.getElementById("edit-bankName").value = loan.bankName;
  document.getElementById("edit-status").value = loan.status;

  document.getElementById("editModal").style.display = "flex";
  document.body.style.overflow = "hidden"; 
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
  document.body.style.overflow = "auto"; 
}


// Modal form submit
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const updatedLoan = {
    fileNumber: document.getElementById("edit-fileNumber").value,
    clientName: document.getElementById("edit-clientName").value,
    executive: document.getElementById("edit-executive").value,
    bankRM: document.getElementById("edit-bankRM").value,
    product: document.getElementById("edit-product").value,
    loanAmount: parseFloat(document.getElementById("edit-loanAmount").value),
    assetType: document.getElementById("edit-assetType").value,
    tenor: parseInt(document.getElementById("edit-tenor").value),
    roi: parseFloat(document.getElementById("edit-roi").value),
    bankName: document.getElementById("edit-bankName").value,
    status: document.getElementById("edit-status").value,
  };

  try {
    const res = await fetch(`http://localhost:5000/api/loans/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedLoan),
    });

    if (res.ok) {
      closeModal();
      location.reload();
    } else {
      alert("Failed to update loan.");
    }
  } catch (error) {
    console.error(error);
    alert("Error updating loan.");
  }
});
