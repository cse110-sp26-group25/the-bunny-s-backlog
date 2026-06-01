// tutorial/terminal_logic.js
let tutorialState = 1;

export function runTutorialValidator(input) {
    let output = "";

    switch (tutorialState) {
        case 1:
            if (input === 'console.log("hello");') {
                output = "System Online. [Level 1 Complete]";
                tutorialState++;
            } else { output = "Error: Input must be console.log('hello');"; }
            break;
        case 2:
            if (input === 'scan("office");') {
                output = "Zones detected: desk, plant, drawers. [Level 2 Complete]";
                tutorialState++;
            }
            break;
        case 3:
            if (input === 'inspect("desk");') {
                output = "Desk: coffee_mug, open_book, clipboard. [Level 3 Complete]";
                tutorialState++;
            }
            break;
        case 4:
            if (input === 'desk.read("open_book");') {
                output = "It's a dictionary. Try the clipboard instead.";
            } else if (input === 'desk.read("clipboard");') {
                output = "Note reads: 'Keep journal in drawers. Hide key in foliage.' [Level 5 Complete]";
                tutorialState = 6; // Skipping to 6 based on script logic
            }
            break;
        case 6:
            if (input === 'inspect("plant");') {
                output = "Scanning plant... Glint of metal detected! [Level 6 Complete]";
                tutorialState++;
            }
            break;
        case 7:
            if (input === 'self.take("key");') {
                output = "[Item Acquired: Silver Key]. [Level 7 Complete]";
                tutorialState++;
            }
            break;
        case 8:
            if (input === 'drawers.open();') {
                output = "ERROR: The drawers are locked.";
            } else if (input === 'drawers.unlock("key");') {
                output = "Security lock disengaged. [Level 9 Complete]";
                tutorialState = 10;
            }
            break;
        case 10:
            if (input === 'drawers.open();') {
                output = "Drawers open... [Journal Acquired]. TUTORIAL COMPLETE!";
            }
            break;
        default:
            output = "Tutorial already finished!";
    }
    return output;
}
