document.addEventListener("DOMContentLoaded", function () {

    /*
        THE RIGHT PATH
        MAIN GAME SCRIPT
    */

    const screens =
        document.querySelectorAll(".screen");

    const titleScreen =
        document.getElementById("titleScreen");

    const introScreen =
        document.getElementById("introScreen");

    const levelScreen =
        document.getElementById("levelScreen");

    const deathScreen =
        document.getElementById("deathScreen");

    const successScreen =
        document.getElementById("successScreen");

    const startButton =
        document.getElementById("startButton");

    const retryButton =
        document.getElementById("retryButton");

    const continueButton =
        document.getElementById("continueButton");

    const deathMessage =
        document.getElementById("deathMessage");

    const successLabel =
        document.getElementById("successLabel");

    const successTitle =
        document.getElementById("successTitle");

    const successMessage =
        document.getElementById("successMessage");

    const introText =
        document.getElementById("introText");

    const curatorMessage =
        document.getElementById("curatorMessage");

    const levelHeader =
        document.querySelector(".level-header");

    const observationText =
        document.querySelector(".observation");

    const clueText =
        document.querySelector("blockquote");

    const questionTitle =
        document.querySelector(".room h2");

    const questionText =
        document.querySelector(
            ".room > p:not(.observation):not(.curator-message)"
        );

    const choicesContainer =
        document.querySelector(".choices");


 /*
    ========================================
    GAME STATE
    ========================================
*/

let currentLevelIndex =
    0;

let investigatedIds =
    new Set();

let journalEntries =
    [];

let puzzleSolved =
    false;

let keypadEntry =
    "";

let transitionRunning =
    false;

let puzzleVisible =
    false;


/*
    ========================================
    LEVEL 2 — SPEAKER STATE
    ========================================
*/

let playedSpeakerIds =
    new Set();

let speakerWall =
    null;


/*
    ========================================
    LEVEL 3 — SUBJECT 19 STATE
    ========================================
*/

let subject19RecordingPlayed =
    false;

let sequenceEntry =
    [];

let sequenceSolved =
    false;

let subjectRecorder =
    null;

let sequenceControl =
    null;


/*
    ========================================
    LEVEL 4 — PRESSURE STATE
    ========================================
*/

let pressureOverlay =
    null;

let pressureCeiling =
    null;

let pressureEvidence =
    null;

let pressureWarning =
    null;

let pressureSequenceDisplay =
    null;

let pressureStatus =
    null;

let pressureSymbolButtons =
    [];

let pressureInvestigationButtons =
    [];

let pressureEntry =
    [];

let pressureSolved =
    false;

let pressureRunning =
    false;

let pressureTimer =
    null;

let pressureDeadline =
    0;

let pressureHalfwaySpoken =
    false;

let pressureWarningSpoken =
    false;
    /*
        ELIAS
    */

    let curatorVoice = null;

    const selectedVoiceName =
        localStorage.getItem(
            "rightPathCuratorVoice"
        ) || "";

    const introLines = [
        "Are you listening?",
        "Good.",
        "You have been looking for answers.",
        "Now you will discover whether you deserve them.",
        "Observe first.",
        "Choose second."
    ];


    /*
        INVESTIGATION PANEL
    */

    const investigationPanel =
        document.createElement("section");

    investigationPanel.className =
        "investigation-panel";

    investigationPanel.innerHTML = `
        <div class="investigation-heading">

            <span>INVESTIGATE</span>

            <button
                id="journalButton"
                class="small-button"
                type="button"
            >
                Journal
            </button>

        </div>

        <div
            id="investigationGrid"
            class="investigation-grid"
        ></div>

        <div
            id="evidenceCard"
            class="evidence-card"
        >
            Select an object to examine it.
        </div>

        <p
            id="evidenceProgress"
            class="evidence-progress"
        ></p>
    `;

    choicesContainer.parentNode.insertBefore(
        investigationPanel,
        choicesContainer
    );


    /*
        LEVEL 2 SPEAKER WALL

        This sits above the investigation panel.
    */

    speakerWall =
        document.createElement("section");

    speakerWall.className =
        "speaker-wall";

    investigationPanel.parentNode.insertBefore(
        speakerWall,
        investigationPanel
    );
/*
    ========================================
    LEVEL 3 — SUBJECT 19 RECORDER
    ========================================
*/

subjectRecorder =
    document.createElement("section");

subjectRecorder.className =
    "subject-recorder";

subjectRecorder.innerHTML = `
    <div class="recorder-label">
        DAMAGED RECORDER
    </div>

    <div class="recorder-device">

        <div class="recorder-reel"></div>

        <div>
            SUBJECT 19
        </div>

    </div>

    <button
        id="subject19Play"
        class="recorder-play"
        type="button"
    >
        PLAY RECORDING
    </button>

    <div
        id="subject19Transcript"
        class="recorder-transcript"
    >
        Tape detected.
    </div>
`;

investigationPanel.parentNode.insertBefore(
    subjectRecorder,
    investigationPanel
);


/*
    ========================================
    LEVEL 3 — RESTRAINT CONTROL
    ========================================
*/

sequenceControl =
    document.createElement("section");

sequenceControl.className =
    "sequence-control";

sequenceControl.innerHTML = `
    <div class="sequence-label">
        RESTRAINT CONTROL
    </div>

    <h3>
        FOUR INPUTS REQUIRED
    </h3>

    <p class="sequence-instruction">
        Reproduce the sequence.
    </p>

    <div
        id="sequenceDisplay"
        class="sequence-display"
    >
        _ → _ → _ → _
    </div>

    <div class="sequence-buttons">

        <button
            id="sequenceLeft"
            class="sequence-button"
            type="button"
        >
            LEFT
        </button>

        <button
            id="sequenceRight"
            class="sequence-button"
            type="button"
        >
            RIGHT
        </button>

    </div>

    <div
        id="sequenceStatus"
        class="sequence-status"
    ></div>

</section>
`;

investigationPanel.parentNode.insertBefore(
    sequenceControl,
    choicesContainer
);


const subject19Play =
    document.getElementById(
        "subject19Play"
    );

const subject19Transcript =
    document.getElementById(
        "subject19Transcript"
    );

const sequenceDisplay =
    document.getElementById(
        "sequenceDisplay"
    );

const sequenceLeft =
    document.getElementById(
        "sequenceLeft"
    );

const sequenceRight =
    document.getElementById(
        "sequenceRight"
    );

const sequenceStatus =
    document.getElementById(
        "sequenceStatus"
    );
/*
    ========================================
    LEVEL 4 — PRESSURE CHAMBER UI
    ========================================
*/

pressureOverlay =
    document.createElement("div");

pressureOverlay.className =
    "pressure-overlay";


pressureOverlay.innerHTML = `

    <div
        id="pressureCeiling"
        class="pressure-ceiling"
    ></div>


    <div class="pressure-room">

        <div class="pressure-heading">
            LEVEL 4 — PRESSURE
        </div>


        <div
            id="pressureWarning"
            class="pressure-warning"
        >
            SYSTEM IDLE
        </div>


        <div
            id="pressureEvidence"
            class="evidence-card"
        >
            Examine the chamber.
        </div>


        <div class="investigation-grid">

            <button
                type="button"
                class="investigation-button pressure-investigation"
                data-investigation="eye"
            >
                <span class="investigation-icon">
                    👁️
                </span>

                <span>
                    Eye
                </span>
            </button>


            <button
                type="button"
                class="investigation-button pressure-investigation"
                data-investigation="doorSymbol"
            >
                <span class="investigation-icon">
                    🚪
                </span>

                <span>
                    Door
                </span>
            </button>


            <button
                type="button"
                class="investigation-button pressure-investigation"
                data-investigation="clockSymbol"
            >
                <span class="investigation-icon">
                    🕒
                </span>

                <span>
                    Clock
                </span>
            </button>


            <button
                type="button"
                class="investigation-button pressure-investigation"
                data-investigation="hand"
            >
                <span class="investigation-icon">
                    ✋
                </span>

                <span>
                    Handprint
                </span>
            </button>


            <button
                type="button"
                class="investigation-button pressure-investigation"
                data-investigation="scratching"
            >
                <span class="investigation-icon">
                    🔎
                </span>

                <span>
                    Wall Scratching
                </span>
            </button>

        </div>


        <div
            id="pressureSequenceDisplay"
            class="pressure-sequence-display"
        >
            _ → _ → _ → _
        </div>


        <div class="pressure-symbols">

            <button
                type="button"
                class="pressure-symbol"
                data-symbol="EYE"
            >
                👁️
                <br>
                EYE
            </button>


            <button
                type="button"
                class="pressure-symbol"
                data-symbol="DOOR"
            >
                🚪
                <br>
                DOOR
            </button>


            <button
                type="button"
                class="pressure-symbol"
                data-symbol="CLOCK"
            >
                🕒
                <br>
                CLOCK
            </button>


            <button
                type="button"
                class="pressure-symbol"
                data-symbol="HAND"
            >
                ✋
                <br>
                HAND
            </button>

        </div>


        <div
            id="pressureStatus"
            class="pressure-status"
        ></div>

    </div>
`;


document.body.appendChild(
    pressureOverlay
);


/*
    LEVEL 4 REFERENCES
*/

pressureCeiling =
    document.getElementById(
        "pressureCeiling"
    );

pressureEvidence =
    document.getElementById(
        "pressureEvidence"
    );

pressureWarning =
    document.getElementById(
        "pressureWarning"
    );

pressureSequenceDisplay =
    document.getElementById(
        "pressureSequenceDisplay"
    );

pressureStatus =
    document.getElementById(
        "pressureStatus"
    );


pressureSymbolButtons =
    Array.from(
        pressureOverlay.querySelectorAll(
            ".pressure-symbol"
        )
    );


pressureInvestigationButtons =
    Array.from(
        pressureOverlay.querySelectorAll(
            ".pressure-investigation"
        )
    );
    /*
        KEYPAD OVERLAY
    */

    const puzzleOverlay =
        document.createElement("div");

    Object.assign(
        puzzleOverlay.style,
        {
            position: "fixed",
            inset: "0",
            zIndex: "2500",
            display: "none",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "7vh 18px 30px",
            boxSizing: "border-box",
            overflowY: "auto",
            background:
                "rgba(0, 0, 0, 0.88)"
        }
    );

    const puzzlePanel =
        document.createElement("section");

    puzzlePanel.className =
        "puzzle-panel";

    Object.assign(
        puzzlePanel.style,
        {
            display: "block",
            width:
                "min(430px, 92vw)",
            maxHeight:
                "84vh",
            overflowY:
                "auto",
            margin:
                "0",
            boxSizing:
                "border-box"
        }
    );

    puzzlePanel.innerHTML = `
        <p class="puzzle-label">
            CONTROL PANEL
        </p>

        <h3 id="puzzleTitle">
            OBSERVATION REQUIRED
        </h3>

        <p id="puzzleInstruction"></p>

        <div
            id="keypadDisplay"
            class="keypad-display"
        >
            _ _ _ _
        </div>

        <div class="keypad-grid">

            <button
                class="keypad-number"
                data-number="1"
                type="button"
            >1</button>

            <button
                class="keypad-number"
                data-number="2"
                type="button"
            >2</button>

            <button
                class="keypad-number"
                data-number="3"
                type="button"
            >3</button>

            <button
                class="keypad-number"
                data-number="4"
                type="button"
            >4</button>

            <button
                class="keypad-number"
                data-number="5"
                type="button"
            >5</button>

            <button
                class="keypad-number"
                data-number="6"
                type="button"
            >6</button>

            <button
                class="keypad-number"
                data-number="7"
                type="button"
            >7</button>

            <button
                class="keypad-number"
                data-number="8"
                type="button"
            >8</button>

            <button
                class="keypad-number"
                data-number="9"
                type="button"
            >9</button>

            <button
                id="keypadClear"
                type="button"
            >
                CLEAR
            </button>

            <button
                class="keypad-number"
                data-number="0"
                type="button"
            >
                0
            </button>

            <button
                id="keypadEnter"
                type="button"
            >
                ENTER
            </button>

        </div>

        <p
            id="puzzleStatus"
            class="puzzle-status"
        ></p>
    `;

    puzzleOverlay.appendChild(
        puzzlePanel
    );

    document.body.appendChild(
        puzzleOverlay
    );


    /*
        JOURNAL
    */

    const journalOverlay =
        document.createElement("div");

    journalOverlay.className =
        "journal-overlay";

    journalOverlay.innerHTML = `
        <div class="journal-card">

            <div class="journal-topbar">

                <span>
                    SUBJECT 28 — JOURNAL
                </span>

                <button
                    id="closeJournalButton"
                    class="small-button"
                    type="button"
                >
                    Close
                </button>

            </div>

            <div id="journalContent"></div>

        </div>
    `;

    document.body.appendChild(
        journalOverlay
    );


    /*
        LEVEL 1 DOOR CINEMATIC
    */

    const doorTransition =
        document.createElement("div");

    doorTransition.className =
        "door-transition";

    doorTransition.innerHTML = `
        <div class="door-scene">

            <p class="door-status">
                ACCESS CONFIRMED
            </p>

            <div class="steel-door">

                <div class="door-left"></div>
                <div class="door-right"></div>
                <div class="door-light"></div>

            </div>

            <p class="door-message">
                PROCEED
            </p>

        </div>
    `;

    document.body.appendChild(
        doorTransition
    );


 /*
    ========================================
    FIRST-PERSON CORRIDOR TRANSITION
    ========================================
*/

const corridorTransition =
    document.createElement("div");

corridorTransition.className =
    "corridor-transition corridor-walk-transition";

corridorTransition.innerHTML = `

    <div class="corridor-walk-camera">

        <img
            class="corridor-walk-image"
            src="corridor-walk.png"
            alt="Dark underground corridor"
        >

        <div class="corridor-light-flicker"></div>

        <div class="corridor-walk-vignette"></div>

    </div>


    <div class="corridor-walk-caption">

        <div
            id="corridorLevelText"
            class="corridor-level-text"
        >
            LEVEL COMPLETE
        </div>

        <div class="corridor-subject-text">
            SUBJECT 28
        </div>

    </div>

`;

document.body.appendChild(
    corridorTransition
);


const corridorLevelText =
    document.getElementById(
        "corridorLevelText"
    );

    /*
        REFERENCES
    */

    const investigationGrid =
        document.getElementById(
            "investigationGrid"
        );

    const evidenceCard =
        document.getElementById(
            "evidenceCard"
        );

    const evidenceProgress =
        document.getElementById(
            "evidenceProgress"
        );

    const journalButton =
        document.getElementById(
            "journalButton"
        );

    const closeJournalButton =
        document.getElementById(
            "closeJournalButton"
        );

    const journalContent =
        document.getElementById(
            "journalContent"
        );

    const puzzleTitle =
        document.getElementById(
            "puzzleTitle"
        );

    const puzzleInstruction =
        document.getElementById(
            "puzzleInstruction"
        );

    const keypadDisplay =
        document.getElementById(
            "keypadDisplay"
        );

    const keypadClear =
        document.getElementById(
            "keypadClear"
        );

    const keypadEnter =
        document.getElementById(
            "keypadEnter"
        );

    const puzzleStatus =
        document.getElementById(
            "puzzleStatus"
        );


    /*
        BASIC FUNCTIONS
    */

    function wait(milliseconds) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );
    }


    function showScreen(screen) {

        screens.forEach(
            function (item) {

                item.classList.remove(
                    "active",
                    "fade-out"
                );

            }
        );

        screen.classList.add(
            "active"
        );
    }


    async function fadeToScreen(
        currentScreen,
        nextScreen
    ) {

        currentScreen.classList.add(
            "fade-out"
        );

        await wait(700);

        showScreen(
            nextScreen
        );
    }


    /*
        VOICE SELECTION
    */

    function getEnglishVoices() {

        if (
            !("speechSynthesis" in window)
        ) {

            return [];

        }

        return window
            .speechSynthesis
            .getVoices()
            .filter(
                function (voice) {

                    return voice.lang
                        .toLowerCase()
                        .startsWith("en");

                }
            );
    }


    function chooseCuratorVoice() {

        const voices =
            getEnglishVoices();

        if (!voices.length) {

            curatorVoice =
                null;

            return;
        }


        if (selectedVoiceName) {

            const saved =
                voices.find(
                    function (voice) {

                        return (
                            voice.name ===
                            selectedVoiceName
                        );

                    }
                );

            if (saved) {

                curatorVoice =
                    saved;

                return;
            }
        }


        const preferredNames = [
            "daniel",
            "arthur",
            "george",
            "oliver",
            "ryan"
        ];


        curatorVoice =
            voices.find(
                function (voice) {

                    const name =
                        voice.name
                            .toLowerCase();

                    return (
                        voice.lang
                            .toLowerCase()
                            .startsWith(
                                "en-gb"
                            )

                        &&

                        preferredNames.some(
                            function (
                                preferred
                            ) {

                                return name.includes(
                                    preferred
                                );

                            }
                        )
                    );

                }
            )

            ||

            voices.find(
                function (voice) {

                    return voice.lang
                        .toLowerCase()
                        .startsWith(
                            "en-gb"
                        );

                }
            )

            ||

            voices[0];
    }


    chooseCuratorVoice();


    if (
        "speechSynthesis" in window
    ) {

        window
            .speechSynthesis
            .onvoiceschanged =
            function () {

                chooseCuratorVoice();

            };
    }


    /*
        NORMAL ELIAS SPEECH
    */

    function speakAsCurator(line) {

        return new Promise(
            function (resolve) {

                if (
                    !(
                        "speechSynthesis"
                        in window
                    )
                ) {

                    setTimeout(
                        resolve,
                        1200
                    );

                    return;
                }


                let completed =
                    false;


                function finish() {

                    if (completed) {

                        return;
                    }

                    completed =
                        true;

                    resolve();
                }


                const safetyTime =
                    Math.min(
                        16000,
                        Math.max(
                            6500,
                            line.length * 150
                        )
                    );


                const timer =
                    setTimeout(
                        function () {

                            try {

                                window
                                    .speechSynthesis
                                    .cancel();

                            } catch (
                                error
                            ) {

                                // Ignore.

                            }

                            finish();

                        },
                        safetyTime
                    );


                try {

                    chooseCuratorVoice();


                    const speech =
                        new SpeechSynthesisUtterance(
                            line
                        );


                    if (curatorVoice) {

                        speech.voice =
                            curatorVoice;

                    }


                    speech.rate =
                        0.78;

                    speech.pitch =
                        0.95;

                    speech.volume =
                        1;


                    speech.onend =
                        function () {

                            clearTimeout(
                                timer
                            );

                            setTimeout(
                                finish,
                                250
                            );

                        };


                    speech.onerror =
                        function () {

                            clearTimeout(
                                timer
                            );

                            setTimeout(
                                finish,
                                400
                            );

                        };


                    window
                        .speechSynthesis
                        .speak(
                            speech
                        );


                } catch (
                    error
                ) {

                    clearTimeout(
                        timer
                    );

                    finish();

                }

            }
        );
    }


    /*
        LEVEL 2 SPEAKER VOICE

        Deliberately different from Elias.
        Slightly quicker and flatter so it
        sounds like an old recording.
    */

    function speakSpeakerRecording(
        line,
        speakerNumber
    ) {

        return new Promise(
            function (resolve) {

                if (
                    !(
                        "speechSynthesis"
                        in window
                    )
                ) {

                    setTimeout(
                        resolve,
                        1000
                    );

                    return;
                }


                try {

                    window
                        .speechSynthesis
                        .cancel();


                    const voices =
                        getEnglishVoices();


                    let recordingVoice =
                        voices.find(
                            function (voice) {

                                return (
                                    curatorVoice &&
                                    voice.name !==
                                        curatorVoice.name
                                );

                            }
                        )

                        ||

                        voices[0]

                        ||

                        null;


                    const speech =
                        new SpeechSynthesisUtterance(
                            line
                        );


                    if (recordingVoice) {

                        speech.voice =
                            recordingVoice;

                    }


                    /*
                        Tiny differences between
                        the three recordings.
                    */

                    if (
                        speakerNumber === 2
                    ) {

                        speech.rate =
                            0.88;

                        speech.pitch =
                            0.92;

                    } else {

                        speech.rate =
                            0.84;

                        speech.pitch =
                            1.0;

                    }


                    speech.volume =
                        0.9;


                    let finished =
                        false;


                    function finish() {

                        if (finished) {

                            return;

                        }

                        finished =
                            true;

                        resolve();
                    }


                    speech.onend =
                        function () {

                            setTimeout(
                                finish,
                                150
                            );

                        };


                    speech.onerror =
                        finish;


                    setTimeout(
                        finish,
                        7000
                    );


                    window
                        .speechSynthesis
                        .speak(
                            speech
                        );


                } catch (
                    error
                ) {

                    resolve();

                }

            }
        );
    }


    /*
        FIRST INTRO LINE
    */

    function speakFirstIntroLineImmediately() {

        return new Promise(
            function (resolve) {

                showScreen(
                    introScreen
                );


                introText.textContent =
                    introLines[0];


                introText.classList.remove(
                    "hidden"
                );


                if (
                    !(
                        "speechSynthesis"
                        in window
                    )
                ) {

                    setTimeout(
                        resolve,
                        1200
                    );

                    return;
                }


                try {

                    window
                        .speechSynthesis
                        .cancel();


                    window
                        .speechSynthesis
                        .resume();


                    chooseCuratorVoice();


                    const speech =
                        new SpeechSynthesisUtterance(
                            introLines[0]
                        );


                    if (
                        curatorVoice
                    ) {

                        speech.voice =
                            curatorVoice;

                    }


                    speech.rate =
                        0.78;

                    speech.pitch =
                        0.95;

                    speech.volume =
                        1;


                    let done =
                        false;


                    function finish() {

                        if (done) {

                            return;

                        }

                        done =
                            true;

                        resolve();

                    }


                    speech.onend =
                        function () {

                            setTimeout(
                                finish,
                                300
                            );

                        };


                    speech.onerror =
                        function () {

                            setTimeout(
                                finish,
                                500
                            );

                        };


                    setTimeout(
                        finish,
                        6500
                    );


                    window
                        .speechSynthesis
                        .speak(
                            speech
                        );


                } catch (
                    error
                ) {

                    setTimeout(
                        resolve,
                        500
                    );

                }

            }
        );
    }


    /*
        REST OF INTRO
    */

    async function showDialogueLine(
        line
    ) {

        introText.classList.add(
            "hidden"
        );


        await wait(300);


        introText.textContent =
            line;


        introText.classList.remove(
            "hidden"
        );


        await speakAsCurator(
            line
        );


        await wait(200);
    }


    async function continueIntroduction(
        firstLinePromise
    ) {

        startButton.disabled =
            true;


        await firstLinePromise;


        for (
            let i = 1;
            i < introLines.length;
            i++
        ) {

            await showDialogueLine(
                introLines[i]
            );

        }


        introText.classList.add(
            "hidden"
        );


        await wait(600);


        loadLevel();


        await fadeToScreen(
            introScreen,
            levelScreen
        );


        startButton.disabled =
            false;
    }


    /*
        JOURNAL
    */

    function addJournalEntry(
        level,
        investigation
    ) {

        const exists =
            journalEntries.some(
                function (entry) {

                    return (
                        entry.level ===
                            level.number

                        &&

                        entry.id ===
                            investigation.id
                    );

                }
            );


        if (!exists) {

            journalEntries.push(
                {
                    level:
                        level.number,

                    id:
                        investigation.id,

                    name:
                        investigation.name,

                    description:
                        investigation.description
                }
            );

        }
    }


    function renderJournal() {

        if (
            !journalEntries.length
        ) {

            journalContent.innerHTML =
                "<p>No evidence recorded yet.</p>";

            return;
        }


        const grouped = {};


        journalEntries.forEach(
            function (entry) {

                if (
                    !grouped[
                        entry.level
                    ]
                ) {

                    grouped[
                        entry.level
                    ] = [];

                }


                grouped[
                    entry.level
                ].push(
                    entry
                );

            }
        );


        journalContent.innerHTML =
            Object.keys(
                grouped
            )

            .map(
                function (
                    levelNumber
                ) {

                    const entries =
                        grouped[
                            levelNumber
                        ]

                        .map(
                            function (
                                entry
                            ) {

                                return `
                                    <article
                                        class="journal-entry"
                                    >

                                        <h4>
                                            ${entry.name}
                                        </h4>

                                        <p>
                                            ${entry.description}
                                        </p>

                                    </article>
                                `;

                            }
                        )

                        .join("");


                    return `
                        <section
                            class="journal-level"
                        >

                            <h3>
                                Room ${levelNumber}
                            </h3>

                            ${entries}

                        </section>
                    `;

                }
            )

            .join("");
    }


    /*
        KEYPAD OVERLAY
    */

    function showPuzzleOverlay() {

        if (puzzleVisible) {

            return;
        }


        puzzleVisible =
            true;


        puzzleOverlay.style.display =
            "flex";


        puzzleOverlay.scrollTop =
            0;
    }


    function hidePuzzleOverlay() {

        puzzleVisible =
            false;


        puzzleOverlay.style.display =
            "none";
    }


    /*
        RESET LEVEL
    */

    function resetLevelState() {

        investigatedIds =
            new Set();


        playedSpeakerIds =
            new Set();
  /*
        LEVEL 3 RESET
    */

    subject19RecordingPlayed =
        false;

    sequenceEntry =
        [];

    sequenceSolved =
        false;

    subjectRecorder.classList.remove(
        "active",
        "playing"
    );

    sequenceControl.classList.remove(
        "active"
    );

    sequenceStatus.textContent =
        "";

    sequenceStatus.classList.remove(
        "correct",
        "wrong"
    );

    updateSequenceDisplay();


    puzzleSolved =
        false;


    keypadEntry =
        "";

        puzzleSolved =
            false;


        keypadEntry =
            "";


        transitionRunning =
            false;


        hidePuzzleOverlay();


        speakerWall.innerHTML =
            "";


        speakerWall.classList.remove(
            "active"
        );


        evidenceCard.textContent =
            "Select an object to examine it.";


        evidenceProgress.textContent =
            "";


        puzzleStatus.textContent =
            "";


        puzzleStatus.classList.remove(
            "correct",
            "wrong"
        );


        doorTransition.classList.remove(
            "active",
            "opening"
        );


        updateKeypadDisplay();
    }


    /*
        KEYPAD
    */

    function updateKeypadDisplay() {

        keypadDisplay.textContent =
            keypadEntry
                .padEnd(
                    4,
                    "_"
                )
                .split("")
                .join(" ");
    }


    /*
        LEVEL 2 SPEAKERS
    */

    function allSpeakersPlayed(
        level
    ) {

        if (
            !level.speakers ||
            !level.speakers.length
        ) {

            return true;
        }


        return (
            playedSpeakerIds.size >=
            level.speakers.length
        );
    }


    async function playSpeaker(
        level,
        speaker,
        speakerNumber,
        button,
        unit,
        statement
    ) {

        playedSpeakerIds.add(
            speaker.id
        );


        button.classList.add(
            "played"
        );


        button.textContent =
            "REPLAY";


        statement.textContent =
            "\"" +
            speaker.statement +
            "\"";


        unit.classList.add(
            "playing"
        );


        updateLevelProgress(
            level
        );


        await speakSpeakerRecording(
            speaker.statement,
            speakerNumber
        );


        unit.classList.remove(
            "playing"
        );
    }


    function renderSpeakers(
        level
    ) {

        speakerWall.innerHTML =
            "";


        if (
            !level.speakers ||
            !level.speakers.length
        ) {

            speakerWall.classList.remove(
                "active"
            );

            return;
        }


        speakerWall.classList.add(
            "active"
        );


        level.speakers.forEach(
            function (
                speaker,
                index
            ) {

                const unit =
                    document.createElement(
                        "article"
                    );


                unit.className =
                    "speaker-unit";


                const label =
                    document.createElement(
                        "div"
                    );


                label.className =
                    "speaker-label";


                label.textContent =
                    speaker.label;


                const grille =
                    document.createElement(
                        "div"
                    );


                grille.className =
                    "speaker-grille";


                const playButton =
                    document.createElement(
                        "button"
                    );


                playButton.type =
                    "button";


                playButton.className =
                    "speaker-play";


                playButton.textContent =
                    "PLAY";


                const statement =
                    document.createElement(
                        "div"
                    );


                statement.className =
                    "speaker-statement";


                statement.textContent =
                    "Recording ready.";


                playButton.addEventListener(
                    "click",
                    function () {

                        playSpeaker(
                            level,
                            speaker,
                            index + 1,
                            playButton,
                            unit,
                            statement
                        );

                    }
                );


                unit.appendChild(
                    label
                );


                unit.appendChild(
                    grille
                );


                unit.appendChild(
                    playButton
                );


                unit.appendChild(
                    statement
                );


                speakerWall.appendChild(
                    unit
                );

            }
        );
    }

