document.addEventListener("DOMContentLoaded", function () {
    fetch("https://solidarityexchange.github.io/SE/featured_prisoners.json")
        .then(response => response.json())
        .then(data => {
            const prisonersList = document.getElementById("prisoners-list");

            // Use the featured prisoners directly from the JSON file
            let selectedPrisoners = data;

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
