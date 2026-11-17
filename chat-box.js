
// VIBEX CHAT BOX JAVASCRIPT

let selectedAudience = "Agent";
let selectedRecipient = "";

const contacts = [
    { name: "Rahim Ahmed", type: "Agent" },
    { name: "Karim Travels", type: "Business" },
    { name: "Abdullah", type: "Agent" },
    { name: "Sakib Hasan", type: "Agent" },
    { name: "Customer 01", type: "Customer" },
    { name: "Customer 02", type: "Customer" }
];


// Select Audience
function selectAudience(button) {

    selectedAudience = button.dataset.audience;
    selectedRecipient = "";

    document.querySelectorAll(".audience-option")
        .forEach(option => {
            option.classList.remove("selected");
        });

    button.classList.add("selected");

    document.getElementById("selectedLabel").textContent =
        "Selected: " + selectedAudience;
}


// Search Contacts
const searchInput = document.getElementById("recipientSearch");

searchInput.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();
    const results = document.getElementById("searchResults");

    results.innerHTML = "";

    if (searchValue.trim() === "") {
        return;
    }

    const matchedContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchValue) ||
        contact.type.toLowerCase().includes(searchValue)
    );

    if (matchedContacts.length === 0) {
        results.textContent = "No contacts found.";
        return;
    }

    matchedContacts.forEach(contact => {

        const resultButton = document.createElement("button");
        resultButton.className = "search-result";

        resultButton.textContent =
            contact.name + " — " + contact.type;

        resultButton.onclick = function () {

            selectedRecipient = contact.name;

            selectedAudience = contact.type;

            document.getElementById("selectedLabel").textContent =
                "Selected: " + contact.name;

            document.querySelectorAll(".audience-option")
                .forEach(option => {
                    option.classList.toggle(
                        "selected",
                        option.dataset.audience === contact.type
                    );
                });

            results.innerHTML = "";
            searchInput.value = contact.name;
        };

        results.appendChild(resultButton);
    });
});


// Send Message
function sendMessage() {

    const messageInput = document.getElementById("messageText");
    const message = messageInput.value.trim();

    if (message === "") {
        alert("Please write a message first!");
        return;
    }

    const recipient = selectedRecipient || selectedAudience;

    const history = document.getElementById("historyList");

    const emptyMessage = history.querySelector(".empty-history");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const item = document.createElement("div");
    item.className = "history-item";

    const title = document.createElement("strong");
    title.textContent = "To: " + recipient;

    const content = document.createElement("p");
    content.textContent = message;

    const time = document.createElement("small");
    time.textContent = "Sent: " + new Date().toLocaleString();

    item.appendChild(title);
    item.appendChild(content);
    item.appendChild(time);

    history.prepend(item);

    messageInput.value = "";

    document.getElementById("sendStatus").textContent =
        "Message added to demo history successfully!";
}
