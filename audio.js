/*
    THE RIGHT PATH
    AUDIO SYSTEM
*/

let audioUnlocked = false;
let doorCreak = null;


/*
    PREPARE GAME AUDIO

    This is called when the player presses
    BEGIN TRIAL.

    Doing it from a real button press is
    important for iPad / Safari.
*/

function startAmbientSound() {

    if (!doorCreak) {

        doorCreak = new Audio(
            "door-creak.wav"
        );

        doorCreak.preload = "auto";

        doorCreak.volume = 0.9;

    }


    /*
        Unlock HTML audio on iPad/Safari.

        We briefly attempt playback while
        muted, then immediately stop it.
    */

    doorCreak.muted = true;


    const playAttempt =
        doorCreak.play();


    if (
        playAttempt &&
        typeof playAttempt.then ===
        "function"
    ) {

        playAttempt
            .then(function () {

                doorCreak.pause();

                doorCreak.currentTime = 0;

                doorCreak.muted = false;

                audioUnlocked = true;

            })
            .catch(function () {

                /*
                    Even if Safari refuses this,
                    we'll try again when the
                    player chooses the door.
                */

                doorCreak.muted = false;

            });

    } else {

        doorCreak.pause();

        doorCreak.currentTime = 0;

        doorCreak.muted = false;

        audioUnlocked = true;

    }

}


/*
    PLAY REAL DOOR CREAK

    script.js already calls this function
    when the correct door is chosen.
*/

function playDoorMusic() {

    if (!doorCreak) {

        doorCreak = new Audio(
            "door-creak.wav"
        );

        doorCreak.preload = "auto";

        doorCreak.volume = 0.9;

    }


    doorCreak.pause();

    doorCreak.currentTime = 0;

    doorCreak.muted = false;


    const playAttempt =
        doorCreak.play();


    if (
        playAttempt &&
        typeof playAttempt.catch ===
        "function"
    ) {

        playAttempt.catch(
            function (error) {

                console.log(
                    "Door audio could not play:",
                    error
                );

            }
        );

    }

}