/*
    ========================================
    SUBJECT 19 VOICE
    ========================================
*/

function speakAsSubject19(line) {

    return new Promise(
        function (resolve) {

            if (
                !(
                    "speechSynthesis"
                    in window
                )
            ) {

                setTimeout(
                    resolve,
                    1200
                );

                return;
            }


            try {

                window
                    .speechSynthesis
                    .cancel();


                const voices =
                    getEnglishVoices();


                /*
                    Try to use a voice other
                    than Elias.
                */

                let subjectVoice =
                    voices.find(
                        function (voice) {

                            return (
                                curatorVoice &&
                                voice.name !==
                                    curatorVoice.name
                            );

                        }
                    )

                    ||

                    voices[0]

                    ||

                    null;


                const speech =
                    new SpeechSynthesisUtterance(
                        line
                    );


                if (subjectVoice) {

                    speech.voice =
                        subjectVoice;

                }


                /*
                    Subject 19 should sound
                    frightened and tired,
                    not theatrical.
                */

                speech.rate =
                    0.83;

                speech.pitch =
                    0.96;

                speech.volume =
                    0.9;


                let finished =
                    false;


                function finish() {

                    if (finished) {

                        return;

                    }


                    finished =
                        true;


                    resolve();
                }


                speech.onend =
                    function () {

                        setTimeout(
                            finish,
                            200
                        );

                    };


                speech.onerror =
                    finish;


                setTimeout(
                    finish,
                    7000
                );


                window
                    .speechSynthesis
                    .speak(
                        speech
                    );


            } catch (
                error
            ) {

                resolve();

            }

        }
    );
}


