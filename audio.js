let audioContext;
let ambientGain;

function startAmbientSound() {
    if (audioContext) {
        return;
    }

    audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    ambientGain = audioContext.createGain();
    ambientGain.gain.value = 0.025;

    ambientGain.connect(
        audioContext.destination
    );

    const droneOne =
        audioContext.createOscillator();

    const droneTwo =
        audioContext.createOscillator();

    droneOne.type = "sine";
    droneTwo.type = "sine";

    droneOne.frequency.value = 48;
    droneTwo.frequency.value = 55;

    droneOne.connect(ambientGain);
    droneTwo.connect(ambientGain);

    droneOne.start();
    droneTwo.start();
