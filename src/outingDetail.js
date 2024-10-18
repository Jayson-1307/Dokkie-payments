// Get the outing ID from the query parameters
function getOutingIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load outings from localStorage (same as before)
function loadOutings() {
    return JSON.parse(localStorage.getItem('outings')) || [];
}

// Save updated outings to localStorage (same as before)
function saveOutings(outings) {
    localStorage.setItem('outings', JSON.stringify(outings));
}

// Find the specific outing by its ID
function getOutingById(id) {
    const outings = loadOutings();
    return outings.find(outing => outing.id == id);
}

// Render outing details on the page
function renderOutingDetails(outing) {
    const outingDetailsDiv = document.getElementById('outingDetails');
    outingDetailsDiv.innerHTML = `
        <h2>${outing.name}</h2>
        <p>Participants: ${outing.participants.join(', ')}</p>
    `;

    // Populate the "Paid By" select dropdown
    populatePaidByDropdown(outing.participants);

    // Render activities and participant spending
    renderActivities(outing.activities);
    renderParticipantSpending(outing);
    renderOwingCalculations(outing);
}

// Populate the "Paid By" select dropdown with participant names
function populatePaidByDropdown(participants) {
    const paidBySelect = document.getElementById('activityPaidBy');
    paidBySelect.innerHTML = '';  // Clear any existing options

    participants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;
        paidBySelect.appendChild(option);
    });
}

// Render activities on the page
function renderActivities(activities) {
    const activitiesListDiv = document.getElementById('activitiesList');
    activitiesListDiv.innerHTML = activities.map(activity => `
        <p>
            <strong>${activity.title}</strong><br>
            Price: $${activity.price.toFixed(2)}<br>
            Paid By: ${activity.paidBy}
        </p>
    `).join('');
}

// Render participant spending
function renderParticipantSpending(outing) {
    const participantSpendingDiv = document.getElementById('participantSpending');
    
    // Calculate how much each participant spent
    const spendingMap = outing.participants.reduce((acc, participant) => {
        acc[participant] = 0;
        return acc;
    }, {});

    // Add up the spending for each participant
    outing.activities.forEach(activity => {
        if (spendingMap[activity.paidBy] !== undefined) {
            spendingMap[activity.paidBy] += activity.price;
        }
    });

    // Display the spending for each participant
    participantSpendingDiv.innerHTML = outing.participants.map(participant => `
        <p>${participant}: $${spendingMap[participant].toFixed(2)} spent</p>
    `).join('');
}

// Calculate and display how much each participant owes or is owed and generate payment transactions
function renderOwingCalculations(outing) {
    const owingDiv = document.getElementById('owingCalculations');
    const totalSpent = outing.activities.reduce((total, activity) => total + activity.price, 0);
    const numParticipants = outing.participants.length;
    const fairShare = totalSpent / numParticipants;

    // Calculate each participant's balance (spent - fair share)
    const balanceMap = outing.participants.reduce((acc, participant) => {
        acc[participant] = 0;
        return acc;
    }, {});

    outing.activities.forEach(activity => {
        if (balanceMap[activity.paidBy] !== undefined) {
            balanceMap[activity.paidBy] += activity.price;
        }
    });

    // Subtract fair share from what each participant spent to calculate balance
    outing.participants.forEach(participant => {
        balanceMap[participant] -= fairShare; // Subtract fair share
    });

    // Split participants into those who owe and those who are owed
    const owesMoney = [];
    const isOwedMoney = [];

    outing.participants.forEach(participant => {
        const balance = balanceMap[participant];
        if (balance < 0) {
            owesMoney.push({ name: participant, amount: Math.abs(balance) }); // They owe money
        } else if (balance > 0) {
            isOwedMoney.push({ name: participant, amount: balance }); // They are owed money
        }
    });

    // Generate the payment transactions (who owes whom and how much)
    const transactions = [];
    let i = 0;
    let j = 0;

    while (i < owesMoney.length && j < isOwedMoney.length) {
        const owe = owesMoney[i];
        const owed = isOwedMoney[j];

        const payment = Math.min(owe.amount, owed.amount);

        transactions.push(`${owe.name} pays ${owed.name} $${payment.toFixed(2)}`);

        owe.amount -= payment;
        owed.amount -= payment;

        if (owe.amount === 0) i++; // Move to the next person who owes
        if (owed.amount === 0) j++; // Move to the next person who is owed
    }

    // Generate HTML for the owing summary and payment transactions
    let owingHTML = '<h3>Owing Summary</h3>';

    if (transactions.length === 0) {
        owingHTML += '<p>Everyone is settled up.</p>';
    } else {
        owingHTML += '<ul>';
        transactions.forEach(transaction => {
            owingHTML += `<li>${transaction}</li>`;
        });
        owingHTML += '</ul>';
    }

    owingDiv.innerHTML = owingHTML;
}

// Add activity to the outing and save it in localStorage
function addActivityToOuting(outing) {
    const title = document.getElementById('activityTitle').value;
    const price = document.getElementById('activityPrice').value;
    const paidBy = document.getElementById('activityPaidBy').value;  // Get selected participant

    if (title && price && paidBy) {
        const newActivity = {
            title: title,
            price: parseFloat(price),
            paidBy: paidBy
        };

        outing.activities.push(newActivity);  // Add new activity to the outing

        // Save updated outings back to localStorage
        const outings = loadOutings();
        const updatedOutings = outings.map(o => (o.id === outing.id ? outing : o));
        saveOutings(updatedOutings);

        // Re-render the updated activities, participant spending, and owing calculations
        renderActivities(outing.activities);
        renderParticipantSpending(outing);
        renderOwingCalculations(outing);

        // Clear input fields after submission
        document.getElementById('activityForm').reset();
    } else {
        alert('Please fill in all the fields.');
    }
}

// Add new participant to the outing
function addParticipantToOuting(outing) {
    const newParticipant = document.getElementById('newParticipant').value;
    
    if (newParticipant && !outing.participants.includes(newParticipant)) {
        outing.participants.push(newParticipant);  // Add new participant to the outing

        // Save updated outings back to localStorage
        const outings = loadOutings();
        const updatedOutings = outings.map(o => (o.id === outing.id ? outing : o));
        saveOutings(updatedOutings);

        // Re-render the participant dropdown, outing details, and owing calculations
        populatePaidByDropdown(outing.participants);
        renderOutingDetails(outing);
        renderParticipantSpending(outing);
        renderOwingCalculations(outing);

        // Clear input field after submission
        document.getElementById('participantForm').reset();
    } else {
        alert('Please enter a unique participant name.');
    }
}

// Main logic to load the outing details and handle activity addition and participant addition
document.addEventListener('DOMContentLoaded', () => {
    const outingId = getOutingIdFromURL();
    if (!outingId) {
        alert('No outing ID found.');
        return;
    }

    const outing = getOutingById(outingId);
    if (!outing) {
        alert('Outing not found.');
        return;
    }

    renderOutingDetails(outing);

    // Handle activity addition
    const addActivityButton = document.getElementById('addActivityButton');
    addActivityButton.addEventListener('click', () => addActivityToOuting(outing));

    // Handle new participant addition
    const addParticipantButton = document.getElementById('addParticipantButton');
    addParticipantButton.addEventListener('click', () => addParticipantToOuting(outing));
});