/*
    SUBJECT 19 RECORDING
*/

async function playSubject19Recording() {

    const level =
        levels[
            currentLevelIndex
        ];


    if (
        !level.recording
    ) {

        return;
    }


    subject19RecordingPlayed =
        true;


    subjectRecorder.classList.add(
        "playing"
    );


    subject19Play.textContent =
        "REPLAY RECORDING";


    subject19Play.classList.add(
        "played"
    );


    for (
        const line
        of level.recording.lines
    ) {

        subject19Transcript.textContent =
            "\"" +
            line +
            "\"";


        await speakAsSubject19(
            line
        );


        /*
            Deliberate silence between
            fragments of the recording.
        */

        await wait(800);
    }


    subjectRecorder.classList.remove(
        "playing"
    );


    subject19Transcript.textContent =
        "The recording ends abruptly.";


    await wait(1100);


    if (
        level.recording.curatorAfter
    ) {

        curatorMessage.textContent =
            level.recording
                .curatorAfter;


        await speakAsCurator(
            level.recording
                .curatorAfter
        );

    }


    updateLevelProgress(
        level
    );
}


/*
    SHOW RECORDER ONLY AFTER
    THE PLAYER FINDS IT
*/

function updateLevel3Recorder(
    level
) {

    if (
        !level.recording
    ) {

        subjectRecorder.classList.remove(
            "active"
        );

        return;
    }


    if (
        investigatedIds.has(
            "recorder"
        )
    ) {

        subjectRecorder.classList.add(
            "active"
        );

    } else {

        subjectRecorder.classList.remove(
            "active"
        );

    }
}


