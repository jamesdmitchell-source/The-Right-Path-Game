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
    IPAD / SAFARI SAFE VERSION
    ========================================
*/

let level5StruggleAudio =
    null;

let level5PowerupAudio =
    null;

let level5HumAudio =
    null;

let level5DeathScreamAudio =
    null;


/*
    ========================================
    CREATE LEVEL 5 AUDIO
    ========================================
*/

function prepareLevel5Audio() {

    if (
        !level5StruggleAudio
    ) {

        level5StruggleAudio =
            new Audio(
                "restraint-struggle.mp3"
            );

        level5StruggleAudio.preload =
            "auto";

        level5StruggleAudio.volume =
            0.8;
    }


    if (
        !level5PowerupAudio
    ) {

        level5PowerupAudio =
            new Audio(
                "machine-powerup.mp3"
            );

        level5PowerupAudio.preload =
            "auto";

        level5PowerupAudio.volume =
            0.75;
    }


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


    if (
        !level5DeathScreamAudio
    ) {

        level5DeathScreamAudio =
            new Audio(
                "distant-scream.wav"
            );

        level5DeathScreamAudio.preload =
            "auto";

        level5DeathScreamAudio.volume =
            1;

        level5DeathScreamAudio.playbackRate =
            1.25;
    }
}


/*
    ========================================
    UNLOCK LEVEL 5 AUDIO
    ========================================

    IMPORTANT:

    This must be called DIRECTLY from
    the player's Begin Trial tap.

    iPad Safari then sees these audio
    objects as having been activated
    by the player.
*/

function unlockLevel5Audio() {

    prepareLevel5Audio();


    const sounds = [

        level5StruggleAudio,
        level5PowerupAudio,
        level5HumAudio,
        level5DeathScreamAudio

    ];


    sounds.forEach(
        function (sound) {

            if (
                !sound
            ) {

                return;
            }


            try {

                /*
                    Use the actual muted property
                    rather than volume = 0.

                    This is much safer on iPad.
                */

                sound.muted =
                    true;


                sound.currentTime =
                    0;


                const attempt =
                    sound.play();


                if (
                    attempt &&
                    typeof attempt.then ===
                    "function"
                ) {

                    attempt
                        .then(
                            function () {

                                /*
                                    Let Safari register
                                    the playback first.
                                */

                                setTimeout(
                                    function () {

                                        sound.pause();

                                        sound.currentTime =
                                            0;

                                        sound.muted =
                                            false;

                                    },
                                    250
                                );

                            }
                        )
                        .catch(
                            function () {

                                sound.pause();

                                sound.currentTime =
                                    0;

                                sound.muted =
                                    false;

                            }
                        );

                }

            } catch (
                error
            ) {

                // Continue game normally.

            }

        }
    );
}
/*
    ========================================
    RESTRAINT STRUGGLE
    ========================================
*/

function playLevel5StruggleSound() {

    prepareLevel5Audio();


    try {

        level5StruggleAudio.pause();

        level5StruggleAudio.currentTime =
            0;

        level5StruggleAudio.volume =
            0.8;


        const attempt =
            level5StruggleAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function (error) {

                    console.log(
                        "Level 5 struggle blocked:",
                        error
                    );

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 struggle unavailable.",
            error
        );
    }
}


/*
    ========================================
    MACHINE POWER-UP
    ========================================
*/

function playLevel5PowerupSound() {

    prepareLevel5Audio();


    try {

        level5PowerupAudio.pause();

        level5PowerupAudio.currentTime =
            0;

        level5PowerupAudio.volume =
            0.75;


        const attempt =
            level5PowerupAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function (error) {

                    console.log(
                        "Level 5 power-up blocked:",
                        error
                    );

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 power-up unavailable.",
            error
        );
    }
}


/*
    ========================================
    LEVEL 5 HUM
    ========================================
*/

function startLevel5Hum() {

    prepareLevel5Audio();


    try {

        level5HumAudio.pause();

        level5HumAudio.currentTime =
            0;

        level5HumAudio.volume =
            0.28;

        level5HumAudio.loop =
            true;


        const attempt =
            level5HumAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function (error) {

                    console.log(
                        "Level 5 hum blocked:",
                        error
                    );

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 hum unavailable.",
            error
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
    LEVEL 5 DEATH SCREAM
    ========================================
*/

function playLevel5DeathScream() {

    prepareLevel5Audio();


    try {

        level5DeathScreamAudio.pause();

        level5DeathScreamAudio.currentTime =
            0;

        level5DeathScreamAudio.volume =
            1;

        level5DeathScreamAudio.playbackRate =
            1.25;


        const attempt =
            level5DeathScreamAudio.play();


        if (
            attempt &&
            typeof attempt.catch ===
            "function"
        ) {

            attempt.catch(
                function (error) {

                    console.log(
                        "Level 5 scream blocked:",
                        error
                    );

                }
            );
        }

    } catch (
        error
    ) {

        console.log(
            "Level 5 scream unavailable.",
            error
        );
    }
}


/*
    ========================================
    END LEVEL 5 AUDIO
    ========================================
*/
