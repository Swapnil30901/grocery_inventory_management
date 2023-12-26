document.addEventListener("DOMContentLoaded", () => {
    const addItemForm = document.getElementById("addItemForm");
    const inventoryList = document.getElementById("inventoryList");
    const errorMessage = document.getElementById("errorMessage");

    addItemForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const itemName = document.getElementById("itemName").value;
        const itemQuantity = document.getElementById("itemQuantity").value;

        try {
            const response = await fetch("http://localhost:3000/add-item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error);
            }

            // Clear form fields and error message
            document.getElementById("itemName").value = "";
            document.getElementById("itemQuantity").value = "";
            errorMessage.textContent = "";

            // Refresh inventory list
            fetchInventory();
        } catch (error) {
            console.error("Error adding item:", error);
            errorMessage.textContent = error.message;
        }
    });

    async function fetchInventory() {
        try {
            const response = await fetch("http://localhost:3000/get-items");
            const result = await response.json();

            // Display inventory
            inventoryList.innerHTML = result.inventory
                .map(
                    (item) => `<li class="title">${item.name} ${item.quantity}</li>`
                )
                .join("");
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    }

    // Initial fetch of inventory
    fetchInventory();
});