/*
    ========================================
    LEVEL 3 SEQUENCE PUZZLE
    ========================================
*/

function updateSequenceDisplay() {

    const visible =
        sequenceEntry.slice();


    while (
        visible.length < 4
    ) {

        visible.push(
            "_"
        );

    }


    sequenceDisplay.textContent =
        visible.join(
            " → "
        );
}


function arraysMatch(
    first,
    second
) {

    if (
        first.length !==
        second.length
    ) {

        return false;

    }


    return first.every(
        function (
            value,
            index
        ) {

            return (
                value ===
                second[index]
            );

        }
    );
}


async function submitSequenceInput(
    direction
) {

    const level =
        levels[
            currentLevelIndex
        ];


    if (
        !level.sequencePuzzle ||
        sequenceSolved
    ) {

        return;
    }


    if (
        sequenceEntry.length >=
        4
    ) {

        return;
    }


    sequenceEntry.push(
        direction
    );


    updateSequenceDisplay();


    /*
        Do not reveal whether individual
        presses are correct.

        Only judge the full four-input
        sequence.
    */

    if (
        sequenceEntry.length < 4
    ) {

        return;
    }


    await wait(350);


    if (
        arraysMatch(
            sequenceEntry,
            level.sequencePuzzle.answer
        )
    ) {

        sequenceSolved =
            true;


        sequenceStatus.textContent =
            level.sequencePuzzle.correct;


        sequenceStatus.classList.remove(
            "wrong"
        );


        sequenceStatus.classList.add(
            "correct"
        );


        choicesContainer
            .querySelectorAll(
                ".choice"
            )
            .forEach(
                function (button) {

                    button.disabled =
                        false;

                }
            );
evidenceProgress.textContent =
    "The release mechanism disengages. The steel door is unlocked.";
/*
    Close the restraint control
    now that the puzzle is solved.
*/

sequenceControl.classList.remove(
    "active"
);

/*
    DO NOT OPEN THE DOOR YET.

    The player must physically press
    the Heavy Steel Door.
*/

        choicesContainer.classList.remove(
            "choices-locked"
        );


        if (
            level.sequencePuzzle
                .curatorSuccess
        ) {

            curatorMessage.textContent =
                level.sequencePuzzle
                    .curatorSuccess;


            await speakAsCurator(
                level.sequencePuzzle
                    .curatorSuccess
            );

        }


    } else {

        sequenceStatus.textContent =
            level.sequencePuzzle.wrong;


        sequenceStatus.classList.remove(
            "correct"
        );


        sequenceStatus.classList.add(
            "wrong"
        );


        await wait(900);


        /*
            Wrong answer does not kill
            the player.

            The mechanism simply resets.
        */

        sequenceEntry =
            [];


        updateSequenceDisplay();


        sequenceStatus.textContent =
            "CONTROL RESET";


        await wait(700);


        sequenceStatus.textContent =
            "";


        sequenceStatus.classList.remove(
            "wrong"
        );

    }
}


