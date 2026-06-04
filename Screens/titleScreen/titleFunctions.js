/* Code for settings button */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.settings-button').addEventListener('click', function() {
        window.location.href = '../settings/settings.html';
        console.log("here");
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.credits-button').addEventListener('click', function() {
        window.location.href = '../credits/credits.html';
        console.log("here");
    });
});
