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

            // Truncate HTML-rich bios without breaking tags
            function truncateHTML(html, maxChars, readMoreLink) {
                let div = document.createElement("div");
                div.innerHTML = html;

                let totalChars = 0;
                let stop = false;

                function walk(node) {
                    if (stop) return null;
                    let clone = node.cloneNode(false);

                    if (node.nodeType === Node.TEXT_NODE) {
                        if (totalChars + node.length > maxChars) {
                            clone.textContent = node.textContent.slice(0, maxChars - totalChars) + "... ";
                            stop = true;
                        } else {
                            clone.textContent = node.textContent;
                        }
                        totalChars += clone.textContent.length;
                        return clone;
                    }

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        for (let child of node.childNodes) {
                            let newChild = walk(child);
                            if (newChild) clone.appendChild(newChild);
                            if (stop) break;
                        }
                        return clone;
                    }

                    return null;
                }

                let result = walk(div);
                if (result && readMoreLink) {
                    let readMoreAnchor = document.createElement("a");
                    readMoreAnchor.href = readMoreLink;
                    readMoreAnchor.className = "read-more";
                    readMoreAnchor.textContent = "(Read more)";
                    result.appendChild(document.createTextNode(" "));
                    result.appendChild(readMoreAnchor);
                }

                return result.innerHTML;
            }

            // Display prisoner cards
            function displayPrisoners(filteredData) {
                prisonersList.innerHTML = "";
                if (filteredData.length === 0) {
                    prisonersList.innerHTML = "<p>No prisoners found.</p>";
                    return;
                }

                filteredData.forEach(prisoner => {
                    const card = document.createElement("div");
                    card.classList.add("prisoner-card");

                    const showLink = `dynamicbio.html?id=${prisoner.id}`;
                    const bioHTML = prisoner.bio.length > 500
                        ? truncateHTML(prisoner.bio, 500, showLink)
                        : prisoner.bio;

                    card.innerHTML = `
                        <a href="${showLink}" class="full-card-link"></a>
                        <img src="${prisoner.image_url}" alt="${prisoner.name}">
                        <div class="prisoner-name">${prisoner.name}</div>
                        <div class="prisoner-bio">${bioHTML}</div>
                        <div class="prisoner-state">State: ${prisoner.state}</div>
                        <a href="${showLink}" class="profile-link">View Profile →</a>
                    `;
                    prisonersList.appendChild(card);
                });
            }

            // Initial display
            displayPrisoners(data);

            // Filter logic
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

            // Event listeners
            searchInput.addEventListener("input", filterPrisoners);
            stateFilter.addEventListener("change", filterPrisoners);
        })
        .catch(error => console.error("Error loading prisoner data:", error));
});
