let editId = null;
// Load interns when the button is clicked
document.getElementById("loadBtn").addEventListener("click", loadInterns);

// Add intern when the button is clicked
document.getElementById("addBtn").addEventListener("click", addIntern);

// Function to load interns
async function loadInterns() {
    try {
        const response = await fetch("http://localhost:5000/api/interns");
        const interns = await response.json();

        const internList = document.getElementById("internList");
        internList.innerHTML = "";

      document.getElementById("totalInterns").textContent = interns.length;
      const departments = [...new Set(interns.map(intern => intern.department))];

document.getElementById("totalDepartments").textContent = departments.length;

interns.forEach(intern => {

    internList.innerHTML += `
        <tr>
            <td>${intern.id}</td>
            <td>${intern.name}</td>
            <td>${intern.department}</td>
            <td>
                <button
                    class="btn btn-warning btn-sm"
                    onclick="editIntern(${intern.id})">
                    Edit
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteIntern(${intern.id})">
                    Delete
                </button>
            </td>
        </tr>
    `;

});

    } catch (error) {
        console.error(error);
        alert("Error loading interns!");
    }
}

// Function to add a new intern
async function addIntern() {

    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;

    if (name === "" || department === "") {
       showMessage("Please enter all fields.", "warning");
        return;
    }

    try {

        let url = "http://localhost:5000/api/interns";
        let method = "POST";

        // If editing, use PUT
        if (editId !== null) {
            url = `http://localhost:5000/api/interns/${editId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                department
            })
        });

        const data = await response.json();

        alert(data.message);

        // Clear form
        document.getElementById("name").value = "";
        document.getElementById("department").value = "";

        // Reset edit mode
        editId = null;
        document.getElementById("addBtn").textContent = "Add Intern";

        // Reload interns
        loadInterns();

    } catch (error) {
        console.error(error);
        alert("Something went wrong!");
    }
}
async function deleteIntern(id) {

    const confirmDelete = confirm("Are you sure you want to delete this intern?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`http://localhost:5000/api/interns/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

       showMessage(data.message, "success");

        loadInterns();

    } catch (error) {

        console.error(error);
       showMessage("Error deleting intern.", "danger");

    }
}
function editIntern(id) {

    editId = id;

    fetch("http://localhost:5000/api/interns")
        .then(response => response.json())
        .then(interns => {

            const intern = interns.find(i => i.id === id);

            document.getElementById("name").value = intern.name;
            document.getElementById("department").value = intern.department;

            document.getElementById("addBtn").textContent = "Update Intern";
        });

}

document.getElementById("search").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = document.querySelectorAll("#internList tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";

    });

});
function showMessage(message, type) {

    document.getElementById("message").innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    setTimeout(() => {
        document.getElementById("message").innerHTML = "";
    }, 3000);
}