sequenceLeft.addEventListener(
    "click",
    function () {

        submitSequenceInput(
            "LEFT"
        );

    }
);


sequenceRight.addEventListener(
    "click",
    function () {

        submitSequenceInput(
            "RIGHT"
        );

    }
);


subject19Play.addEventListener(
    "click",
    function () {

        playSubject19Recording();

    }
);


/*
    LEVEL 3 CONTROL VISIBILITY
*/

function updateLevel3Sequence(
    level
) {

    if (
        !level.sequencePuzzle
    ) {

        sequenceControl.classList.remove(
            "active"
        );

        return;
    }


    const required =
        level.requiredInvestigations
        || 0;


    /*
        The player must:

        - investigate enough evidence
        - discover the recorder
        - actually listen to Subject 19
    */

    const ready =
        investigatedIds.size >=
            required

        &&

        investigatedIds.has(
            "recorder"
        )

        &&

        subject19RecordingPlayed;


    if (ready) {

        sequenceControl.classList.add(
            "active"
        );

    } else {

        sequenceControl.classList.remove(
            "active"
        );

    }
}
    /*
    ========================================
    LEVEL 4 — PRESSURE ENGINE
    ========================================
*/


function updatePressureSequenceDisplay() {

    const visible =
        pressureEntry.slice();


    while (
        visible.length < 4
    ) {

        visible.push(
            "_"
        );

    }


    pressureSequenceDisplay.textContent =
        visible.join(
            " → "
        );
}


function resetPressureState() {

    pressureEntry =
        [];

    pressureSolved =
        false;

    pressureRunning =
        false;

    pressureDeadline =
        0;

    pressureHalfwaySpoken =
        false;

    pressureWarningSpoken =
        false;


    if (
        pressureTimer
    ) {

        clearInterval(
            pressureTimer
        );

        pressureTimer =
            null;
    }


    pressureOverlay.classList.remove(
        "active",
        "warning-stage",
        "crushed"
    );


    pressureCeiling.style.height =
        "10%";


    pressureWarning.textContent =
        "SYSTEM IDLE";


    pressureEvidence.textContent =
        "Examine the chamber.";


    pressureStatus.textContent =
        "";


    pressureStatus.classList.remove(
        "correct",
        "wrong"
    );


    pressureInvestigationButtons.forEach(
        function (button) {

            button.classList.remove(
                "investigated"
            );

        }
    );


    updatePressureSequenceDisplay();
}


function getCurrentPressureLevel() {

    const level =
        levels[
            currentLevelIndex
        ];


    if (
        !level ||
        !level.pressurePuzzle
    ) {

        return null;
    }


    return level;
}


async function investigatePressureObject(
    button
) {

    const level =
        getCurrentPressureLevel();


    if (
        !level ||
        pressureSolved
    ) {

        return;
    }


    const investigationId =
        button.dataset
            .investigation;


    const investigation =
        level.investigations.find(
            function (item) {

                return (
                    item.id ===
                    investigationId
                );

            }
        );


    if (
        !investigation
    ) {

        return;
    }


    const firstVisit =
        !investigatedIds.has(
            investigation.id
        );


    investigatedIds.add(
        investigation.id
    );


    addJournalEntry(
        level,
        investigation
    );


    button.classList.add(
        "investigated"
    );


    pressureEvidence.innerHTML = `
        <strong>
            ${investigation.icon || ""}
            ${investigation.name}
        </strong>

        <span>
            ${investigation.description}
        </span>
    `;


    if (
        firstVisit &&
        investigation.curator
    ) {

        curatorMessage.textContent =
            investigation.curator;


        await speakAsCurator(
            investigation.curator
        );

    }
}


async function submitPressureSymbol(
    symbol
) {

    const level =
        getCurrentPressureLevel();


    if (
        !level ||
        pressureSolved ||
        !pressureRunning
    ) {

        return;
    }


    if (
        pressureEntry.length >=
        4
    ) {

        return;
    }


    pressureEntry.push(
        symbol
    );


    updatePressureSequenceDisplay();


    if (
        pressureEntry.length < 4
    ) {

        return;
    }


    await wait(
        250
    );


    if (
        arraysMatch(
            pressureEntry,
            level.pressurePuzzle.answer
        )
    ) {

        pressureSolved =
            true;

        pressureRunning =
            false;


        if (
            pressureTimer
        ) {

            clearInterval(
                pressureTimer
            );

            pressureTimer =
                null;
        }


        pressureStatus.textContent =
            level.pressurePuzzle.correct;


        pressureStatus.classList.remove(
            "wrong"
        );


        pressureStatus.classList.add(
            "correct"
        );


        pressureWarning.textContent =
            "CEILING HALTED";


        pressureOverlay.classList.remove(
            "warning-stage"
        );


        pressureCeiling.style.height =
            "10%";


        /*
            Give the ceiling time
            to retract.
        */

        await wait(
            1600
        );


        pressureWarning.textContent =
            "EXIT UNLOCKED";


        choicesContainer
            .querySelectorAll(
                ".choice"
            )
            .forEach(
                function (button) {

                    button.disabled =
                        false;

                }
            );


        choicesContainer.classList.remove(
            "choices-locked"
        );


        pressureOverlay.classList.remove(
            "active"
        );


        if (
            level.pressurePuzzle
                .curatorSuccess
        ) {

            curatorMessage.textContent =
                level.pressurePuzzle
                    .curatorSuccess;


            await speakAsCurator(
                level.pressurePuzzle
                    .curatorSuccess
            );

        }


    } else {

        pressureStatus.textContent =
            level.pressurePuzzle.wrong;


        pressureStatus.classList.remove(
            "correct"
        );


        pressureStatus.classList.add(
            "wrong"
        );


        await wait(
            700
        );


        pressureEntry =
            [];


        updatePressureSequenceDisplay();


        pressureStatus.textContent =
            "CONTROL RESET";


        await wait(
            500
        );


        pressureStatus.textContent =
            "";


        pressureStatus.classList.remove(
            "wrong"
        );

    }
}


