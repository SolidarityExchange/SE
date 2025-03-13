document.addEventListener("DOMContentLoaded", function () {
    fetch("https://solidarityexchange.github.io/SE/featured_prisoners.json")
        .then(response => response.json())
        .then(data => {
            const prisonersList = document.getElementById("prisoners-list");

            // Check if a selection is already stored for this week
            let savedSelection = localStorage.getItem("weeklyPrisoners");
            let savedWeek = localStorage.getItem("selectionWeek");

            let currentWeek = getCurrentWeekNumber(); // Get the current week number

            if (savedSelection && savedWeek == currentWeek) {
                // Use the stored selection if it's still the same week
                var selectedPrisoners = JSON.parse(savedSelection);
            } else {
                // Otherwise, pick new random prisoners and store them
                selectedPrisoners = getRandomPrisoners(data, 3);
                localStorage.setItem("weeklyPrisoners", JSON.stringify(selectedPrisoners));
                localStorage.setItem("selectionWeek", currentWeek);
            }

            // Display the selected prisoners
            prisonersList.innerHTML = "";
            selectedPrisoners.forEach(prisoner => {
                const card = document.createElement("div");
                card.classList.add("prisoner-card");
                card.innerHTML = `
                    <a href="${prisoner.profile_link}" class="full-card-link"></a>
                    <img src="${prisoner.image_url}" alt="${prisoner.name}">
                    <div class="prisoner-name">${prisoner.name}</div>
                    <div class="prisoner-bio">${prisoner.bio}</div>
                    <a href="${prisoner.profile_link}" class="profile-link">View Profile →</a>
                `;
                prisonersList.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading prisoner data:", error));
});

// Function to get the current week number of the year
function getCurrentWeekNumber() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDays = (now - startOfYear) / 86400000;
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
}

// Function to get random prisoners
function getRandomPrisoners(array, num) {
    let shuffled = array.sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, num); // Return first `num` prisoners
}
