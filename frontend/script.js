const API_URL = "https://contact-book-einy.onrender.com";


// ==================================================
// PAGE NAVIGATION
// ==================================================

const menuButtons =
    document.querySelectorAll(".menu-btn");

const pages =
    document.querySelectorAll(".page");


menuButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const pageId =
            button.dataset.page;


        pages.forEach(function(page) {

            page.classList.add("hidden");

        });


        document
            .getElementById(pageId)
            .classList.remove("hidden");


        if (pageId === "dashboardPage") {

            loadDashboard();

        }


        if (pageId === "viewPage") {

            loadContacts();

        }


        if (pageId === "favoritePage") {

            loadFavorites();

        }


        if (pageId === "groupPage") {

            loadGroups();

        }


        if (pageId === "statisticsPage") {

            loadStatistics();

        }


        if (pageId === "recentPage") {

            loadRecent();

        }

    });

});


// ==================================================
// ADD CONTACT
// ==================================================

const addForm =
    document.getElementById("addForm");


addForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "addName"
            ).value;


        const phone =
            document.getElementById(
                "addPhone"
            ).value;


        const email =
            document.getElementById(
                "addEmail"
            ).value;


        const group =
            document.getElementById(
                "addGroup"
            ).value;


        const response =
            await fetch(
                `${API_URL}/contacts`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        email: email,

                        group: group,

                        favorite: false

                    })

                }
            );


        const data =
            await response.json();


        const message =
            document.getElementById(
                "addMessage"
            );


        if (!response.ok) {

            message.textContent =
                data.detail ||
                "Something went wrong";

            message.style.color =
                "#f87171";

            return;

        }


        message.textContent =
            "✓ Contact added successfully!";

        message.style.color =
            "#6ee7b7";


        addForm.reset();

    }
);


// ==================================================
// VIEW CONTACTS
// ==================================================

async function loadContacts() {

    const response =
        await fetch(
            `${API_URL}/contacts`
        );


    const contacts =
        await response.json();


    displayContacts(
        contacts,
        document.getElementById(
            "contactList"
        ),
        true
    );

}


document
    .getElementById("refreshBtn")
    .addEventListener(
        "click",
        loadContacts
    );


// ==================================================
// DISPLAY CONTACTS
// ==================================================

function displayContacts(
    contacts,
    container,
    showFavorite = false
) {

    container.innerHTML = "";


    if (contacts.length === 0) {

        container.innerHTML =
            `
            <div class="empty">
                No contacts found.
            </div>
            `;

        return;
    }


    contacts.forEach(function(contact) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "contact-card";


        card.innerHTML = `

            ${
                showFavorite
                ?
                `
                <button
                    class="favorite-btn"
                    onclick="
                        toggleFavorite(
                            ${contact.id}
                        )
                    "
                >
                    ${
                        contact.favorite
                        ? "⭐"
                        : "☆"
                    }
                </button>
                `
                :
                ""
            }

            <h3>
                ${contact.name}
            </h3>

            <p>
                📞 ${contact.phone}
            </p>

            <p>
                ✉️ ${contact.email}
            </p>

            <p>
                🏷️ ${contact.group}
            </p>

            <p>
                ID: ${contact.id}
            </p>

        `;


        container.appendChild(card);

    });

}


// ==================================================
// FAVORITE
// ==================================================

async function toggleFavorite(id) {

    await fetch(
        `${API_URL}/contacts/${id}/favorite`,
        {
            method: "PATCH"
        }
    );


    loadContacts();

}


async function loadFavorites() {

    const response =
        await fetch(
            `${API_URL}/contacts/favorites`
        );


    const contacts =
        await response.json();


    displayContacts(
        contacts,
        document.getElementById(
            "favoriteList"
        ),
        true
    );

}


// ==================================================
// SEARCH
// ==================================================

let searchType = "name";


document
    .getElementById("searchNameBtn")
    .addEventListener(
        "click",
        function() {

            searchType = "name";

            document
                .getElementById(
                    "searchForm"
                )
                .classList.remove(
                    "hidden"
                );


            document
                .getElementById(
                    "searchInput"
                )
                .placeholder =
                "Enter name";

        }
    );


document
    .getElementById("searchPhoneBtn")
    .addEventListener(
        "click",
        function() {

            searchType = "phone";

            document
                .getElementById(
                    "searchForm"
                )
                .classList.remove(
                    "hidden"
                );


            document
                .getElementById(
                    "searchInput"
                )
                .placeholder =
                "Enter phone";

        }
    );