/*
    ========================================
    LEVEL 4 — FAILURE / CEILING ENGINE
    ========================================
*/


async function pressureFailure() {

    const level =
        getCurrentPressureLevel();


    if (
        !level ||
        pressureSolved
    ) {

        return;
    }


    pressureRunning =
        false;


    if (
        pressureTimer
    ) {

        clearInterval(
            pressureTimer
        );

        pressureTimer =
            null;
    }


    pressureSymbolButtons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    pressureInvestigationButtons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    pressureWarning.textContent =
        "STRUCTURAL LIMIT REACHED";


    /*
        Normal room reaches its limit.
    */

    pressureCeiling.style.height =
        "100%";


    pressureOverlay.classList.add(
        "crushed"
    );


    await wait(
        500
    );


    pressureOverlay.classList.remove(
        "active"
    );


    /*
        ========================================
        FIRST-PERSON DEATH CINEMATIC
        ========================================
    */

    let cinematic =
        document.getElementById(
            "pressureDeathCinematic"
        );


    if (
        !cinematic
    ) {

        cinematic =
            document.createElement(
                "div"
            );


        cinematic.id =
            "pressureDeathCinematic";


        cinematic.className =
            "pressure-death-cinematic";


        cinematic.innerHTML = `

            <div class="pressure-death-view">

                <div
                    class="pressure-death-ceiling"
                ></div>

                <div
                    class="pressure-death-vignette"
                ></div>

                <div
                    class="pressure-death-message"
                >
                    LOOK UP.
                </div>

                <div
                    class="pressure-death-blackout"
                ></div>

            </div>

        `;


        document.body.appendChild(
            cinematic
        );

    }


    cinematic.classList.remove(
        "closing",
        "shaking",
        "blackout"
    );


    cinematic.classList.add(
        "active"
    );


    await wait(
        300
    );


    /*
        Ceiling approaches the player's face.
    */

    cinematic.classList.add(
        "closing"
    );


    await wait(
        2300
    );


    cinematic.classList.add(
        "shaking"
    );


    await wait(
        2200
    );


    /*
        SUBJECT 28 SCREAM
    */

    try {

        const subjectScream =
            new Audio(
                "distant-scream.wav"
            );


        subjectScream.preload =
            "auto";


        subjectScream.volume =
            0.95;


        subjectScream.currentTime =
            0;


        const screamAttempt =
            subjectScream.play();


        if (
            screamAttempt &&
            typeof screamAttempt.catch ===
            "function"
        ) {

            screamAttempt.catch(
                function () {

                    // Continue without audio.

                }
            );

        }

    } catch (
        error
    ) {

        // Continue cinematic.

    }


    await wait(
        850
    );


    cinematic.classList.add(
        "blackout"
    );


    await wait(
        900
    );


    cinematic.classList.remove(
        "active",
        "closing",
        "shaking"
    );


    deathMessage.textContent =
        "SUBJECT 28 — TERMINATED. CAUSE: FAILURE UNDER PRESSURE.";


    curatorMessage.textContent =
        level.death;


    showScreen(
        deathScreen
    );
}


/*
    ========================================
    DESCENDING CEILING UPDATE
    ========================================
*/

function updatePressureCeiling(
    level
) {

    if (
        !pressureRunning ||
        pressureSolved
    ) {

        return;
    }


    const now =
        Date.now();


    const totalTime =
        level.pressurePuzzle
            .timeLimit *
        1000;


    const remaining =
        Math.max(
            0,
            pressureDeadline -
            now
        );


    const progress =
        1 -
        (
            remaining /
            totalTime
        );


    /*
        Start at 10% of the screen.

        Gradually descend to 94%.
    */

    const ceilingHeight =
        10 +
        (
            progress *
            84
        );


    pressureCeiling.style.height =
        ceilingHeight +
        "%";


    /*
        HALF-WAY WARNING
    */

    if (
        progress >=
            0.5 &&
        !pressureHalfwaySpoken
    ) {

        pressureHalfwaySpoken =
            true;


        if (
            level.pressurePuzzle
                .curatorHalfway
        ) {

            curatorMessage.textContent =
                level.pressurePuzzle
                    .curatorHalfway;


            speakAsCurator(
                level.pressurePuzzle
                    .curatorHalfway
            );

        }

    }


    /*
        ROOM BEGINS TO SHAKE.
    */

    if (
        progress >=
        0.72
    ) {

        pressureOverlay.classList.add(
            "warning-stage"
        );

    }


    /*
        FINAL ELIAS WARNING.
    */

    if (
        progress >=
            0.82 &&
        !pressureWarningSpoken
    ) {

        pressureWarningSpoken =
            true;


        if (
            level.pressurePuzzle
                .curatorWarning
        ) {

            curatorMessage.textContent =
                level.pressurePuzzle
                    .curatorWarning;


            speakAsCurator(
                level.pressurePuzzle
                    .curatorWarning
            );

        }

    }


    /*
        TIME HAS EXPIRED.
    */

    if (
        remaining <=
        0
    ) {

        pressureFailure();

    }
}


/*
    ========================================
    START LEVEL 4 PRESSURE SYSTEM
    ========================================
*/

async function startPressureLevel(
    level
) {

    if (
        !level ||
        !level.pressurePuzzle
    ) {

        return;
    }


    resetPressureState();


    /*
        Re-enable controls in case the
        player previously died and retried.
    */

    pressureSymbolButtons.forEach(
        function (button) {

            button.disabled =
                false;

        }
    );


    pressureInvestigationButtons.forEach(
        function (button) {

            button.disabled =
                false;

        }
    );


    pressureOverlay.classList.add(
        "active"
    );


    pressureWarning.textContent =
        "CHAMBER SEALED";


    await wait(
        700
    );


    pressureWarning.textContent =
        "PRESSURE SYSTEM ARMED";


    await wait(
        700
    );


    pressureRunning =
        true;


    pressureDeadline =
        Date.now() +
        (
            level.pressurePuzzle
                .timeLimit *
            1000
        );


    pressureWarning.textContent =
        "CEILING DESCENDING";


    /*
        Run immediately once so the
        ceiling system is definitely alive.
    */

    updatePressureCeiling(
        level
    );


    pressureTimer =
        setInterval(
            function () {

                updatePressureCeiling(
                    level
                );

            },
            100
        );
}
/*
    LEVEL 4 INVESTIGATION BUTTONS
*/

pressureInvestigationButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                investigatePressureObject(
                    button
                );

            }
        );

    }
);


/*
    LEVEL 4 SYMBOL BUTTONS
*/

pressureSymbolButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                submitPressureSymbol(
                    button.dataset.symbol
                );

            }
        );

    }
);
    /*
        LEVEL PROGRESS
    */

    function updateLevelProgress(
        level
    ) {

        const required =
            level
                .requiredInvestigations
                || 0;


        const found =
            investigatedIds.size;


        const hasInvestigations =
            level.investigations &&
            level.investigations.length > 0;


        const speakersComplete =
            allSpeakersPlayed(
                level
            );


        if (
            level.speakers &&
            level.speakers.length
        ) {

            const heard =
                playedSpeakerIds.size;


            evidenceProgress.textContent =
                "Recordings heard: " +
                heard +
                " / " +
                level.speakers.length +
                " — Evidence examined: " +
                found +
                " / " +
                required;


            if (
                found >= required &&
                speakersComplete
            ) {

                evidenceProgress.textContent =
                    "Evidence complete. The three doors unlock.";

            }

        } else if (
            hasInvestigations
        ) {

            if (
                found >= required
            ) {

                evidenceProgress.textContent =
                    "Enough evidence gathered.";

            } else {

                evidenceProgress.textContent =
                    "Evidence examined: " +
                    found +
                    " / " +
                    required;

            }

        }


        /*
            LEVEL 1 KEYPAD
        */

        if (
            level.puzzle &&
            found >= required &&
            !puzzleSolved
        ) {

            showPuzzleOverlay();

        }


        const choiceButtons =
            choicesContainer
                .querySelectorAll(
                    ".choice"
                );


        /*
            KEYPAD LEVEL
        */

        if (
            level.puzzle
        ) {

            choiceButtons.forEach(
                function (button) {

                    button.disabled =
                        !puzzleSolved;

                }
            );


            choicesContainer.classList.toggle(
                "choices-locked",
                !puzzleSolved
            );


            return;
        }


        /*
            SPEAKER LEVEL

            Must hear ALL recordings AND
            examine ALL required evidence.
        */

        if (
            level.speakers &&
            level.speakers.length
        ) {

            const unlocked =
                found >= required &&
                speakersComplete;


            choiceButtons.forEach(
                function (button) {

                    button.disabled =
                        !unlocked;

                }
            );


            choicesContainer.classList.toggle(
                "choices-locked",
                !unlocked
            );


            return;
        }

/*
    LEVEL 3 SEQUENCE PUZZLE
*/

if (
    level.sequencePuzzle
) {

    updateLevel3Recorder(
        level
    );


    updateLevel3Sequence(
        level
    );


    /*
        Keep the exit locked
        until the LEFT / RIGHT
        sequence is solved.
    */

    choiceButtons.forEach(
        function (button) {

            button.disabled =
                !sequenceSolved;

        }
    );


    choicesContainer.classList.toggle(
        "choices-locked",
        !sequenceSolved
    );


    return;
}
        /*
            NORMAL INVESTIGATION LEVEL
        */

        const unlocked =
            !hasInvestigations ||
            found >= required;


        choiceButtons.forEach(
            function (button) {

                button.disabled =
                    !unlocked;

            }
        );


        choicesContainer.classList.toggle(
            "choices-locked",
            !unlocked
        );
    }


    /*
        INVESTIGATE
    */

    async function investigate(
        level,
        investigation,
        button
    ) {

        const firstVisit =
            !investigatedIds.has(
                investigation.id
            );


        investigatedIds.add(
            investigation.id
        );


        addJournalEntry(
            level,
            investigation
        );


        evidenceCard.innerHTML = `
            <strong>
                ${investigation.icon || ""}
                ${investigation.name}
            </strong>

            <span>
                ${investigation.description}
            </span>
        `;


        button.classList.add(
            "investigated"
        );


        if (
            firstVisit &&
            investigation.curator
        ) {

            curatorMessage.textContent =
                investigation.curator;


            await speakAsCurator(
                investigation.curator
            );

        }

updateLevel3Recorder(
    level
);

updateLevel3Sequence(
    level
);
        updateLevelProgress(
            level
        );
    }


    function renderInvestigations(
        level
    ) {

        investigationGrid.innerHTML =
            "";


        if (
            !level.investigations ||
            !level.investigations.length
        ) {

            investigationPanel.classList.add(
                "hidden-panel"
            );

            return;
        }


        investigationPanel.classList.remove(
            "hidden-panel"
        );


        level.investigations.forEach(
            function (
                investigation
            ) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "investigation-button";


                button.type =
                    "button";


                button.innerHTML = `
                    <span
                        class="investigation-icon"
                    >
                        ${investigation.icon || "?"}
                    </span>

                    <span>
                        ${investigation.name}
                    </span>
                `;


                button.addEventListener(
                    "click",
                    function () {

                        investigate(
                            level,
                            investigation,
                            button
                        );

                    }
                );


                investigationGrid.appendChild(
                    button
                );

            }
        );
    }


    /*
        PUZZLE SETUP
    */

    function setupPuzzle(
        level
    ) {

        keypadEntry =
            "";


        puzzleStatus.textContent =
            "";


        updateKeypadDisplay();


        hidePuzzleOverlay();


        if (
            !level.puzzle
        ) {

            return;
        }


        puzzleTitle.textContent =
            level.puzzle.title;


        puzzleInstruction.textContent =
            level.puzzle.instruction;
    }


    /*
        SUBMIT KEYPAD
    */

    async function submitKeypad() {

        const level =
            levels[
                currentLevelIndex
            ];


        if (
            !level.puzzle
        ) {

            return;
        }


        if (
            keypadEntry ===
            level.puzzle.answer
        ) {

            puzzleSolved =
                true;


            puzzleStatus.textContent =
                level.puzzle.correct;


            puzzleStatus.classList.remove(
                "wrong"
            );


            puzzleStatus.classList.add(
                "correct"
            );


            updateLevelProgress(
                level
            );


            curatorMessage.textContent =
                level.puzzle
                    .curatorSuccess;


            await wait(250);


            await speakAsCurator(
                level.puzzle
                    .curatorSuccess
            );


            await wait(300);


            hidePuzzleOverlay();


            evidenceProgress.textContent =
                "The doors are unlocked. Choose carefully.";


            choicesContainer
                .querySelectorAll(
                    ".choice"
                )
                .forEach(
                    function (button) {

                        button.disabled =
                            false;

                    }
                );


            choicesContainer
                .classList
                .remove(
                    "choices-locked"
                );


        } else {

            puzzleStatus.textContent =
                level.puzzle.wrong;


            puzzleStatus.classList.remove(
                "correct"
            );


            puzzleStatus.classList.add(
                "wrong"
            );


            keypadEntry =
                "";


            updateKeypadDisplay();

        }
    }


    /*
        KEYPAD BUTTONS
    */

    document
        .querySelectorAll(
            ".keypad-number"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        if (
                            keypadEntry.length >=
                            4
                        ) {

                            return;

                        }


                        keypadEntry +=
                            button.dataset
                                .number;


                        updateKeypadDisplay();

                    }
                );

            }
        );


    keypadClear.addEventListener(
        "click",
        function () {

            keypadEntry =
                "";


            puzzleStatus.textContent =
                "";


            puzzleStatus.classList.remove(
                "correct",
                "wrong"
            );


            updateKeypadDisplay();

        }
    );


    keypadEnter.addEventListener(
        "click",
        submitKeypad
    );


    /*
        LEVEL 1 DOOR CINEMATIC
    */

    async function playDoorOpening(
        soundAlreadyStarted
    ) {

        if (
            transitionRunning
        ) {

            return;

        }


        transitionRunning =
            true;


        doorTransition.classList.add(
            "active"
        );


        if (
            !soundAlreadyStarted &&
            typeof playDoorMusic ===
            "function"
        ) {

            playDoorMusic();

        }


        await wait(700);


        doorTransition.classList.add(
            "opening"
        );


        await wait(4200);


        doorTransition.classList.remove(
            "active",
            "opening"
        );


        transitionRunning =
            false;
    }


    /*
        CORRIDOR SEQUENCE
    */

  /*
    ========================================
    FIRST-PERSON WALKING SEQUENCE
    ========================================
*/

