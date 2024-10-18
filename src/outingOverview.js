// Load outings from localStorage
function loadOutings() {
    return JSON.parse(localStorage.getItem('outings')) || [];
}

// Render the list of outings
function renderOutingsList() {
    const outings = loadOutings();
    const outingsListDiv = document.getElementById('outingsList');

    if (outings.length === 0) {
        outingsListDiv.innerHTML = '<p>No outings available. Please create an outing first.</p>';
        return;
    }

    // Create clickable links for each outing
    outingsListDiv.innerHTML = outings.map(outing => `
        <div>
            <h3>${outing.name}</h3>
            <button class="btn btn-primary" onclick="goToOutingDetail(${outing.id})">View Details</button>
        </div>
    `).join('');
}

// Attach goToOutingDetail to the global window object
window.goToOutingDetail = function(outingId) {
    window.location.href = `outingDetail.html?id=${outingId}`;
}

// Load the outings list when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderOutingsList();
});
