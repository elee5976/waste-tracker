// script.js
document.addEventListener("DOMContentLoaded", () => {
    const wasteForm = document.getElementById("wasteForm");
    const paperWasteElement = document.getElementById("paperWaste");
    const plasticWasteElement = document.getElementById("plasticWaste");

    let paperWaste = 0;
    let plasticWaste = 0;

    wasteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const wasteType = document.getElementById("wasteType").value;
        const weight = prompt(`Enter the weight of ${wasteType} waste (in kg):`);
        if (!isNaN(weight) && weight > 0) {
            if (wasteType === "paper") {
                paperWaste += parseFloat(weight);
                paperWasteElement.textContent = paperWaste.toFixed(2);
            } else if (wasteType === "plastic") {
                plasticWaste += parseFloat(weight);
                plasticWasteElement.textContent = plasticWaste.toFixed(2);
            }
            // Update other waste type statistics here if needed
        } else {
            alert("Please enter a valid weight.");
        }
    });
});