async function playCorridorSequence() {

    /*
        Work out which level has just
        been completed.
    */

    const completedLevel =
        levels[
            currentLevelIndex
        ];


    if (
        corridorLevelText &&
        completedLevel
    ) {

        corridorLevelText.textContent =
            "LEVEL " +
            completedLevel.number +
            " COMPLETE";
    }


    /*
        Completely reset the animation
        before every corridor sequence.
    */

    corridorTransition.classList.remove(
        "active",
        "walking",
        "corridor-fade"
    );


    /*
        Force the browser to restart
        the CSS animation.
    */

    void corridorTransition.offsetWidth;


    corridorTransition.classList.add(
        "active"
    );


    await wait(
        250
    );


    corridorTransition.classList.add(
        "walking"
    );


    /*
        Approximately 6 seconds of walking.
    */

    await wait(
        5800
    );


    corridorTransition.classList.add(
        "corridor-fade"
    );


    await wait(
        700
    );


    corridorTransition.classList.remove(
        "active",
        "walking",
        "corridor-fade"
    );


    /*
        Stop existing haunting corridor
        ambience before entering the room.
    */

    if (
        typeof stopCorridorAmbience ===
        "function"
    ) {

        stopCorridorAmbience();
    }


    await wait(
        250
    );
}


    /*
        LEVEL INTRODUCTION

        Level 2 gets a short Elias
        introduction after the corridor.
    */

    async function playLevelIntroduction(
        level
    ) {

        if (
            !level.intro
        ) {

            return;
        }


        curatorMessage.textContent =
            level.intro;


        await speakAsCurator(
            level.intro
        );
    }


    /*
        LOAD LEVEL
    */

    function loadLevel() {

        const level =
            levels[
                currentLevelIndex
            ];


        resetLevelState();


        levelHeader.innerHTML =
            "<span>SUBJECT 28</span>" +
            "<span>LEVEL " +
            level.number +
            " / 100</span>";


        observationText.textContent =
            level.observation;


        clueText.textContent =
            level.clue;


        questionTitle.textContent =
            level.title;


        questionText.textContent =
            level.question;


        curatorMessage.textContent =
            "";


        choicesContainer.innerHTML =
            "";


        level.choices.forEach(
            function (
                choice,
                choiceIndex
            ) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "choice";


                button.type =
                    "button";


                button.textContent =
                    choice.text;


                button.addEventListener(
                    "click",
                    function () {

                        if (
                            level.puzzle &&
                            !puzzleSolved
                        ) {

                            return;

                        }


                        if (
                            level.speakers &&
                            level.speakers.length
                        ) {

                            const evidenceComplete =
                                investigatedIds.size >=
                                (
                                    level
                                    .requiredInvestigations
                                    || 0
                                );


                            const recordingsComplete =
                                allSpeakersPlayed(
                                    level
                                );


                            if (
                                !evidenceComplete ||
                                !recordingsComplete
                            ) {

                                return;

                            }
                        }


                        let soundStarted =
                            false;


                        if (
                            choice.correct &&
                            level.number === 1 &&
                            typeof playDoorMusic ===
                            "function"
                        ) {

                            playDoorMusic();

                            soundStarted =
                                true;

                        }


                        handleChoice(
                            choice,
                            soundStarted,
                            choiceIndex
                        );

                    }
                );


                choicesContainer.appendChild(
                    button
                );

            }
        );


        renderSpeakers(
            level
        );


        renderInvestigations(
            level
        );


        setupPuzzle(
            level
        );


        updateLevelProgress(
            level
        );
    }


    /*
        PLAYER CHOICE
    */

    async function handleChoice(
        choice,
        soundStarted
    ) {

        const level =
            levels[
                currentLevelIndex
            ];


        if (
            transitionRunning
        ) {

            return;

        }


        choicesContainer
            .querySelectorAll(
                ".choice"
            )
            .forEach(
                function (button) {

                    button.disabled =
                        true;

                }
            );

if (
    choice.correct
) {
        /*
    LEVEL 1 DOOR
*/

if (
    level.number === 1
) {

    curatorMessage.textContent =
        "The lock releases.";

    await wait(350);

    await playDoorOpening(
        soundStarted
    );

}


/*
    LEVEL 3 — HEAVY STEEL DOOR

    This only happens when the PLAYER
    actually presses the unlocked door.
*/

if (
    level.number === 3
) {

    curatorMessage.textContent =
        "The steel door begins to move.";


    /*
        Start the real door creak.
    */

    if (
        typeof playDoorMusic ===
        "function"
    ) {

        playDoorMusic();

    }


    /*
        Give the door time to open.
    */

    await wait(3200);


    /*
        NOW the scream comes from
        somewhere beyond the doorway.
    */

   if (
    typeof playDistantScream ===
    "function"
) {

    playDistantScream();

}


/*
    Let the scream echo and fade
    before Elias speaks.
*/

await wait(4500);

}


            successLabel.textContent =
                "LEVEL " +
                level.number +
                " COMPLETE";


            successTitle.textContent =
                "You chose correctly.";


            successMessage.textContent =
                level.success;


            curatorMessage.textContent =
                level.success;


            await speakAsCurator(
                level.success
            );


            await fadeToScreen(
                levelScreen,
                successScreen
            );


        } else {

            /*
                Level 2 can have a specific
                consequence for each wrong door.
            */

            const failureText =
                choice.consequence
                    ? choice.consequence +
                      " " +
                      level.death
                    : level.death;


            deathMessage.textContent =
                failureText;


            curatorMessage.textContent =
                level.death;


            await speakAsCurator(
                level.death
            );


            await fadeToScreen(
                levelScreen,
                deathScreen
            );

        }
    }


    /*
        JOURNAL
    */

    journalButton.addEventListener(
        "click",
        function () {

            renderJournal();


            journalOverlay.classList.add(
                "open"
            );

        }
    );


    closeJournalButton
        .addEventListener(
            "click",
            function () {

                journalOverlay.classList.remove(
                    "open"
                );

            }
        );


    journalOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                journalOverlay
            ) {

                journalOverlay.classList.remove(
                    "open"
                );

            }

        }
    );


    /*
        BEGIN TRIAL
    */

    startButton.addEventListener(
        "click",
        function () {

            startButton.disabled =
                true;


            try {

                if (
                    typeof startAmbientSound ===
                    "function"
                ) {

                    startAmbientSound();

                }

            } catch (
                error
            ) {

                console.log(
                    "Audio preparation unavailable."
                );

            }


            const firstLine =
                speakFirstIntroLineImmediately();


            continueIntroduction(
                firstLine
            );

        }
    );


  /*
    ========================================
    RETRY
    ========================================
*/

retryButton.addEventListener(
    "click",
    async function () {

        /*
            Stop any existing speech.
        */

        if (
            "speechSynthesis"
            in window
        ) {

            window
                .speechSynthesis
                .cancel();
        }


        /*
            Stop / reset the Level 4
            pressure system if necessary.
        */

        if (
            typeof resetPressureState ===
            "function"
        ) {

            resetPressureState();
        }


        hidePuzzleOverlay();


        /*
            Reload the current level.
        */

        loadLevel();


        showScreen(
            levelScreen
        );


        const level =
            levels[
                currentLevelIndex
            ];


        /*
            Elias speaks first.
        */

        if (
            level &&
            level.intro
        ) {

            await playLevelIntroduction(
                level
            );
        }


        /*
            LEVEL 4

            Only begin the pressure trap
            AFTER Elias has finished speaking.
        */

        if (
            level &&
            level.pressurePuzzle
        ) {

            await wait(
                500
            );


            await startPressureLevel(
                level
            );
        }

    }
);


/*
    ========================================
    CONTINUE
    ========================================

    Level 1:
    corridor before Level 2.

    Levels 2 and 3:
    continue normally.

    Level 4:
    Elias speaks first,
    then the pressure trap starts.
*/

/*
    ========================================
    CONTINUE — UNIVERSAL CORRIDOR
    ========================================

    After every completed level:
    1. corridor ambience starts
    2. corridor visual plays
    3. next level loads
    4. Elias introduces it
    5. Level 4 pressure starts if needed
*/

continueButton.addEventListener(
    "click",
    async function () {

        continueButton.disabled =
            true;


        /*
            ========================================
            CORRIDOR AFTER EVERY LEVEL
            ========================================
        */

        try {

            if (
                typeof playCorridorAmbience ===
                "function"
            ) {

                playCorridorAmbience();
            }

        } catch (
            error
        ) {

            console.log(
                "Corridor ambience unavailable."
            );
        }


        /*
            Hide the success screen so
            the corridor can take over.
        */

        successScreen.classList.remove(
            "active"
        );


        await playCorridorSequence();


        /*
            ========================================
            MOVE TO NEXT LEVEL
            ========================================
        */

        currentLevelIndex +=
            1;


        /*
            ========================================
            END OF CURRENT PROTOTYPE
            ========================================

            If there is no next level,
            don't load another room.
        */

        if (
            currentLevelIndex >=
            levels.length
        ) {

            alert(
                "You have completed the current prototype."
            );


            currentLevelIndex =
                0;


            showScreen(
                titleScreen
            );


            continueButton.disabled =
                false;


            return;
        }


        /*
            ========================================
            LOAD NEXT ROOM
            ========================================
        */

        loadLevel();


        showScreen(
            levelScreen
        );


        const newLevel =
            levels[
                currentLevelIndex
            ];


        /*
            ========================================
            ELIAS INTRODUCTION
            ========================================
        */

        await playLevelIntroduction(
            newLevel
        );


        /*
            ========================================
            LEVEL 4 — PRESSURE
            ========================================

            Elias finishes speaking first.

            Only then does the chamber seal
            and the ceiling begin descending.
        */

        if (
            newLevel &&
            newLevel.pressurePuzzle
        ) {

            await wait(
                500
            );


            await startPressureLevel(
                newLevel
            );
        }


        continueButton.disabled =
            false;

    }
);
});
