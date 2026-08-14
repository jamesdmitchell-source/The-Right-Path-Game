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
/*
    ========================================
    LEVEL 5 — AUDIO
    ========================================
*/

let level5StruggleAudio =
    null;

let level5PowerupAudio =
    null;

let level5HumAudio =
    null;


/*
    ========================================
    RESTRAINT STRUGGLE
    ========================================
*/

function playLevel5StruggleSound() {

    try {

        if (
            level5StruggleAudio
        ) {

            level5StruggleAudio.pause();

            level5StruggleAudio.currentTime =
                0;
        }


        level5StruggleAudio =
            new Audio(
                "restraint-struggle.mp3"
            );


        level5StruggleAudio.preload =
            "auto";


        level5StruggleAudio.volume =
            0.8;


        level5StruggleAudio.currentTime =
            0;


        const attempt =
            level5StruggleAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function () {

                    // Continue silently.

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 struggle audio unavailable."
        );

    }
}


/*
    ========================================
    MACHINE POWER-UP
    ========================================
*/

function playLevel5PowerupSound() {

    try {

        if (
            level5PowerupAudio
        ) {

            level5PowerupAudio.pause();

            level5PowerupAudio.currentTime =
                0;
        }


        level5PowerupAudio =
            new Audio(
                "machine-powerup.mp3"
            );


        level5PowerupAudio.preload =
            "auto";


        level5PowerupAudio.volume =
            0.75;


        level5PowerupAudio.currentTime =
            0;


        const attempt =
            level5PowerupAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function () {

                    // Continue silently.

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 power-up audio unavailable."
        );

    }
}


/*
    ========================================
    LEVEL 5 HUM
    ========================================
*/

function startLevel5Hum() {

    try {

        if (
            !level5HumAudio
        ) {

            level5HumAudio =
                new Audio(
                    "blade-hum.mp3"
                );


            level5HumAudio.preload =
                "auto";


            level5HumAudio.loop =
                true;


            level5HumAudio.volume =
                0.28;
        }


        level5HumAudio.currentTime =
            0;


        const attempt =
            level5HumAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function () {

                    // Continue silently.

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 hum unavailable."
        );

    }
}


function stopLevel5Hum() {

    if (
        !level5HumAudio
    ) {

        return;
    }


    try {

        level5HumAudio.pause();

        level5HumAudio.currentTime =
            0;

    } catch (
        error
    ) {

        // Ignore.

    }
}


/*
    ========================================
    END LEVEL 5 AUDIO
    ========================================
*/
