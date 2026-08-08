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
    HEAVY METAL DOOR CREAK
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
        LOW MECHANICAL GROAN
    */

    const groan =
        context.createOscillator();

    const groanGain =
        context.createGain();

    groan.type =
        "sawtooth";

    groan.frequency.setValueAtTime(
        72,
        now
    );

    groan.frequency.exponentialRampToValueAtTime(
        28,
        now + 3.5
    );

    groanGain.gain.setValueAtTime(
        0.0001,
        now
    );

    groanGain.gain.exponentialRampToValueAtTime(
        0.09,
        now + 0.3
    );

    groanGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 4
    );

    groan.connect(
        groanGain
    );

    groanGain.connect(
        context.destination
    );

    groan.start(now);

    groan.stop(
        now + 4
    );


    /*
        METAL STRAIN / CREAK
    */

    const creak =
        context.createOscillator();

    const creakGain =
        context.createGain();

    const creakFilter =
        context.createBiquadFilter();

    creak.type =
        "square";

    creak.frequency.setValueAtTime(
        310,
        now + 0.4
    );

    creak.frequency.linearRampToValueAtTime(
        175,
        now + 2.6
    );

    creakFilter.type =
        "bandpass";

    creakFilter.frequency.value =
        500;

    creakFilter.Q.value =
        3;

    creakGain.gain.setValueAtTime(
        0.0001,
        now + 0.4
    );

    creakGain.gain.exponentialRampToValueAtTime(
        0.055,
        now + 0.55
    );

    creakGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 3
    );

    creak.connect(
        creakFilter
    );

    creakFilter.connect(
        creakGain
    );

    creakGain.connect(
        context.destination
    );

    creak.start(
        now + 0.4
    );

    creak.stop(
        now + 3.1
    );


    /*
        FINAL HEAVY CLUNK
    */

    const clunk =
        context.createOscillator();

    const clunkGain =
        context.createGain();

    clunk.type =
        "sine";

    clunk.frequency.value =
        58;

    clunkGain.gain.setValueAtTime(
        0.0001,
        now + 3.2
    );

    clunkGain.gain.exponentialRampToValueAtTime(
        0.18,
        now + 3.22
    );

    clunkGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 3.7
    );

    clunk.connect(
        clunkGain
    );

    clunkGain.connect(
        context.destination
    );

    clunk.start(
        now + 3.2
    );

    clunk.stop(
        now + 3.8
    );
}
