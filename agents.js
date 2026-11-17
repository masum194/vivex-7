
/* ===== VIBEX AGENT ACCOUNT SYSTEM ===== */

// প্রথমবারের Demo Agents
const defaultAgents = [
    {
        id: 1,
        name: "Rahim Ahmed",
        phone: "01711111111",
        bills: 50000,
        received: 30000,
        history: [
            { type: "Bill Entry", amount: 50000, date: "17 Nov 2026" },
            { type: "Received", amount: 30000, date: "17 Nov 2026" }
        ]
    },
    {
        id: 2,
        name: "Karim Ahmed",
        phone: "01822222222",
        bills: 80000,
        received: 50000,
        history: [
            { type: "Bill Entry", amount: 80000, date: "16 Nov 2026" },
            { type: "Received", amount: 50000, date: "17 Nov 2026" }
        ]
    }
];

// Browser Storage
const STORAGE_KEY = "vibex_agents";

function loadAgents() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const data = JSON.parse(saved);
            return Array.isArray(data) ? data : defaultAgents;
        }
    } catch (error) {
        console.error("Agent data loading error:", error);
    }

    return defaultAgents;
}

let agents = loadAgents();

function saveAgents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

const agentList = document.getElementById("agentList");
const agentDetails = document.getElementById("agentDetails");

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatMoney(amount) {
    return Number(amount).toLocaleString("en-BD");
}

// ===== SHOW AGENTS =====

function showAgents(search = "") {

    agentList.innerHTML = "";

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.phone.includes(search)
    );

    if (filteredAgents.length === 0) {
        agentList.innerHTML = "<p>No Agent Found</p>";
        return;
    }

    filteredAgents.forEach(agent => {

        const due = agent.bills - agent.received;

        agentList.innerHTML += `
            <div class="agent-card">

                <h3>${escapeHTML(agent.name)}</h3>

                <p class="agent-phone">
                    ${escapeHTML(agent.phone)}
                </p>

                <div class="agent-card-summary">

                    <div class="agent-card-stat">
                        <small>Bill Entry</small>
                        <strong>৳${formatMoney(agent.bills)}</strong>
                    </div>

                    <div class="agent-card-stat">
                        <small>Receive</small>
                        <strong class="received-color">
                            ৳${formatMoney(agent.received)}
                        </strong>
                    </div>

                    <div class="agent-card-stat">
                        <small>Due</small>
                        <strong class="due-color">
                            ৳${formatMoney(due)}
                        </strong>
                    </div>

                </div>

                <button class="agent-history-link"
                    onclick="showDetails(${agent.id})">
                    All History →
                </button>

            </div>
        `;
    });
}

// ===== ADD NEW AGENT =====

function openAddAgent() {
    document.getElementById("addAgentForm").style.display = "block";
}

function closeAddAgent() {
    document.getElementById("addAgentForm").style.display = "none";
}

function addNewAgent() {

    const name = document.getElementById("newAgentName").value.trim();
    const phone = document.getElementById("newAgentPhone").value.trim();

    if (!name || !phone) {
        alert("Please enter agent name and phone number");
        return;
    }

    const newAgent = {
        id: Date.now(),
        name: name,
        phone: phone,
        bills: 0,
        received: 0,
        history: []
    };

    agents.push(newAgent);

    saveAgents();
    showAgents();

    document.getElementById("newAgentName").value = "";
    document.getElementById("newAgentPhone").value = "";

    closeAddAgent();

    alert("New Agent Added Successfully!");
}

// ===== AGENT FULL HISTORY =====

function showDetails(id) {

    const agent = agents.find(item => item.id === id);

    if (!agent) return;

    const due = agent.bills - agent.received;

    agentDetails.innerHTML = `
        <h2>${escapeHTML(agent.name)}</h2>

        <p>Phone: ${escapeHTML(agent.phone)}</p>

        <div class="agent-summary">

            <div class="agent-stat">
                <p>Bill Entry</p>
                <h2>৳${formatMoney(agent.bills)}</h2>
            </div>

            <div class="agent-stat">
                <p>Receive</p>
                <h2 class="green">
                    ৳${formatMoney(agent.received)}
                </h2>
            </div>

            <div class="agent-stat">
                <p>Due</p>
                <h2 class="red">
                    ৳${formatMoney(due)}
                </h2>
            </div>

        </div>

        <h3>Add Account Entry</h3>

        <div class="agent-form">

            <select id="entryType">
                <option value="Bill Entry">Bill Entry</option>
                <option value="Received">Receive</option>
            </select>

            <input
                type="number"
                id="entryAmount"
                placeholder="Enter Amount"
                min="1"
            >

            <button onclick="addEntry(${agent.id})">
                Save Entry
            </button>

        </div>

        <h3 class="history-title">All History</h3>

        <table class="agent-history">

            <thead>
                <tr>
                    <th>Date</th>
                    <th>Details</th>
                    <th>Amount</th>
                </tr>
            </thead>

            <tbody>
                ${agent.history.slice().reverse().map(item => `
                    <tr>
                        <td>${escapeHTML(item.date)}</td>
                        <td>${escapeHTML(item.type)}</td>
                        <td>৳${formatMoney(item.amount)}</td>
                    </tr>
                `).join("")}
            </tbody>

        </table>
    `;

    agentDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ===== ADD BILL / RECEIVE =====

function addEntry(id) {

    const agent = agents.find(item => item.id === id);

    if (!agent) return;

    const type = document.getElementById("entryType").value;
    const amount = Number(document.getElementById("entryAmount").value);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    if (type === "Received" && amount > agent.bills - agent.received) {
        alert("Received amount is greater than Due!");
        return;
    }

    if (type === "Bill Entry") {
        agent.bills += amount;
    } else {
        agent.received += amount;
    }

    agent.history.push({
        type: type,
        amount: amount,
        date: new Date().toLocaleDateString("en-GB")
    });

    // Save permanently in this browser
    saveAgents();

    showAgents();
    showDetails(id);

    alert("Account Saved Successfully!");
}

// ===== SEARCH AGENT =====

document.getElementById("searchAgent").addEventListener("input", function() {
    showAgents(this.value);
});

// ===== START SYSTEM =====

showAgents();
