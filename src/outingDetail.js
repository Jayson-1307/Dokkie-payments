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

    // Render the existing activities
    renderActivities(outing.activities);
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
            Price: $${activity.price}<br>
            Paid By: ${activity.paidBy}
        </p>
    `).join('');
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

        // Re-render the updated activities
        renderActivities(outing.activities);

        // Clear input fields after submission
        document.getElementById('activityForm').reset();
    } else {
        alert('Please fill in all the fields.');
    }
}

// Main logic to load the outing details and handle activity addition
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
});