document
    .getElementById("searchForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const value =
                document.getElementById(
                    "searchInput"
                ).value;


            let url;


            if (searchType === "name") {

                url =
                    `${API_URL}/contacts/search/name/${encodeURIComponent(value)}`;

            } else {

                url =
                    `${API_URL}/contacts/search/phone/${encodeURIComponent(value)}`;

            }


            const response =
                await fetch(url);


            const results =
                await response.json();


            displayContacts(
                results,
                document.getElementById(
                    "searchResults"
                )
            );

        }
    );


// ==================================================
// UPDATE
// ==================================================

let updateType = "name";

let selectedContactId = null;


document
    .getElementById("updateNameBtn")
    .addEventListener(
        "click",
        function() {

            updateType = "name";

            document
                .getElementById(
                    "updateSearchForm"
                )
                .classList.remove(
                    "hidden"
                );

            document
                .getElementById(
                    "updateSearchInput"
                )
                .placeholder =
                "Enter name";

        }
    );


document
    .getElementById("updatePhoneBtn")
    .addEventListener(
        "click",
        function() {

            updateType = "phone";

            document
                .getElementById(
                    "updateSearchForm"
                )
                .classList.remove(
                    "hidden"
                );

            document
                .getElementById(
                    "updateSearchInput"
                )
                .placeholder =
                "Enter phone";

        }
    );


document
    .getElementById("updateSearchForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const value =
                document.getElementById(
                    "updateSearchInput"
                ).value;


            let url;


            if (updateType === "name") {

                url =
                    `${API_URL}/contacts/search/name/${encodeURIComponent(value)}`;

            } else {

                url =
                    `${API_URL}/contacts/search/phone/${encodeURIComponent(value)}`;

            }


            const response =
                await fetch(url);


            const results =
                await response.json();


            if (results.length === 0) {

                alert(
                    "Contact not found."
                );

                return;
            }


            const contact =
                results[0];


            selectedContactId =
                contact.id;


            document.getElementById(
                "editName"
            ).value =
                contact.name;


            document.getElementById(
                "editPhone"
            ).value =
                contact.phone;


            document.getElementById(
                "editEmail"
            ).value =
                contact.email;


            document.getElementById(
                "editGroup"
            ).value =
                contact.group;


            document
                .getElementById(
                    "editForm"
                )
                .classList.remove(
                    "hidden"
                );

        }
    );


