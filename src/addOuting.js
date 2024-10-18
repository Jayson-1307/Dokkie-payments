const outingForm = document.getElementById('outingForm');
const outingButton = document.getElementById('outingNameSubmit');
const outingNameInput = document.getElementById('outingName');

const participantsSection = document.getElementById('participantForm');
const participantButton = document.getElementById('participantSubmit');
const participantInput = document.getElementById('participantName');

const submitOutingButton = document.getElementById('submitOuting');

let outingName = '';
let participants = []; 
let activities = [];  // Initialize activities array for future use

console.log(localStorage.getItem('outings'));

// Load outings from localStorage (or initialize to an empty array if none exist)
function loadOutings() {
    return JSON.parse(localStorage.getItem('outings')) || [];
}

// Save outings to localStorage
function saveOutings(outings) {
    localStorage.setItem('outings', JSON.stringify(outings));
}

// Get the next outing ID (using a simple counter stored in localStorage)
function getNextOutingId() {
    let currentId = parseInt(localStorage.getItem('outingIdCounter')) || 1;
    localStorage.setItem('outingIdCounter', currentId + 1);  // Increment the counter
    return currentId;
}

// Add a new outing to localStorage
function addOuting() {
    const outings = loadOutings();  // Get existing outings
    const newOuting = {
        id: getNextOutingId(),  // Get an incremental unique ID for the outing
        name: outingName,
        participants: participants,
        activities: activities  // Initialize as an empty array, ready to store future activities
    };
    outings.push(newOuting);  // Add new outing to the array
    saveOutings(outings);  // Save the updated outings array to localStorage
}

if (!outingName) {
    participantsSection.style.display = 'none';  // Initially hide the participants section
}

// Outing submission button event
outingButton.addEventListener('click', () => {
    if (outingNameInput.value === '') {
        alert('Please enter a valid outing name');
    } else {
        outingName = outingNameInput.value;  // Set outing name from input
        participants = [];  // Reset participants for the new outing
        activities = [];  // Reset activities for the new outing
        participantsSection.style.display = 'block';  // Show participants section
        outingForm.style.display = 'none';  // Hide outing name form
        console.log(outingName);
    }
});

// Participant submission button event
participantButton.addEventListener('click', () => {
    if (participantInput.value === '') {
        alert('Please enter a participant name');
    } else {
        participants.push(participantInput.value);  // Add participant to the array
        participantInput.value = '';  // Clear the input field
        console.log(participants);
    }
});

// Submit outing button event
submitOutingButton.addEventListener('click', () => {
    if (participants.length < 2) {
        alert('Please add at least 2 participants');
    } else {
        addOuting();  // Add the outing to localStorage
        const outings = loadOutings();  // Load outings to get the latest one
        const latestOuting = outings[outings.length - 1];  // Get the most recent outing
        window.location.href = `outingDetail.html?id=${latestOuting.id}`;  // Redirect with outing ID
    }
});
