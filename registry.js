document.addEventListener("DOMContentLoaded", function () {
    fetch("prisoners.json")
        .then(response => response.json())
        .then(data => {
            const prisonersList = document.getElementById("prisoners-list");
            const searchInput = document.getElementById("search-name");
            const stateFilter = document.getElementById("search-state");

            // Extract unique states
            const states = [...new Set(data.map(prisoner => prisoner.state))].sort();
            
            // Populate state dropdown dynamically
            stateFilter.innerHTML = `<option value="">All States</option>`;
            states.forEach(state => {
                const option = document.createElement("option");
                option.value = state;
                option.textContent = state;
                stateFilter.appendChild(option);
            });

            function displayPrisoners(filteredData) {
                prisonersList.innerHTML = "";
                if (filteredData.length === 0) {
                    prisonersList.innerHTML = "<p>No prisoners found.</p>";
                    return;
                }
                
                filteredData.forEach(prisoner => {
                    const card = document.createElement("div");
                    card.classList.add("prisoner-card");
                    card.innerHTML = `
                        <a href="${prisoner.profile_link}" class="full-card-link"></a>
                        <img src="${prisoner.image_url}" alt="${prisoner.name}">
                        <div class="prisoner-name">${prisoner.name}</div>
                        <div class="prisoner-bio">${prisoner.bio}</div>
                        <div class="prisoner-state">State: ${prisoner.state}</div>
                        <a href="${prisoner.profile_link}" class="profile-link">View Profile →</a>
                    `;
                    prisonersList.appendChild(card);
                });
            }

            // Display all prisoners on initial load
            displayPrisoners(data);

            // Search & filter logic
            function filterPrisoners() {
                let searchValue = searchInput.value.toLowerCase();
                let stateValue = stateFilter.value;

                let filteredData = data.filter(prisoner => {
                    let matchesName = prisoner.name.toLowerCase().includes(searchValue);
                    let matchesState = stateValue === "" || prisoner.state === stateValue;
                    return matchesName && matchesState;
                });

                displayPrisoners(filteredData);
            }

            searchInput.addEventListener("input", filterPrisoners);
            stateFilter.addEventListener("change", filterPrisoners);
        })
        .catch(error => console.error("Error loading prisoner data:", error));
});
