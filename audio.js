let doorCreak = null;

/*
    PREPARE AUDIO FILE
    This does NOT play the creak.
*/

function startAmbientSound() {
    if (!doorCreak) {
        doorCreak = new Audio("door-creak.wav");
        doorCreak.preload = "auto";
        doorCreak.volume = 0.9;
    }
}

/*
    PLAY DOOR CREAK
    Called only when the correct door is chosen.
*/

function playDoorMusic() {
    if (!doorCreak) {
        doorCreak = new Audio("door-creak.wav");
        doorCreak.preload = "auto";
        doorCreak.volume = 0.9;
    }

    doorCreak.pause();
    doorCreak.currentTime = 0;

    const playAttempt = doorCreak.play();

    if (
        playAttempt &&
        typeof playAttempt.catch === "function"
    ) {
        playAttempt.catch(function (error) {
            console.log(
                "Door audio could not play:",
                error
            );
        });
    }
}