document
    .getElementById("editForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const contact = {

                name:
                    document.getElementById(
                        "editName"
                    ).value,

                phone:
                    document.getElementById(
                        "editPhone"
                    ).value,

                email:
                    document.getElementById(
                        "editEmail"
                    ).value,

                group:
                    document.getElementById(
                        "editGroup"
                    ).value,

                favorite: false

            };


            const response =
                await fetch(
                    `${API_URL}/contacts/${selectedContactId}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                contact
                            )

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.detail ||
                    "Update failed"
                );

                return;
            }


            alert(
                "Contact updated successfully!"
            );


            document
                .getElementById(
                    "editForm"
                )
                .classList.add(
                    "hidden"
                );

        }
    );


// ==================================================
// DELETE
// ==================================================

let deleteType = "name";


document
    .getElementById("deleteNameBtn")
    .addEventListener(
        "click",
        function() {

            deleteType = "name";

            document
                .getElementById(
                    "deleteSearchForm"
                )
                .classList.remove(
                    "hidden"
                );

            document
                .getElementById(
                    "deleteSearchInput"
                )
                .placeholder =
                "Enter name";

        }
    );


document
    .getElementById("deletePhoneBtn")
    .addEventListener(
        "click",
        function() {

            deleteType = "phone";

            document
                .getElementById(
                    "deleteSearchForm"
                )
                .classList.remove(
                    "hidden"
                );

            document
                .getElementById(
                    "deleteSearchInput"
                )
                .placeholder =
                "Enter phone";

        }
    );


document
    .getElementById("deleteSearchForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const value =
                document.getElementById(
                    "deleteSearchInput"
                ).value;


            let url;


            if (deleteType === "name") {

                url =
                    `${API_URL}/contacts/search/name/${encodeURIComponent(value)}`;

            } else {

                url =
                    `${API_URL}/contacts/search/phone/${encodeURIComponent(value)}`;

            }


            const response =
                await fetch(url);


            const results =
                await response.json();


            const container =
                document.getElementById(
                    "deleteResults"
                );


            displayDeleteResults(
                results,
                container
            );

        }
    );


// ==================================================
// DELETE RESULT
// ==================================================

function displayDeleteResults(
    contacts,
    container
) {

    container.innerHTML = "";


    if (contacts.length === 0) {

        container.innerHTML =
            `
            <div class="empty">
                Contact not found.
            </div>
            `;

        return;
    }


    contacts.forEach(function(contact) {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "contact-card";


        card.innerHTML = `

            <h3>
                ${contact.name}
            </h3>

            <p>
                📞 ${contact.phone}
            </p>

            <p>
                ✉️ ${contact.email}
            </p>

            <button
                class="action-btn delete-btn"
                onclick="
                    deleteContact(
                        ${contact.id}
                    )
                "
            >
                🗑️ Delete
            </button>

        `;


        container.appendChild(card);

    });

}


async function deleteContact(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this contact?"
        );


    if (!confirmDelete) {

        return;

    }


    const response =
        await fetch(
            `${API_URL}/contacts/${id}`,
            {
                method: "DELETE"
            }
        );


    if (response.ok) {

        alert(
            "Contact deleted successfully!"
        );


        document.getElementById(
            "deleteResults"
        ).innerHTML = "";

    }

}


// ==================================================
// GROUPS
// ==================================================

async function loadGroups() {

    const response =
        await fetch(
            `${API_URL}/contacts/groups`
        );


    const groups =
        await response.json();


    const container =
        document.getElementById(
            "groupList"
        );


    container.innerHTML = "";


    for (
        const group in groups
    ) {

        container.innerHTML += `

            <div class="stat-card">

                <span>🏷️</span>

                <h3>
                    ${groups[group]}
                </h3>

                <p>
                    ${group}
                </p>

            </div>

        `;

    }

}


// ==================================================
// STATISTICS
// ==================================================

async function loadStatistics() {

    const response =
        await fetch(
            `${API_URL}/contacts/statistics`
        );


    const data =
        await response.json();


    const container =
        document.getElementById(
            "statisticsList"
        );


    container.innerHTML = `

        <div class="stat-card">

            <span>👥</span>

            <h3>
                ${data.total}
            </h3>

            <p>
                Total Contacts
            </p>

        </div>


        <div class="stat-card">

            <span>⭐</span>

            <h3>
                ${data.favorites}
            </h3>

            <p>
                Favorites
            </p>

        </div>


        <div class="stat-card">

            <span>🏷️</span>

            <h3>
                ${Object.keys(
                    data.groups
                ).length}
            </h3>

            <p>
                Groups
            </p>

        </div>

    `;

}


// ==================================================
// RECENT CONTACTS
// ==================================================

async function loadRecent() {

    const response =
        await fetch(
            `${API_URL}/contacts/recent`
        );


    const contacts =
        await response.json();


    displayContacts(
        contacts,
        document.getElementById(
            "recentList"
        )
    );

}


// ==================================================
// DASHBOARD
// ==================================================

async function loadDashboard() {

    const response =
        await fetch(
            `${API_URL}/contacts/statistics`
        );


    const data =
        await response.json();


    document.getElementById(
        "dashboardTotal"
    ).textContent =
        data.total;


    document.getElementById(
        "dashboardFavorites"
    ).textContent =
        data.favorites;


    document.getElementById(
        "dashboardGroups"
    ).textContent =
        Object.keys(
            data.groups
        ).length;


    const recentResponse =
        await fetch(
            `${API_URL}/contacts/recent`
        );


    const recent =
        await recentResponse.json();


    displayContacts(
        recent,
        document.getElementById(
            "dashboardRecent"
        )
    );

}


// ==================================================
// EXPORT CSV
// ==================================================

document
    .getElementById("exportBtn")
    .addEventListener(
        "click",
        async function() {

            const response =
                await fetch(
                    `${API_URL}/contacts`
                );


            const contacts =
                await response.json();


            if (contacts.length === 0) {

                alert(
                    "There are no contacts to export."
                );

                return;

            }


            let csv =
                "Name,Phone,Email,Group,Favorite\n";


            contacts.forEach(
                function(contact) {

                    csv +=
                        `"${contact.name}",` +
                        `"${contact.phone}",` +
                        `"${contact.email}",` +
                        `"${contact.group}",` +
                        `"${contact.favorite}"\n`;

                }
            );


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "contacts.csv";


            link.click();


            URL.revokeObjectURL(url);

        }
    );


// ==================================================
// LOAD DASHBOARD ON START
// ==================================================

loadDashboard();