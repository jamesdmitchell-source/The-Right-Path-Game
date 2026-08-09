/*
    THE RIGHT PATH
    AUDIO SYSTEM
*/

let doorCreak = null;
let corridorAmbience = null;
let distantScream = null;


/*
    PREPARE AUDIO
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


    if (!distantScream) {

        distantScream =
            new Audio(
                "distant-scream.wav"
            );

        distantScream.preload =
            "auto";

        /*
            Keep it distant,
            not like a jump scare
            right beside the player.
        */

        distantScream.volume =
            0.28;
    }
}


/*
    DOOR CREAK
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
    DISTANT SCREAM
*/

function playDistantScream() {

    if (!distantScream) {

        distantScream =
            new Audio(
                "distant-scream.wav"
            );

        distantScream.preload =
            "auto";

        distantScream.volume =
            0.28;
    }


    distantScream.pause();

    distantScream.currentTime =
        0;


    const playAttempt =
        distantScream.play();


    if (
        playAttempt &&
        typeof playAttempt.catch ===
        "function"
    ) {

        playAttempt.catch(
            function (error) {

                console.log(
                    "Scream could not play:",
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
