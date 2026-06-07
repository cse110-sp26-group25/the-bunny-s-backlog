const levels = [
    {
        saveId: 'tutorial_morning_routine',
        folder: 'tutorial',
        title: 'Tutorial',
        synopsis: "The Morning Routine: Welcome to the agency! Let's get your terminal online and find the Chief's journal.",
        image: "../../Graphics/Background_Animations/PNG/LevelSelection/0.1.png"
    },
    {
        saveId: 'level_1_bakery',
        folder: 'level1',
        title: 'Level 1',
        synopsis: 'The Crust & Crumb Bakery: A thief has struck! Catalog the remaining pastries to find a clue.',
        image: "../../Graphics/Background_Animations/PNG/LevelSelection/1.2.png"
    },
    {
        saveId: 'level_2_police_station',
        folder: 'level2',
        title: 'Level 2',
        synopsis: 'The Police Station: Search the precinct records and cross-reference suspects to catch the culprit.',
        image: "../../Graphics/Background_Animations/PNG/LevelSelection/2.1.png"
    }
];

function getLevelState(level) {
    /*const unlocked = typeof isLevelUnlocked === 'function'
        ? isLevelUnlocked(level.saveId)
        : level.folder === 'tutorial';*/
    const unlocked = true
    const completed = typeof isLevelComplete === 'function'
        ? isLevelComplete(level.saveId)
        : false;

    return {
        unlocked ,
        completed
    };
}

function initLevels() {
    const carousel = document.getElementById('cards-carousel');
    carousel.innerHTML = '';

    levels.forEach((level, index) => {
        const state = getLevelState(level);
        const statusClass = state.completed ? 'completed' : state.unlocked ? '' : 'locked';
        const cardClass = state.unlocked ? '' : 'locked';
        const cardHTML = `
            <div class="card-container">
                <div class="level-card ${cardClass}" onclick="selectCard(${index})" id="card-${index}">
                    <div class="card-image-placeholder" style="background-image: url('${level.image}');">
                        <div class="status-dot ${statusClass}"></div>
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
    document.querySelectorAll('.level-card').forEach((card) => card.classList.remove('active'));

    const cardElement = document.getElementById(`card-${index}`);
    if (cardElement) {
        cardElement.classList.add('active');
    }

    const level = levels[index];
    const state = getLevelState(level);
    const overviewBox = document.getElementById('overview-box');
    const statusText = state.completed ? 'Completed' : state.unlocked ? 'Unlocked' : 'Locked';
    let actionHTML = '<button class="action-button disabled" type="button" disabled>Locked</button>';

    if (state.unlocked) {
        actionHTML = `<a href="../../src/game.html?level=${level.folder}" class="action-button" onclick="saveSelectedLevel('${level.saveId}')">Play</a>`;
    }

    overviewBox.innerHTML = `
        <h3>${level.title}</h3>
        <p><strong>Status:</strong> ${statusText}</p>
        <p>${level.synopsis}</p>
        ${actionHTML}
    `;
}

function saveSelectedLevel(levelId) {
    if (typeof saveCurrentLevel === 'function') {
        saveCurrentLevel(levelId);
    }
}

window.onload = initLevels;
