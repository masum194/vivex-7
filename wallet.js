
let balance = 50000;
let income = 50000;
let expense = 0;

function updateWallet() {
    document.getElementById("balance").innerText = balance;
    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;
}

function addMoney() {

    let amount = Number(document.getElementById("addAmount").value);

    if (amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid amount");
        return;
    }

    balance += amount;
    income += amount;

    addTransaction("Money Added", amount, "income");

    document.getElementById("addAmount").value = "";

    updateWallet();
}

function withdrawMoney() {

    let amount = Number(document.getElementById("withdrawAmount").value);

    if (amount <= 0 || !Number.isFinite(amount)) {
        alert("Please enter a valid amount");
        return;
    }

    if (amount > balance) {
        alert("Insufficient Balance!");
        return;
    }

    balance -= amount;
    expense += amount;

    addTransaction("Money Withdrawn", amount, "expense");

    document.getElementById("withdrawAmount").value = "";

    updateWallet();
}

function addTransaction(title, amount, type) {

    const list = document.getElementById("transactionList");

    const emptyMessage = list.querySelector(".empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const item = document.createElement("div");

    item.className = "transaction-item";

    item.innerHTML = `
        <div>
            <strong>${title}</strong>
            <small>${new Date().toLocaleString()}</small>
        </div>

        <strong class="${type}-text">
            ${type === "income" ? "+" : "-"} ৳${amount}
        </strong>
    `;

    list.prepend(item);
}

updateWallet();
