const levels = [
    {
        id: "tutorial",
        title: "Tutorial",
        synopsis: "The Morning Routine: Welcome to the agency! Let's get your terminal online and find the Chief's journal.",
        completed: true,
        image: "../../Graphics/tutorial.png"
    },
    {
        id: "level1",
        title: "Level 1",
        synopsis: "The Crust & Crumb Bakery: A thief has struck! Catalog the remaining pastries to find a clue.",
        completed: false,
        image: "../../Graphics/level1.png"
    },
    {
        id: "level2",
        title: "Level 2",
        synopsis: "The Police Station: Search the precinct records and cross-reference suspects to catch the culprit.",
        completed: false,
        image: "../../Graphics/level2.png"
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
                    <div class="card-image-placeholder" style="background-image: url('${level.image}'); background-size: cover; background-position: center;">
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
