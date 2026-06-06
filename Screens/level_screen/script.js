const levels = [
    {
        id: "tutorial",
        title: "Tutorial",
        synopsis: "The Office: Welcome to the agency! Let's get your terminal online and read the Bunny's journal. Look around the room and find hidden items with simple code!",
        completed: true
    },
    {
        id: "level1",
        title: "Level 1",
        synopsis: "The Crust & Crumb Bakery: A thief has struck! Catalog and sort the remaining pastries to find clues and give a hoof to our Sheep Baker friend.",
        completed: false
    },
    {
        id: "level2",
        title: "Level 2",
        synopsis: "The Police Station: Theres a witness! Listen the wittness statements and cross-reference suspects to try-catch the culprit.",
        completed: false
    }
];

function initLevels() {
    const carousel = document.getElementById('cards-carousel');
    carousel.innerHTML = ''; // Clear existing content

    levels.forEach((level, index) => {
        const isCompleted = level.completed ? 'completed' : '';
        const cardHTML = `
            <div class="card-container">
                <div class="level-card" onclick="selectCard(${index})" id="card-${index}">
                    <div class="card-image-placeholder">
                        <div class="status-dot ${isCompleted}"></div>
                    </div>
                    <div class="card-header">
                        <span>${level.title}</span>
                    </div>
                </div>
            </div>
        `;
        carousel.insertAdjacentHTML('beforeend', cardHTML);
    });

    if (levels.length > 0) {
        selectCard(0);
    }
}

function selectCard(index) {
    // Remove active class from all cards
    document.querySelectorAll('.level-card').forEach(card => card.classList.remove('active'));
    
    // Add active class to the clicked card
    const cardElement = document.getElementById(`card-${index}`);
    if (cardElement) {
        cardElement.classList.add('active');
    }

    const level = levels[index];

    // Find the overview box
    const overviewBox = document.getElementById('overview-box');

    // Inject the new HTML into the overview box, including the button
    overviewBox.innerHTML = `
        <h3>${level.title}</h3>
        <p>${level.synopsis}</p>
        <a href="../../src/game.html?level=${level.id}" class="action-button">Play</a>
    `;
}

// Initialize the screen when the page loads
window.onload = initLevels;
