document.addEventListener("DOMContentLoaded", function () {
    fetch("/featured_prisoners.json")
        .then(response => response.json())
        .then(data => {
            const prisonersList = document.getElementById("prisoners-list");
            let selectedPrisoners = data;

            prisonersList.innerHTML = "";
            selectedPrisoners.forEach(prisoner => {
                const card = document.createElement("div");
                card.classList.add("prisoner-card");

                // Truncate bio to 500 characters
                const truncatedBio = prisoner.bio.length > 500
                    ? prisoner.bio.substring(0, 500) + "..."
                    : prisoner.bio;

                card.innerHTML = `
                    <a href="dynamicbio.html?id=${prisoner.id}" class="full-card-link"></a>
                    <img src="${prisoner.image_url}" alt="${prisoner.name}">
                    <div class="prisoner-name">${prisoner.name}</div>
                    <div class="prisoner-bio">${truncatedBio}</div>
                    <a href="dynamicbio.html?id=${prisoner.id}" class="profile-link">View Profile →</a>
                `;
                prisonersList.appendChild(card);
            });
        })
        .catch(error => console.error("Error loading prisoner data:", error));
});

