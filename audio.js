let audioContext = null;
let ambientGain = null;

function ensureAudioContext() {
    if (!audioContext) {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        audioContext =
            new AudioContextClass();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}


/*
    LOW BACKGROUND HUM
*/

function startAmbientSound() {
    const context =
        ensureAudioContext();

    if (!context) {
        return;
    }

    if (ambientGain) {
        return;
    }

    ambientGain =
        context.createGain();

    ambientGain.gain.value =
        0.018;

    ambientGain.connect(
        context.destination
    );


    const droneOne =
        context.createOscillator();

    const droneTwo =
        context.createOscillator();


    droneOne.type = "sine";
    droneTwo.type = "sine";


    droneOne.frequency.value = 46;
    droneTwo.frequency.value = 51;


    droneOne.connect(
        ambientGain
    );

    droneTwo.connect(
        ambientGain
    );


    droneOne.start();
    droneTwo.start();
}


/*
    HELPER:
    CREATE ONE SHARP STRING-LIKE STAB
*/

function createStringStab(
    context,
    frequency,
    startTime,
    volume
) {
    const oscillator =
        context.createOscillator();

    const gain =
        context.createGain();

    const filter =
        context.createBiquadFilter();


    oscillator.type =
        "sawtooth";

    oscillator.frequency.value =
        frequency;


    filter.type =
        "bandpass";

    filter.frequency.value =
        frequency;

    filter.Q.value =
        4;


    gain.gain.setValueAtTime(
        0.0001,
        startTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        startTime + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + 0.28
    );


    oscillator.connect(
        filter
    );

    filter.connect(
        gain
    );

    gain.connect(
        context.destination
    );


    oscillator.start(
        startTime
    );

    oscillator.stop(
        startTime + 0.3
    );
}


/*
    DOOR OPENING HORROR CUE
*/

function playDoorMusic() {
    const context =
        ensureAudioContext();

    if (!context) {
        return;
    }

    const now =
        context.currentTime;


    /*
        DEEP INDUSTRIAL RUMBLE
    */

    const rumble =
        context.createOscillator();

    const rumbleGain =
        context.createGain();


    rumble.type =
        "sine";

    rumble.frequency.setValueAtTime(
        48,
        now
    );

    rumble.frequency.exponentialRampToValueAtTime(
        28,
        now + 5
    );


    rumbleGain.gain.setValueAtTime(
        0.0001,
        now
    );

    rumbleGain.gain.exponentialRampToValueAtTime(
        0.11,
        now + 0.25
    );

    rumbleGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 5.5
    );


    rumble.connect(
        rumbleGain
    );

    rumbleGain.connect(
        context.destination
    );


    rumble.start(
        now
    );

    rumble.stop(
        now + 5.5
    );


    /*
        FIRST SHOCK:
        THREE SHARP DISSONANT STABS
    */

    createStringStab(
        context,
        740,
        now + 0.55,
        0.16
    );

    createStringStab(
        context,
        830,
        now + 0.78,
        0.15
    );

    createStringStab(
        context,
        698,
        now + 1.02,
        0.16
    );


    /*
        SHORT SILENCE...
        THEN ANOTHER UNEASY HIT
    */

    createStringStab(
        context,
        932,
        now + 1.9,
        0.13
    );

    createStringStab(
        context,
        784,
        now + 2.08,
        0.12
    );


    /*
        SUSTAINED HAUNTING HIGH NOTE
    */

    const highTone =
        context.createOscillator();

    const highGain =
        context.createGain();

    const highFilter =
        context.createBiquadFilter();


    highTone.type =
        "triangle";

    highTone.frequency.value =
        622.25;


    highFilter.type =
        "lowpass";

    highFilter.frequency.value =
        1600;


    highGain.gain.setValueAtTime(
        0.0001,
        now + 2.45
    );

    highGain.gain.exponentialRampToValueAtTime(
        0.065,
        now + 2.8
    );

    highGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 5.2
    );


    highTone.connect(
        highFilter
    );

    highFilter.connect(
        highGain
    );

    highGain.connect(
        context.destination
    );


    highTone.start(
        now + 2.45
    );

    highTone.stop(
        now + 5.3
    );


    /*
        LOW DISSONANT NOTE UNDERNEATH
    */

    const lowTone =
        context.createOscillator();

    const lowGain =
        context.createGain();


    lowTone.type =
        "triangle";

    lowTone.frequency.value =
        73.42;


    lowGain.gain.setValueAtTime(
        0.0001,
        now + 2.4
    );

    lowGain.gain.exponentialRampToValueAtTime(
        0.08,
        now + 2.75
    );

    lowGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 5.3
    );


    lowTone.connect(
        lowGain
    );

    lowGain.connect(
        context.destination
    );


    lowTone.start(
        now + 2.4
    );

    lowTone.stop(
        now + 5.4
    );
}
