const levels = [
    {
        id: "level1",
        title: "Level 1",
        synopsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        completed: true
    },
    {
        id: "level2",
        title: "Level 2",
        synopsis: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        completed: false
    },
    {
        id: "level3",
        title: "Level 3",
        synopsis: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        completed: false
    },
    {
        id: "level4",
        title: "Level 4",
        synopsis: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        completed: false
    },
    {
        id: "level5",
        title: "Level 5",
        synopsis: "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.",
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
        <a href="#" class="action-button">Play</a>
    `;
}

// Initialize the screen when the page loads
window.onload = initLevels;
