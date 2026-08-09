/*
    THE RIGHT PATH
    AUDIO SYSTEM
*/

let doorCreak = null;
let corridorAmbience = null;


/*
    PREPARE AUDIO

    This prepares the files when the player
    presses Begin Trial.

    It does NOT play either sound.
*/

function startAmbientSound() {

    if (!doorCreak) {

        doorCreak =
            new Audio(
                "door-creak.wav"
            );

        doorCreak.preload =
            "auto";

        doorCreak.volume =
            0.9;
    }


    if (!corridorAmbience) {

        corridorAmbience =
            new Audio(
                "corridor-ambience.wav"
            );

        corridorAmbience.preload =
            "auto";

        corridorAmbience.volume =
            0.55;

        corridorAmbience.loop =
            true;
    }
}


/*
    LEVEL 1 DOOR CREAK
*/

function playDoorMusic() {

    if (!doorCreak) {

        doorCreak =
            new Audio(
                "door-creak.wav"
            );

        doorCreak.preload =
            "auto";

        doorCreak.volume =
            0.9;
    }


    doorCreak.pause();

    doorCreak.currentTime =
        0;


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
                    "Door sound could not play:",
                    error
                );
            }
        );
    }
}


/*
    CORRIDOR AMBIENCE
*/

function playCorridorAmbience() {

    if (!corridorAmbience) {

        corridorAmbience =
            new Audio(
                "corridor-ambience.wav"
            );

        corridorAmbience.preload =
            "auto";

        corridorAmbience.volume =
            0.55;

        corridorAmbience.loop =
            true;
    }


    corridorAmbience.pause();

    corridorAmbience.currentTime =
        0;


    const playAttempt =
        corridorAmbience.play();


    if (
        playAttempt &&
        typeof playAttempt.catch ===
        "function"
    ) {

        playAttempt.catch(
            function (error) {

                console.log(
                    "Corridor ambience could not play:",
                    error
                );
            }
        );
    }
}


/*
    STOP CORRIDOR AMBIENCE
*/

function stopCorridorAmbience() {

    if (!corridorAmbience) {

        return;
    }


    corridorAmbience.pause();

    corridorAmbience.currentTime =
        0;
}
