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


function startAmbientSound() {
    const context =
        ensureAudioContext();

    if (!context) {
        return;
    }

    /*
        Don't create the ambient drone twice.
    */

    if (ambientGain) {
        return;
    }

    ambientGain =
        context.createGain();

    ambientGain.gain.value =
        0.02;

    ambientGain.connect(
        context.destination
    );


    const droneOne =
        context.createOscillator();

    const droneTwo =
        context.createOscillator();


    droneOne.type = "sine";
    droneTwo.type = "sine";


    droneOne.frequency.value = 48;
    droneTwo.frequency.value = 55;


    droneOne.connect(
        ambientGain
    );

    droneTwo.connect(
        ambientGain
    );


    droneOne.start();
    droneTwo.start();
}


function playDoorMusic() {
    const context =
        ensureAudioContext();

    if (!context) {
        return;
    }


    /*
        Deep door-opening rumble
    */

    const rumbleGain =
        context.createGain();

    rumbleGain.gain.setValueAtTime(
        0.0001,
        context.currentTime
    );

    rumbleGain.gain.exponentialRampToValueAtTime(
        0.16,
        context.currentTime + 0.15
    );

    rumbleGain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 5.5
    );

    rumbleGain.connect(
        context.destination
    );


    const rumble =
        context.createOscillator();

    rumble.type = "sine";

    rumble.frequency.setValueAtTime(
        52,
        context.currentTime
    );

    rumble.frequency.exponentialRampToValueAtTime(
        30,
        context.currentTime + 5
    );

    rumble.connect(
        rumbleGain
    );

    rumble.start();

    rumble.stop(
        context.currentTime + 5.5
    );


    /*
        The Right Path three-note motif
    */

    const notes = [
        {
            frequency: 146.83,
            start: 0.45
        },
        {
            frequency: 110,
            start: 1.55
        },
        {
            frequency: 87.31,
            start: 2.7
        }
    ];


    notes.forEach(function (note) {

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();


        oscillator.type =
            "triangle";

        oscillator.frequency.value =
            note.frequency;


        gain.gain.setValueAtTime(
            0.0001,
            context.currentTime +
            note.start
        );

        gain.gain.exponentialRampToValueAtTime(
            0.12,
            context.currentTime +
            note.start +
            0.08
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            context.currentTime +
            note.start +
            1.8
        );


        oscillator.connect(
            gain
        );

        gain.connect(
            context.destination
        );


        oscillator.start(
            context.currentTime +
            note.start
        );

        oscillator.stop(
            context.currentTime +
            note.start +
            2
        );
    });
}
