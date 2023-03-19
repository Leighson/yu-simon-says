// instantiate storage for game state and user choices
var gamePattern = [];
var userPattern = [];
var currentLevel = 0;

// instantiate default states for game over and next level pages
var gameOver = false;
var nextLevel = false;
var allowAKey = true;


/* HELPER FUNCTIONS ****************************************************/
// define animations and events


// create animator object for button presses
function buttonAnimation(event) {

    // activate the button's pressed state
    $(event.target).toggleClass("pressed");

    // delay for 100ms
    setTimeout( () => {
        $(event.target).toggleClass("pressed");
    }, 100);

}

// create event object for game over event
function gameOverEvent() {

    gameOver = true;
    allowAKey = false;

    // activate text & background color for game-over state
    $("#level-title").text("Game Over");
    $("#reset-game").css("visibility", "visible");
    $("body").toggleClass("game-over");

}


/* NEXT LEVEL FUNCTIONS *************************************************/


// function to wait for next level after the first level
function preNextLevelEvent() {

    nextLevel = true;
    allowAKey = true;

    // reset user pattern storage and increase level
    userPattern = [];
    currentLevel++;

    // change title to reflect current level
    if (currentLevel >= 2) {
        $("body").toggleClass("next-level"); // toggle green background on
        $("#level-subtitle").css("visibility", "visible");
        $("#level-subtitle").html("Press A key to continue");
        $("#reset-game").css("visibility", "hidden");
    } else {
        postNextLevelEvent(); // skip to post next level event
    }

}

// function for next level conditions
function postNextLevelEvent() {

    allowAKey = false;
    console.log(gamePattern);

    if (currentLevel >= 2) {
        $("body").toggleClass("next-level"); // toggle green background off
    }

    $("#level-title").text(`Level ${currentLevel}`);

    // countdown timer
    $("#level-subtitle").css("visibility", "visible");
    $("#level-subtitle").text(3);

    setTimeout( () => {
        $("#level-subtitle").text(2);
    }, 1000)

    setTimeout( () => {
        $("#level-subtitle").text(1);
    }, 2000)

    setTimeout( () => {
        $("#level-subtitle").text("GO!");
    }, 3000)

    setTimeout( () => {
        $("#level-subtitle").css("visibility", "hidden");
    }, 4000)

    // generate random number and colour list and append to game pattern
    setTimeout( () => {
        var randomNumber = Math.floor(Math.random() * 4);
        var buttonColours = ["red", "blue", "green", "yellow"];
        var randomChosenColour = buttonColours[randomNumber];
        gamePattern.push(randomChosenColour);

        // play audio cue
        var audio = new Audio(`./sounds/${randomChosenColour}.mp3`);
        audio.play();

        // animate next pattern
        $(`#${randomChosenColour}`).animate({opacity: 0.10}, 75);
        $(`#${randomChosenColour}`).animate({opacity: 1.00}, 75);

        $("#reset-game").css("visibility", "visible");

        nextLevel = false; // turns ON click events and 'a' press key

    }, 4100);

}


/* EVENT HANDLING ********************************************************/


// reset page on "a" press || reload page on "r" press
function handleKeyPress(event) {

    console.log(event.key);
    console.log(currentLevel);

    // if the game is on the landing page and if the key pressed is "a", then start the game...
    // otherwise, check if the key pressed is "r" and reload to landing page
    switch(event.key.toLowerCase()) {

        case 'a':
            if (allowAKey === true) {
                if (currentLevel === 0) {
                    preNextLevelEvent();
                    break;
                } else if (nextLevel === true) {
                    postNextLevelEvent();
                    break;
                }
            }

        case 'r':
            if (gameOver === true || nextLevel == false) {
                window.location.reload();
                break;
            }

        default:
            break;

    }

}

// save the chosen colour, then compare with the game state pattern
// if the pattern is correct, proceed with: 1) next level if all patterns have been completed, or 2) continue with current pattern
// if the pattern is incorrect, proceed with game over screen
function handleButtonClick(event) {

    if (currentLevel > 0 && nextLevel === false && gameOver == false) { // only registers clicks after next level event finishes

        console.log(userPattern);
        console.log(event.target.id);

        // trigger pressed animation
        buttonAnimation(event);

        // save user choice into userPattern storage
        var userChosenColour = event.target.id;
        userPattern.push(userChosenColour);

        // check if the user pattern is still incomplete AND if user input is the same as the game pattern
        // if so, go to the next level, otherwise, it's game over and the game resets
        if (userChosenColour === gamePattern[userPattern.length - 1]) {

            if (userPattern.length < gamePattern.length) {
                console.log("Choose the next colour in the pattern.")
            } else {
                preNextLevelEvent();
            }

        } else {

            // trigger game over screen
            gameOverEvent();

        }

    }

}



/* MAIN SCRIPT ********************************************************/


// make sure that nextLevel events are not clickable and not resettable

$(document).keydown(handleKeyPress);
$(".btn").click(handleButtonClick);