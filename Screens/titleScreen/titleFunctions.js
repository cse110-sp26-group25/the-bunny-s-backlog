/* Code for settings button */
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.settings-button').addEventListener('click', function() {
        window.location.href = '/Screens/settings/settings.html';
        console.log("here");
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.credits-button').addEventListener('click', function() {
        window.location.href = '/Screens/credits/credits.html';
        console.log("here");
    });
});