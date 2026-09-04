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
    ========================================
    LEVEL 5 — INTERVENTION STATE
    ========================================
*/

let bladeOverlay =
    null;

let bladeAssembly =
    null;

let bladeTimerDisplay =
    null;

let bladeEvidence =
    null;

let bladeSequenceDisplay =
    null;

let bladeStatus =
    null;

let bladeControlButtons =
    [];

let bladeInvestigationButtons =
    [];

let bladeEntry =
    [];

let bladeSolved =
    false;

let bladeRunning =
    false;

let bladeTimer =
    null;

let bladeDeadline =
    0;

let bladeHalfwaySpoken =
    false;

let bladeWarningSpoken =
    false;

let bladeFailureRunning =
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
    ========================================
    LEVEL 5 — INTERVENTION UI
    ========================================
*/

bladeOverlay =
    document.createElement(
        "div"
    );

bladeOverlay.className =
    "blade-overlay";


bladeOverlay.innerHTML = `

    <div class="blade-room">


        <!-- ================================
             SUSPENDED BLADE
             ================================ -->

        <div
            id="bladeAssembly"
            class="blade-assembly"
        >

            <div class="blade-magnet"></div>

            <div class="blade-weapon"></div>

        </div>


        <!-- ================================
             WARNING LIGHT
             ================================ -->

        <div
            class="blade-warning-light"
        ></div>


        <!-- ================================
             CAPTIVE
             ================================ -->

        <div class="blade-captive">

            <div class="blade-chair"></div>


            <div class="blade-person-head"></div>


            <div class="blade-gag"></div>


            <div class="blade-person-body"></div>


            <div
                class="blade-restraint one"
            ></div>


            <div
                class="blade-restraint two"
            ></div>

        </div>


        <!-- ================================
             CONTROL PANEL
             ================================ -->

        <section class="blade-control-panel">


            <div class="blade-control-title">

                SUSPENSION CONTROL

            </div>


            <div class="blade-control-instruction">

                COMPLETE THE EMERGENCY
                SHUTDOWN PROCEDURE

            </div>


            <!-- TIMER -->

            <div
                id="bladeTimerDisplay"
                class="blade-timer"
            >
                01:10
            </div>


            <!-- INVESTIGATION CONTROLS -->

            <div
                class="blade-investigation-grid"
            >


                <button
                    type="button"
                    class="blade-investigation"
                    data-investigation="magnet"
                >
                    🧲
                    ELECTROMAGNET
                </button>


                <button
                    type="button"
                    class="blade-investigation"
                    data-investigation="brake"
                >
                    ⚙️
                    BRAKE
                </button>


                <button
                    type="button"
                    class="blade-investigation"
                    data-investigation="lock"
                >
                    🔒
                    SAFETY LOCK
                </button>


                <button
                    type="button"
                    class="blade-investigation"
                    data-investigation="power"
                >
                    ⚡
                    POWER
                </button>


                <button
                    type="button"
                    class="blade-investigation"
                    data-investigation="release"
                >
                    🔧
                    RELEASE
                </button>


                <button
                    type="button"
                    class="blade-investigation"
                    data-investigation="serviceDiagram"
                >
                    📋
                    SERVICE DIAGRAM
                </button>


            </div>


            <!-- EVIDENCE DISPLAY -->

            <div
                id="bladeEvidence"
                class="blade-evidence"
            >

                Examine the suspension system.

            </div>


            <!-- SEQUENCE DISPLAY -->

            <div
                id="bladeSequenceDisplay"
                class="blade-sequence-display"
            >

                _ → _ → _ → _

            </div>


            <!-- PUZZLE CONTROLS -->

            <div class="blade-controls">


                <button
                    type="button"
                    class="blade-control-button"
                    data-control="BRAKE"
                >
                    BRAKE
                </button>


                <button
                    type="button"
                    class="blade-control-button"
                    data-control="LOCK"
                >
                    LOCK
                </button>


                <button
                    type="button"
                    class="blade-control-button"
                    data-control="POWER"
                >
                    POWER
                </button>


                <button
                    type="button"
                    class="blade-control-button"
                    data-control="RELEASE"
                >
                    RELEASE
                </button>


            </div>


            <!-- STATUS -->

            <div
                id="bladeStatus"
                class="blade-status"
            ></div>


        </section>

    </div>

`;


document.body.appendChild(
    bladeOverlay
);


/*
    ========================================
    LEVEL 5 — REFERENCES
    ========================================
*/

bladeAssembly =
    document.getElementById(
        "bladeAssembly"
    );


bladeTimerDisplay =
    document.getElementById(
        "bladeTimerDisplay"
    );


bladeEvidence =
    document.getElementById(
        "bladeEvidence"
    );


bladeSequenceDisplay =
    document.getElementById(
        "bladeSequenceDisplay"
    );


bladeStatus =
    document.getElementById(
        "bladeStatus"
    );


bladeControlButtons =
    Array.from(
        bladeOverlay.querySelectorAll(
            ".blade-control-button"
        )
    );


bladeInvestigationButtons =
    Array.from(
        bladeOverlay.querySelectorAll(
            ".blade-investigation"
        )
    );


/*
    ========================================
    END LEVEL 5 UI
    ========================================
*/
    /*
    ========================================
    LEVEL 5 — CINEMATIC OPENING UI
    ========================================
*/

const level5Cinematic =
    document.createElement(
        "div"
    );


level5Cinematic.id =
    "level5Cinematic";


level5Cinematic.className =
    "level5-cinematic";


level5Cinematic.innerHTML = `

    <img
        class="level5-cinematic-image"
        src="level5-captive.png"
        alt=""
    >

    <div
        class="level5-cinematic-redlight"
    ></div>

    <div
        class="level5-cinematic-vignette"
    ></div>

    <div
        id="level5CinematicCaption"
        class="level5-cinematic-caption"
    ></div>

    <div
        class="level5-cinematic-blackout"
    ></div>

`;


document.body.appendChild(
    level5Cinematic
);


const level5CinematicCaption =
    document.getElementById(
        "level5CinematicCaption"
    );


/*
    ========================================
    PLAY LEVEL 5 CINEMATIC
    ========================================
*/
/*
    ========================================
    ELIAS REVEAL CINEMATIC
    AFTER LEVEL 5
    ========================================
*/

const eliasCinematic =
    document.createElement(
        "div"
    );


eliasCinematic.id =
    "eliasCinematic";


eliasCinematic.className =
    "elias-cinematic";


eliasCinematic.innerHTML = `

    <div class="elias-cinematic-camera">

        <img
            class="elias-cinematic-image"
            src="elias-surveillance-room.png"
            alt=""
        >

        <div
            class="elias-monitor-flicker"
        ></div>

        <div
            class="elias-cinematic-vignette"
        ></div>

    </div>

    <div
        class="elias-cinematic-blackout"
    ></div>

`;


document.body.appendChild(
    eliasCinematic
);


/*
    ========================================
    PLAY ELIAS REVEAL CINEMATIC
    ========================================
*/

async function playEliasRevealCinematic() {

    eliasCinematic.classList.remove(
        "active",
        "camera-move",
        "blackout"
    );


    /*
        Create subtitle box if it
        does not already exist.
    */

    let subtitle =
        document.getElementById(
            "eliasCinematicSubtitle"
        );


    if (
        !subtitle
    ) {

        subtitle =
            document.createElement(
                "div"
            );


        subtitle.id =
            "eliasCinematicSubtitle";


        subtitle.className =
            "elias-cinematic-subtitle";


        eliasCinematic.appendChild(
            subtitle
        );
    }


    subtitle.textContent =
        "";


    subtitle.classList.remove(
        "visible"
    );


    void eliasCinematic.offsetWidth;


    /*
        Fade into surveillance room.
    */

    eliasCinematic.classList.add(
        "active"
    );


    await wait(
        900
    );


    eliasCinematic.classList.add(
        "camera-move"
    );


    /*
        ========================================
        ELIAS DIALOGUE
        ========================================
    */

    const lines = [

        "You must be wondering why I brought you here.",

        "I've been watching you for quite some time.",

        "Leaving home. Going to work. Following the same routines.",

        "You never noticed me.",

        "After Anna died... I thought about taking my own life.",

        "I asked God why He had left me here when He had taken her.",

        "And eventually... I understood.",

        "He had given me purpose.",

        "A reason to live.",

        "To test people.",

        "People who make choices without thought for who suffers because of them.",

        "People like you...",

        "Twenty-eight.",

        "God gave you free will. I merely provide the consequences."

    ];


    for (
        const line
        of lines
    ) {

        subtitle.classList.remove(
            "visible"
        );


        await wait(
            250
        );


        subtitle.textContent =
            line;


        subtitle.classList.add(
            "visible"
        );


        await speakAsCurator(
            line
        );


        /*
            Slightly longer pauses after
            the most important revelations.
        */

        if (
            line.includes(
                "Anna died"
            ) ||
            line ===
                "He had given me purpose." ||
            line ===
                "Twenty-eight."
        ) {

            await wait(
                800
            );

        } else {

            await wait(
                300
            );
        }
    }


    subtitle.classList.remove(
        "visible"
    );


    await wait(
        500
    );


    /*
        Cut to black.
    */

    eliasCinematic.classList.add(
        "blackout"
    );


    await wait(
        1400
    );


    eliasCinematic.classList.remove(
        "active",
        "camera-move",
        "blackout"
    );
}

/*
    ========================================
    END ELIAS REVEAL CINEMATIC
    ========================================
*/
   /*
    ========================================
    LEVEL 6 — JUDGEMENT CHAMBER UI
    ========================================
*/

const judgementChamber =
    document.createElement(
        "section"
    );


judgementChamber.id =
    "judgementChamber";


judgementChamber.className =
    "judgement-chamber";


judgementChamber.innerHTML = `

    <div class="judgement-playable-scene">

        <img
            class="judgement-playable-image"
            src="level6-judgement-cinematic.png"
            alt=""
        >


        <div
            class="judgement-playable-vignette"
        ></div>


        <div class="judgement-level-title">

            LEVEL 6 — JUDGEMENT

        </div>


        <section
            class="judgement-playable-panel"
        >

            <div
                class="judgement-terminal-title"
            >
                FINAL VERDICT
            </div>


            <div
                id="judgementTimer"
                class="judgement-timer"
            >
                01:30
            </div>


            <div
                id="judgementStatus"
                class="judgement-status"
            >
                EVIDENCE SYSTEM INITIALISING
            </div>


         <div
    class="judgement-evidence-placeholder"
>

    <div class="judgement-evidence-title">
        EVIDENCE ARCHIVE
    </div>


    <div class="judgement-evidence-grid">

        <button
            type="button"
            class="judgement-evidence-button"
            data-evidence="incident"
        >
            INCIDENT REPORT
        </button>


        <button
            type="button"
            class="judgement-evidence-button"
            data-evidence="phone"
        >
            PHONE RECORD
        </button>


        <button
            type="button"
            class="judgement-evidence-button"
            data-evidence="camera"
        >
            CAMERA LOG
        </button>


        <button
            type="button"
            class="judgement-evidence-button"
            data-evidence="witness"
        >
            WITNESS STATEMENT
        </button>


        <button
            type="button"
            class="judgement-evidence-button system-log"
            data-evidence="system"
        >
            SYSTEM LOG
        </button>

    </div>


    <div
        id="judgementEvidenceDisplay"
        class="judgement-evidence-display"
    >
        Select a record to examine.
    </div>

</div>


            <div class="judgement-controls">

                <button
                    type="button"
                    id="mercyButton"
                    class="judgement-button mercy"
                    disabled
                >
                    MERCY
                </button>


                <button
                    type="button"
                    id="judgementButton"
                    class="judgement-button judgement"
                    disabled
                >
                    JUDGEMENT
                </button>


                <button
                    type="button"
                    id="noVerdictButton"
                    class="judgement-button no-verdict"
                    disabled
                >
                    NO VERDICT
                </button>

            </div>

        </section>

    </div>

`;

/*
    Put Judgement above the normal
    investigation panel so the evidence
    buttons remain available underneath.
*/

investigationPanel.parentNode.insertBefore(
    judgementChamber,
    investigationPanel
);


/*
    ========================================
    LEVEL 6 REFERENCES
    ========================================
*/

const judgementTimerDisplay =
    document.getElementById(
        "judgementTimer"
    );


const judgementStatus =
    document.getElementById(
        "judgementStatus"
    );


const mercyButton =
    document.getElementById(
        "mercyButton"
    );


const judgementButton =
    document.getElementById(
        "judgementButton"
    );


const noVerdictButton =
    document.getElementById(
        "noVerdictButton"
    );
const judgementEvidenceDisplay =
    document.getElementById(
        "judgementEvidenceDisplay"
    );


const judgementEvidenceButtons =
    Array.from(
        judgementChamber.querySelectorAll(
            ".judgement-evidence-button"
        )
    );
/*
    ========================================
    LEVEL 6 — EVIDENCE ARCHIVE
    ========================================
*/

const judgementEvidence = {

    incident: {
        title:
            "INCIDENT REPORT",

        text:
            "Fatal collision recorded at 22:14. " +
            "Daniel Mercer was identified as the driver. " +
            "One pedestrian died at the scene."
    },


    phone: {
        title:
            "PHONE RECORD",

        text:
            "Outgoing call attributed to Daniel Mercer " +
            "began at 22:11 and lasted 4 minutes 37 seconds. " +
            "Device location placed the phone approximately " +
            "three streets from the collision site."
    },


    camera: {
        title:
            "CAMERA LOG",

        text:
            "Vehicle matching Daniel Mercer's car entered " +
            "the junction at 22:13. " +
            "Maintenance note: CAMERA 04 INTERNAL CLOCK " +
            "RUNNING FOUR MINUTES FAST."
    },


    witness: {
        title:
            "WITNESS STATEMENT",

        text:
            "Witness states that Daniel Mercer was driving. " +
            "The same statement describes the driver as " +
            "wearing a bright red jacket. " +
            "Daniel's custody photograph from that night " +
            "shows a grey coat."
    },


    system: {
        title:
            "SYSTEM LOG",

        text:
            "EVIDENCE PACKAGE 31. " +
            "SOURCE RECORDS RECOMPILED. " +
            "TIMESTAMPS NORMALISED. " +
            "MANUAL EDIT AUTHORIZATION: E. VALE."
    }

};


/*
    Track which records the player
    has actually examined.
*/

let judgementEvidenceSeen =
    new Set();
/*
    ========================================
    LEVEL 6 — JUDGEMENT STATE
    ========================================
*/

let judgementTimer =
    null;

let judgementDeadline =
    0;

let judgementRunning =
    false;

let judgementResolutionRunning =
    false;

judgementEvidenceButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const evidenceId =
                    button.dataset.evidence;


                const evidence =
                    judgementEvidence[
                        evidenceId
                    ];


                if (!evidence) {
                    return;
                }


                judgementEvidenceSeen.add(
                    evidenceId
                );


                button.classList.add(
                    "reviewed"
                );


                judgementEvidenceDisplay.innerHTML =
                    "<strong>" +
                    evidence.title +
                    "</strong><br><br>" +
                    evidence.text;


                /*
                    Once the player has read all
                    five records, something changes.
                */

              if (
    judgementEvidenceSeen.size >= 5
) {

    judgementStatus.textContent =
        "INTEGRITY CHECK AVAILABLE";


    mercyButton.disabled =
        false;


    judgementButton.disabled =
        false;


    if (
        !document.getElementById(
            "judgementDeductionPanel"
        )
    ) {

        const deductionPanel =
            document.createElement(
                "div"
            );


        deductionPanel.id =
            "judgementDeductionPanel";


        deductionPanel.className =
            "judgement-deduction-panel";


        deductionPanel.innerHTML = `

            <div class="judgement-evidence-title">
                EVIDENCE INTEGRITY CHECK
            </div>


            <p class="judgement-deduction-instruction">

                Correct the camera timestamp.

                If Camera 04 reads 22:13
                but is four minutes fast,
                what was the real time?

            </p>


            <div class="judgement-code-row">

                <input
                    id="judgementCodeInput"
                    class="judgement-code-input"
                    type="text"
                    inputmode="numeric"
                    maxlength="4"
                    placeholder="HHMM"
                    autocomplete="off"
                >


                <button
                    id="judgementCodeSubmit"
                    class="judgement-code-submit"
                    type="button"
                >
                    VERIFY
                </button>

            </div>


            <div
                id="judgementCodeStatus"
                class="judgement-code-status"
            ></div>

        `;


        judgementEvidenceDisplay
            .parentNode
            .appendChild(
                deductionPanel
            );


        const judgementCodeInput =
            document.getElementById(
                "judgementCodeInput"
            );


        const judgementCodeSubmit =
            document.getElementById(
                "judgementCodeSubmit"
            );


        const judgementCodeStatus =
            document.getElementById(
                "judgementCodeStatus"
            );


        judgementCodeSubmit.addEventListener(
            "click",
            function () {

                const answer =
                    judgementCodeInput
                        .value
                        .trim();


                if (
                    answer === "2209"
                ) {

                    judgementCodeStatus.textContent =
                        "TIMESTAMP DISCREPANCY CONFIRMED";


                    judgementStatus.textContent =
                        "BINARY VERDICT PROTOCOL COMPROMISED";


                    noVerdictButton.classList.add(
                        "revealed"
                    );


                    noVerdictButton.disabled =
                        false;


                    judgementCodeInput.disabled =
                        true;


                    judgementCodeSubmit.disabled =
                        true;

                } else {

                    judgementCodeStatus.textContent =
                        "INTEGRITY CHECK FAILED";

                }

            }
        );

    }
}

            }
        );

    }
);
/*
    ========================================
    LEVEL 6 — JUDGEMENT ENGINE
    ========================================
*/

function stopJudgementTimer() {

    if (
        judgementTimer
    ) {

        clearInterval(
            judgementTimer
        );

        judgementTimer =
            null;
    }


    judgementRunning =
        false;
}


function resetJudgementState() {

    stopJudgementTimer();


    judgementResolutionRunning =
        false;


    judgementEvidenceSeen.clear();


    judgementEvidenceButtons.forEach(
        function (button) {

            button.classList.remove(
                "reviewed"
            );
        }
    );


    judgementEvidenceDisplay.textContent =
        "Select a record to examine.";


    const oldDeductionPanel =
        document.getElementById(
            "judgementDeductionPanel"
        );


    if (
        oldDeductionPanel
    ) {

        oldDeductionPanel.remove();
    }


    mercyButton.disabled =
        true;


    judgementButton.disabled =
        true;


    noVerdictButton.disabled =
        true;


    noVerdictButton.classList.remove(
        "revealed"
    );


    judgementTimerDisplay.textContent =
        "01:30";


    judgementStatus.textContent =
        "AWAITING VERDICT";
}


function updateJudgementTimer() {

    if (
        !judgementRunning
    ) {

        return;
    }


    const remaining =
        Math.max(
            0,
            judgementDeadline -
            Date.now()
        );


    const totalSeconds =
        Math.ceil(
            remaining / 1000
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    judgementTimerDisplay.textContent =
        String(minutes)
            .padStart(
                2,
                "0"
            ) +
        ":" +
        String(seconds)
            .padStart(
                2,
                "0"
            );


    if (
        remaining <= 0
    ) {

        stopJudgementTimer();


        failJudgementLevel(
            "You were given a choice. Indecision is still a choice."
        );
    }
}


function startJudgementLevel() {

    stopJudgementTimer();


    judgementResolutionRunning =
        false;


    judgementRunning =
        true;


    judgementDeadline =
        Date.now() +
        90000;


    judgementTimerDisplay.textContent =
        "01:30";


    judgementStatus.textContent =
        "REVIEW THE EVIDENCE";


    updateJudgementTimer();


    judgementTimer =
        setInterval(
            updateJudgementTimer,
            250
        );
}


/*
    ========================================
    WRONG VERDICT
    ========================================
*/

async function failJudgementLevel(
    eliasLine
) {

    if (
        judgementResolutionRunning
    ) {

        return;
    }


    judgementResolutionRunning =
        true;


    stopJudgementTimer();


    mercyButton.disabled =
        true;

    judgementButton.disabled =
        true;

    noVerdictButton.disabled =
        true;


    judgementStatus.textContent =
        "VERDICT ACCEPTED";


    await speakAsCurator(
        eliasLine
    );


    judgementStatus.textContent =
        "OBSERVATION ROOM SEALED";


    await wait(
        900
    );


  judgementStatus.textContent =
    "ATMOSPHERIC PURGE INITIATED";


await wait(
    800
);


await playJudgementGasDeath();


judgementChamber.classList.remove(
    "active"
);


    deathMessage.textContent =
        "The observation room seals. " +
        "The ventilation system changes direction. " +
        "The air becomes impossible to breathe.";


    curatorMessage.textContent =
        "You judged without understanding.";


    showScreen(
        deathScreen
    );
}


/*
    ========================================
    CORRECT VERDICT
    ========================================
*/

async function completeJudgementLevel() {

    if (
        judgementResolutionRunning
    ) {

        return;
    }


    judgementResolutionRunning =
        true;


    stopJudgementTimer();


    mercyButton.disabled =
        true;

    judgementButton.disabled =
        true;

    noVerdictButton.disabled =
        true;


    judgementStatus.textContent =
        "NO VERDICT REGISTERED";


    const line =
        "That was not one of the choices I gave you.";


    await speakAsCurator(
        line
    );


    await wait(
        500
    );


    judgementChamber.classList.remove(
        "active"
    );


    successLabel.textContent =
        "LEVEL 6 COMPLETE";


    successTitle.textContent =
        "You refused the judgement.";


  successMessage.textContent =
    "The restraints loosen. " +
    "Daniel stands and exits the chamber.";

    curatorMessage.textContent =
        line;


    showScreen(
        successScreen
    );


    continueButton.disabled =
        false;
}


/*
    ========================================
    VERDICT BUTTONS
    ========================================
*/

mercyButton.addEventListener(
    "click",
    function () {

        failJudgementLevel(
            "Mercy without understanding is merely another judgement."
        );
    }
);


judgementButton.addEventListener(
    "click",
    function () {

        failJudgementLevel(
            "You judged without understanding."
        );
    }
);


noVerdictButton.addEventListener(
    "click",
    function () {

        completeJudgementLevel();
    }
);
 /*
    ========================================
    LEVEL 6 — GAS DEATH CINEMATIC
    ========================================
*/

const judgementGasCinematic =
    document.createElement(
        "div"
    );


judgementGasCinematic.className =
    "judgement-gas-cinematic";


judgementGasCinematic.innerHTML = `

    <div class="judgement-gas-view">

        <div class="judgement-gas-warning">
            ATMOSPHERIC PURGE INITIATED
        </div>

        <div class="judgement-gas-haze"></div>

        <div class="judgement-gas-vignette"></div>

        <div class="judgement-gas-blackout"></div>

    </div>

`;


document.body.appendChild(
    judgementGasCinematic
);


async function playJudgementGasDeath() {

    judgementGasCinematic.classList.remove(
        "active",
        "gas-building",
        "blackout"
    );


    void judgementGasCinematic.offsetWidth;


    judgementGasCinematic.classList.add(
        "active"
    );


    await wait(
        700
    );


    judgementGasCinematic.classList.add(
        "gas-building"
    );


   await wait(
    3200
);


judgementGasCinematic.classList.add(
    "blackout"
);


await wait(
    1100
);


const gasLine =
    "The gas Daniel is breathing is slowly attacking his body. " +
    "His muscles weaken. His breathing slows. " +
    "And eventually... his body goes limp in the chair " +
    "as he takes his final breath.";


await speakAsCurator(
    gasLine
);


await wait(
    900
);


judgementGasCinematic.classList.remove(
    "active",
    "gas-building",
    "blackout"
);

}    

/*
    ========================================
    SHOW / HIDE LEVEL 6 CHAMBER
    ========================================
*/

function updateJudgementChamber(
    level
) {

  if (
    !level ||
    !level.judgementPuzzle
) {

    judgementChamber.classList.remove(
        "active"
    );

    return;
}


judgementChamber.classList.add(
    "active"
);

resetJudgementState();


    judgementTimerDisplay.textContent =
        "01:30";


    judgementStatus.textContent =
        "AWAITING VERDICT";


    mercyButton.disabled =
        true;


    judgementButton.disabled =
        true;


    noVerdictButton.disabled =
        true;


    noVerdictButton.classList.remove(
        "revealed"
    );
}
     
/*
    ========================================
    SHOW / HIDE LEVEL 7 ROOM
    ========================================
*/

function updateContradictionRoom(
    level
) {

    if (
        !level ||
        !level.contradictionPuzzle
    ) {

        contradictionRoom.classList.remove(
            "active"
        );
const contradictionDoors =
    contradictionRoom.querySelectorAll(
        ".contradiction-door"
    );

contradictionDoors.forEach(
    function (door) {

        door.classList.remove(
            "danger"
        );
    }
);
        return;
    }


    contradictionRoom.classList.remove(
        "active"
    );
    const testBlade =
    contradictionRoom.querySelector(
        ".contradiction-blade-wall.left .blade-slot:first-child .contradiction-blade"
    );

if (
    testBlade
) {

    setTimeout(
        function () {

            testBlade.classList.add(
                "fire"
            );

        },
        1200
    );
}
}

/*
    ========================================
    END LEVEL 6 JUDGEMENT UI
    ========================================
*/ 
/*
    ========================================
    LEVEL 7 — CONTRADICTION CINEMATIC
    ========================================
*/

const level7Cinematic =
    document.createElement(
        "div"
    );


level7Cinematic.id =
    "level7Cinematic";


level7Cinematic.className =
    "level7-cinematic";


level7Cinematic.innerHTML = `

    <div class="level7-cinematic-scene">

        <div class="level7-cinematic-title">
            LEVEL 7 — CONTRADICTION
        </div>
       <div class="level7-statement-panel">

    <div class="level7-statement">
         The contradiction is not above the TRUTH door.
    </div>

    <div class="level7-statement">
        The contradiction is above the UNKNOWN door.
    </div>

    <div class="level7-statement">
        The contradiction is above the LIE door.
    </div>

</div>
<div class="level7-door-chamber">

    <div
        class="level7-door"
        data-level7-answer="truth"
    >
        TRUTH
    </div>

    <div
        class="level7-door"
        data-level7-answer="lie"
    >
        LIE
    </div>

    <div
        class="level7-door"
        data-level7-answer="unknown"
    >
        UNKNOWN
    </div>

</div>
<div class="level7-wall-slots level7-wall-slots-left">

 <div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>
<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>
<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>
<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>

</div>

<div class="level7-wall-slots level7-wall-slots-right">

<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>
<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>
<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>
<div class="level7-wall-slot">
    <div class="level7-blade"></div>
    <div class="level7-slot-cover"></div>
</div>

</div>
       <div class="level7-cinematic-blackout"></div>

<div class="blade-blood-splatter"></div>

</div>
`;


document.body.appendChild(
    level7Cinematic
);    
async function showLevel7Cinematic() {

    level7Cinematic.classList.add(
        "active"
    );


    await wait(
        1000
    );


    const openingLine =
        "Three doors, Twenty-eight. But appearances can be deceptive.";


    await speakAsCurator(
        openingLine
    );
    await wait(
    500
);


level7Cinematic.classList.add(
    "doors-visible"
);
 await wait(
    1200
);


const secondLine =
    "One tells the truth. One lies. And one... cannot be trusted at all.";


await speakAsCurator(
    secondLine
);   
await wait(
    800
);

const slotOpenSound =
    new Audio(
        "level7-slots-open.wav"
    );

slotOpenSound.volume = 0.7;

slotOpenSound.play().catch(
    () => {}
);

level7Cinematic.classList.add(
    "slots-visible"
);
await wait(
    1000
);

const warningLine =
    "Choose carefully, Twenty-eight. The room has little patience for mistakes.";

await speakAsCurator(
    warningLine
);  
await wait(
    1200
);

const instructionLine =
     "Each statement corresponds to the door beneath it. Two statements can coexist. One cannot. Find the contradiction... and choose its door.";

await speakAsCurator(
    instructionLine
);    
await wait(
    800
);

level7Cinematic.classList.add(
    "statements-visible"
); 
level7Cinematic.classList.add(
    "puzzle-ready"
);    
}
let level7Round = 1;
    
const level7Doors =
    level7Cinematic.querySelectorAll(
        ".level7-door"
    );

level7Doors.forEach(
    (door) => {

        door.addEventListener(
            "click",
         async () => {

                const answer =
                    door.dataset.level7Answer;
level7Cinematic.classList.remove(
    "puzzle-ready"
);
if (
    (
        level7Round === 1 &&
        answer === "unknown"
    ) ||
    (
        level7Round === 2 &&
        answer === "lie"
    )
) {

    console.log(
        "Level 7 correct"
    );

    door.classList.add(
        "correct"
    );

    await wait(
        500
    );

    door.classList.add(
        "opening"
    );

    await wait(
        1000
    );

    /*
        PUZZLE 1 CORRECT
    */

    if (
        level7Round === 1
    ) {

        const correctLine =
            "Correct. You recognised the contradiction.";

        await speakAsCurator(
            correctLine
        );

        await wait(
            700
        );

        const easyLine =
            "That was the easy one.";

        await speakAsCurator(
            easyLine
        );

        await wait(
            1000
        );

        const level7Statements =
            level7Cinematic.querySelectorAll(
                ".level7-statement"
            );

        level7Statements[0].textContent =
            "The contradiction is above neither the TRUTH nor the UNKNOWN door.";

        level7Statements[1].textContent =
            "The contradiction is above the UNKNOWN door.";

        level7Statements[2].textContent =
            "The contradiction is above the only door between TRUTH and UNKNOWN.";

        await wait(
            600
        );

        const harderPuzzleLine =
            "Let's make things a little harder, Twenty-eight.";

        await speakAsCurator(
            harderPuzzleLine
        );

        await wait(
            700
        );

        door.classList.remove(
            "opening"
        );

        door.classList.remove(
            "correct"
        );

        level7Round = 2;

        level7Cinematic.classList.add(
            "puzzle-ready"
        );
    }

} else {

    console.log(
        "Level 7 wrong"
    );

    door.classList.add(
        "wrong"
    );

    level7Cinematic.classList.add(
        "blades-visible"
    );

    await wait(
        350
    );

    showLevel7DeathScreen();

    if (
        typeof playLevel5DeathScream ===
        "function"
    ) {
        playLevel5DeathScream();
    }

    await wait(
        120
    );

    level7DeathScreen.classList.add(
        "splatter"
    );

    await wait(
        1200
    );

    level7DeathScreen.classList.add(
        "fade-blood"
    );

    await wait(
        1300
    );

    level7DeathScreen.classList.add(
        "message-visible"
    );
}
 async function playLevel7DeathSequence() {

    if (
        typeof playLevel5DeathScream ===
        "function"
    ) {
        playLevel5DeathScream();
    }

    await wait(
        120
    );

    level7Cinematic.classList.add(
        "splatter"
    );

    await wait(
        1200
    );

    level7Cinematic.classList.add(
        "fade-blood"
    );

    await wait(
        1300
    );
}   
const level7DeathScreen =
    document.createElement(
        "div"
    );

level7DeathScreen.id =
    "level7DeathScreen";

level7DeathScreen.className =
    "level7-death-screen";

level7DeathScreen.innerHTML = `

    <div class="level7-death-black"></div>

    <div class="level7-death-blood"></div>

    <div class="level7-death-message">

        <p>
            The blades fly from the walls of the room, piercing flesh.
            Blood flows from the wounds until Agent 28 breathes their last breath....
        </p>

        <button
            class="level7-try-again"
            type="button"
        >
            TRY AGAIN
        </button>

    </div>

`;

document.body.appendChild(
    level7DeathScreen
);

function showLevel7DeathScreen() {

    level7DeathScreen.classList.add(
        "active"
    );
}

function hideLevel7DeathScreen() {

    level7DeathScreen.classList.remove(
        "active"
    );
}   
 const level7TryAgainButton =
    level7DeathScreen.querySelector(
        ".level7-try-again"
    );

level7TryAgainButton.addEventListener(
    "click",
    async () => {

        hideLevel7Cinematic();

        await wait(
            300
        );

        await showLevel7Cinematic();
    }
);   
function hideLevel7Cinematic() {

    level7Cinematic.classList.remove(
        "active",
        "doors-visible",
        "slots-visible",
        "statements-visible",
        "puzzle-ready",
        "blades-visible",
        "splatter",
        "fade-blood"
    );

    const level7Doors =
        level7Cinematic.querySelectorAll(
            ".level7-door"
        );

    level7Doors.forEach(
        (door) => {

            door.classList.remove(
                "correct",
                "wrong"
            );
        }
    );

    level7DeathScreen.classList.remove(
        "active",
        "splatter",
        "fade-blood",
        "message-visible"
    );
}
/*
    ========================================
    LEVEL 6 — OPENING CINEMATIC
    ========================================
*/

const level6Cinematic =
    document.createElement(
        "div"
    );


level6Cinematic.id =
    "level6Cinematic";


level6Cinematic.className =
    "level6-cinematic";


level6Cinematic.innerHTML = `

    <div class="level6-cinematic-camera">

        <div
            class="level6-cinematic-flicker"
        ></div>

        <div
            class="level6-cinematic-vignette"
        ></div>

    </div>


    <div
        id="level6CinematicCaption"
        class="level6-cinematic-caption"
    ></div>

`;


document.body.appendChild(
    level6Cinematic
);


const level6CinematicCaption =
    document.getElementById(
        "level6CinematicCaption"
    );


/*
    ========================================
    DANIEL — RECORDED LEVEL 6 AUDIO
    ========================================
*/

let danielLevel6Audio =
    null;


async function playDanielLevel6Audio(
    lines
) {

    return new Promise(
        function (resolve) {

            try {

                /*
                    Stop an old copy if
                    Level 6 is restarted.
                */

                if (
                    danielLevel6Audio
                ) {

                    danielLevel6Audio.pause();

                    danielLevel6Audio.currentTime =
                        0;
                }


                danielLevel6Audio =
                    new Audio(
                        "daniel-level6.mp3"
                    );


                danielLevel6Audio.preload =
                    "auto";


                danielLevel6Audio.volume =
                    1;


                let currentSubtitle =
                    -1;


                /*
                    Change subtitles according
                    to progress through the
                    recorded performance.
                */

                function updateDanielSubtitle() {

                    if (
                        !danielLevel6Audio.duration ||
                        !isFinite(
                            danielLevel6Audio.duration
                        )
                    ) {

                        return;
                    }


                    const progress =
                        danielLevel6Audio.currentTime /
                        danielLevel6Audio.duration;


                    let index =
                        0;


                    if (
                        progress >= 0.76
                    ) {

                        index =
                            3;

                    } else if (
                        progress >= 0.50
                    ) {

                        index =
                            2;

                    } else if (
                        progress >= 0.25
                    ) {

                        index =
                            1;
                    }


                    if (
                        index ===
                        currentSubtitle
                    ) {

                        return;
                    }


                    currentSubtitle =
                        index;


                    level6CinematicCaption.classList.remove(
                        "visible"
                    );


                    level6CinematicCaption.textContent =
                        lines[
                            index
                        ];


                    level6CinematicCaption.classList.add(
                        "visible",
                        "daniel"
                    );
                }


                danielLevel6Audio.addEventListener(
                    "timeupdate",
                    updateDanielSubtitle
                );


                danielLevel6Audio.onended =
                    function () {

                        level6CinematicCaption.classList.remove(
                            "visible",
                            "daniel"
                        );


                        resolve();
                    };


                danielLevel6Audio.onerror =
                    function () {

                        resolve();
                    };


                const attempt =
                    danielLevel6Audio.play();


                if (
                    attempt &&
                    typeof attempt.catch ===
                    "function"
                ) {

                    attempt.catch(
                        function () {

                            resolve();
                        }
                    );
                }


            } catch (
                error
            ) {

                resolve();
            }

        }
    );
}
/*
    ========================================
    PLAY LEVEL 6 CINEMATIC
    ========================================
*/

async function playLevel6Cinematic() {

  level6Cinematic.classList.remove(
    "active",
    "camera-move",
    "warning",
    "blackout",
    "cinematic-fade-out"
);

/*
    ========================================
    END LEVEL 6 OPENING CINEMATIC
    ========================================
*/

    level6CinematicCaption.classList.remove(
        "visible",
        "daniel"
    );


    level6CinematicCaption.textContent =
        "";


    void level6Cinematic.offsetWidth;


    /*
        Fade in.
    */

    level6Cinematic.classList.add(
        "active"
    );


    await wait(
        900
    );


    level6Cinematic.classList.add(
        "camera-move"
    );


    /*
        ========================================
        ELIAS
        ========================================
    */

    const eliasLines = [

        "Welcome to Judgement, Twenty-eight.",

        "The man before you is Daniel Mercer.",

        "Three years ago, he made a choice.",

        "Someone else paid for it.",

        "Tonight... you decide whether he pays too."

    ];


    for (
        const line
        of eliasLines
    ) {

        level6CinematicCaption.classList.remove(
            "visible",
            "daniel"
        );


        await wait(
            250
        );


        level6CinematicCaption.textContent =
            line;


        level6CinematicCaption.classList.add(
            "visible"
        );


        await speakAsCurator(
            line
        );


        await wait(
            300
        );
    }


    /*
        ========================================
        DANIEL INTERRUPTS
        ========================================
    */

 const danielLines = [

    "No... no! Don't listen to him!",

    "Please... whatever he told you... it wasn't like that!",

    "You don't understand... you don't know what happened!",

    "Please... don't... don't do this."

];


level6CinematicCaption.classList.remove(
    "visible"
);


level6CinematicCaption.classList.add(
    "daniel"
);


await playDanielLevel6Audio(
    danielLines
);


level6CinematicCaption.classList.remove(
    "visible",
    "daniel"
);
    /*
        ========================================
        ELIAS FINAL COMMAND
        ========================================
    */

    level6CinematicCaption.classList.remove(
        "visible",
        "daniel"
    );


    await wait(
        500
    );


    const finalLineOne =
        "Ninety seconds.";


    level6CinematicCaption.textContent =
        finalLineOne;


    level6CinematicCaption.classList.add(
        "visible"
    );


    await speakAsCurator(
        finalLineOne
    );


    await wait(
        450
    );


    level6Cinematic.classList.add(
        "warning"
    );


    const finalLineTwo =
        "Choose.";


    level6CinematicCaption.classList.remove(
        "visible"
    );


    await wait(
        250
    );


    level6CinematicCaption.textContent =
        finalLineTwo;


    level6CinematicCaption.classList.add(
        "visible"
    );


    await speakAsCurator(
        finalLineTwo
    );


    await wait(
        650
    );


    level6CinematicCaption.classList.remove(
        "visible"
    );


   /*
    ========================================
    FINAL FADE TO BLACK
    ========================================

    Fade the entire cinematic itself
    rather than placing a black layer
    over the photograph.
*/

level6Cinematic.classList.add(
    "cinematic-fade-out"
);


await wait(
    1000
);


level6Cinematic.classList.remove(
    "active",
    "camera-move",
    "warning",
    "blackout",
    "cinematic-fade-out"
);
}


/*
    ========================================
    END LEVEL 6 OPENING CINEMATIC
    ========================================
*/   

    /*
    ========================================
    POST LEVEL 6 — ANNA CINEMATIC
    ========================================
*/

const annaCinematic =
    document.createElement(
        "div"
    );


annaCinematic.id =
    "annaCinematic";


annaCinematic.className =
    "anna-cinematic";


annaCinematic.innerHTML = `

    <div class="anna-cinematic-scene">

        <div
            id="annaCinematicVisual"
            class="anna-cinematic-visual"
        ></div>

        <div
            id="annaCinematicText"
            class="anna-cinematic-text"
        ></div>

        <div
            id="annaNewspapers"
            class="anna-newspapers"
        ></div>

        <div
            class="anna-cinematic-blackout"
        ></div>

    </div>

`;


document.body.appendChild(
    annaCinematic
);


const annaCinematicText =
    document.getElementById(
        "annaCinematicText"
    );


const annaNewspapers =
    document.getElementById(
        "annaNewspapers"
    );
/*
    ========================================
    PLAY POST LEVEL 6 — ANNA CINEMATIC
    ========================================
*/
/*
    ========================================
    ANNA — RECORDED AUDIO
    ========================================
*/

async function playAnnaLevel6Audio() {

    return new Promise(
        function (resolve) {

            try {

                const annaAudio =
                    new Audio(
                        "anna-level6.mp3"
                    );


                annaAudio.preload =
                    "auto";


                annaAudio.volume =
                    1;


                annaAudio.onended =
                    function () {

                        resolve();
                    };


                annaAudio.onerror =
                    function () {

                        resolve();
                    };


                const attempt =
                    annaAudio.play();


                if (
                    attempt &&
                    typeof attempt.catch ===
                    "function"
                ) {

                    attempt.catch(
                        function () {

                            resolve();
                        }
                    );
                }

            } catch (
                error
            ) {

                resolve();
            }

        }
    );
}
async function playAnnaCinematic() {

    annaCinematic.classList.remove(
        "active",
        "impact",
        "blackout"
    );


    annaCinematicText.classList.remove(
        "visible"
    );


    annaNewspapers.classList.remove(
        "visible"
    );


    annaCinematicText.textContent =
        "";


    annaNewspapers.innerHTML =
        "";


    void annaCinematic.offsetWidth;


    /*
        BLACK SCREEN
    */

    annaCinematic.classList.add(
        "active"
    );


    await wait(
        900
    );


    /*
        ELIAS
    */

    const eliasLine =
        "Every time we make a choice, it has consequences, Twenty-eight.";


    annaCinematicText.textContent =
        eliasLine;


    annaCinematicText.classList.add(
        "visible"
    );


    await speakAsCurator(
        eliasLine
    );


    await wait(
        900
    );


    annaCinematicText.classList.remove(
        "visible"
    );


    await wait(
        700
    );


    /*
        ANNA
    */

    annaCinematic.classList.add(
        "anna-scene"
    );


   /*
    ========================================
    ANNA — RECORDED DIALOGUE
    ========================================
*/

annaCinematicText.textContent =
    "Where is he?";

annaCinematicText.classList.add(
    "visible",
    "anna"
);


const annaAudioPromise =
    playAnnaLevel6Audio();


await wait(
    1000
);


annaCinematicText.classList.remove(
    "visible"
);


await wait(
    300
);


annaCinematicText.textContent =
    "I'm going to have to walk home.";


annaCinematicText.classList.add(
    "visible",
    "anna"
);


await annaAudioPromise;


annaCinematicText.classList.remove(
    "visible",
    "anna"
);

    await wait(
        2200
    );


    annaCinematicText.classList.remove(
        "visible",
        "anna"
    );


  /*
    WALKING / APPROACHING CAR
*/

await wait(
    900
);


try {

    const approachingCar =
        new Audio(
            "anna-car-approach.mp3"
        );

    approachingCar.volume =
        0.85;

    approachingCar.play();

} catch (
    error
) {

    console.log(
        "Car approach audio unavailable."
    );
}


await wait(
    1700
);


/*
    TYRE SCREECH
*/

try {

    const tyreScreech =
        new Audio(
            "anna-tyre-screech.mp3"
        );

    tyreScreech.volume =
        1;

    tyreScreech.play();

} catch (
    error
) {

    console.log(
        "Tyre screech audio unavailable."
    );
}


await wait(
    650
);


/*
    IMPACT
*/

try {

    const crashImpact =
        new Audio(
            "anna-crash-impact.mp3"
        );

    crashImpact.volume =
        1;

    crashImpact.play();

} catch (
    error
) {

    console.log(
        "Crash impact audio unavailable."
    );
}


annaCinematic.classList.add(
    "impact"
);


    await wait(
        250
    );


    annaCinematic.classList.add(
        "blackout"
    );


    await wait(
        1600
    );


    /*
        NEWSPAPER CLIPPINGS
    */

    annaCinematic.classList.remove(
        "blackout"
    );


    annaCinematic.classList.remove(
        "anna-scene"
    );


    annaNewspapers.innerHTML = `

        <div class="anna-newspaper clipping-one">
            LOCAL TEACHER KILLED
            IN LATE-NIGHT COLLISION
        </div>

        <div class="anna-newspaper clipping-two">
            ANNA VALE DIES
            FOLLOWING PEDESTRIAN ACCIDENT
        </div>

        <div class="anna-newspaper clipping-three">
            POLICE APPEAL
            FOR WITNESSES
        </div>

    `;


    annaNewspapers.classList.add(
        "visible"
    );


    await wait(
        4200
    );


    annaNewspapers.classList.remove(
        "visible"
    );


    await wait(
        600
    );


    annaCinematic.classList.add(
        "blackout"
    );


    await wait(
        900
    );


    annaCinematic.classList.remove(
        "active",
        "impact",
        "blackout",
        "anna-scene"
    );
}
    /*
    ========================================
    LEVEL 7 — CONTRADICTION ROOM
    ========================================
*/

const contradictionRoom =
    document.createElement(
        "section"
    );


contradictionRoom.id =
    "contradictionRoom";


contradictionRoom.className =
    "contradiction-room";


contradictionRoom.innerHTML = `

    <div class="contradiction-scene">

    <div class="contradiction-blade-wall left">
  <div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>
<div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>
<div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>
<div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>

<div class="contradiction-blade-wall right">
 <div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>
<div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>
<div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>
<div class="blade-slot">
    <div class="contradiction-blade"></div>
</div>

        <div class="contradiction-title">
            LEVEL 7 — CONTRADICTION
        </div>

        <div class="contradiction-doors">

            <div class="contradiction-door">
                TRUTH
            </div>

            <div class="contradiction-door">
                LIE
            </div>

            <div class="contradiction-door">
                UNKNOWN
            </div>

        </div>

    </div>

`;


document.body.appendChild(
    contradictionRoom
);
    /*
    ========================================
    DEVELOPER MODE
    ========================================
*/

const developerButton =
    document.createElement(
        "button"
    );


developerButton.type =
    "button";


developerButton.textContent =
    "DEV";


developerButton.id =
    "developerButton";


document.body.appendChild(
    developerButton
);



const developerPanel =
    document.createElement(
        "div"
    );


developerPanel.id =
    "developerPanel";


developerPanel.innerHTML = `

    <div class="developer-window">

        <div class="developer-header">

            <strong>
                THE RIGHT PATH — DEVELOPER MODE
            </strong>

            <button
                type="button"
                id="developerClose"
            >
                ✕
            </button>

        </div>


        <p class="developer-note">
            Jump directly to a level for testing.
        </p>


        <div
            id="developerLevels"
            class="developer-levels"
        ></div>


        <div class="developer-tools">

            <button
                type="button"
                id="developerRestart"
            >
                RESTART CURRENT LEVEL
            </button>

        </div>

    </div>

`;


document.body.appendChild(
    developerPanel
);



const developerLevels =
    document.getElementById(
        "developerLevels"
    );


const developerClose =
    document.getElementById(
        "developerClose"
    );


const developerRestart =
    document.getElementById(
        "developerRestart"
    );



/*
    ========================================
    BUILD LEVEL BUTTONS
    ========================================
*/

levels.forEach(
    function (
        level,
        index
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.textContent =
            "LEVEL " +
            level.number;


        button.addEventListener(
            "click",
            async function () {

                developerPanel.classList.remove(
                    "active"
                );


                await developerJumpToLevel(
                    index
                );

            }
        );


        developerLevels.appendChild(
            button
        );

    }
);



/*
    ========================================
    OPEN / CLOSE
    ========================================
*/

developerButton.addEventListener(
    "click",
    function () {

        developerPanel.classList.toggle(
            "active"
        );

    }
);


developerClose.addEventListener(
    "click",
    function () {

        developerPanel.classList.remove(
            "active"
        );

    }
);



/*
    ========================================
    JUMP DIRECTLY TO LEVEL
    ========================================
*/

async function developerJumpToLevel(
    index
) {

    /*
        Stop any speech already playing.
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
        Stop Level 4 if running.
    */

    if (
        typeof resetPressureState ===
        "function"
    ) {

        resetPressureState();
    }


    /*
        Stop Level 5 if running.
    */

    if (
        typeof resetBladeState ===
        "function"
    ) {

        resetBladeState();
    }


    /*
        Hide cinematic overlays.
    */

    level5Cinematic.classList.remove(
        "active",
        "warning",
        "struggle",
        "blackout",
        "fade-out"
    );


    eliasCinematic.classList.remove(
        "active",
        "camera-move",
        "blackout"
    );


    level6Cinematic.classList.remove(
        "active",
        "camera-move",
        "warning",
        "blackout"
    );


    /*
        Change current level.
    */

    currentLevelIndex =
        index;


    /*
        Build the selected room.
    */

    loadLevel();


    showScreen(
        levelScreen
    );


    const level =
        levels[
            currentLevelIndex
        ];
    if (
    level &&
    level.contradictionPuzzle
) {

    showLevel7Cinematic();

    return;
}

    /*
        LEVEL 6
        Play its cinematic exactly as the
        normal game would.
    */

    /*
        Normal Elias introduction.
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


        return;
    }


    /*
        LEVEL 5
    */

    if (
        level &&
        level.bladePuzzle
    ) {

        await wait(500);
        
        await startBladeLevel(level);
}
    
/*
    ========================================
    LEVEL 6 — JUDGEMENT
    ========================================
*/

if (
    level &&
    level.judgementPuzzle
) {

    await playLevel6Cinematic();

    startJudgementLevel();

    return;
}
}

/*
    ========================================
    RESTART CURRENT LEVEL
    ========================================
*/

developerRestart.addEventListener(
    "click",
    async function () {

        developerPanel.classList.remove(
            "active"
        );


        await developerJumpToLevel(
            currentLevelIndex
        );

    }
);


/*
    ========================================
    END DEVELOPER MODE
    ========================================
*/
async function playLevel5Cinematic() {

    /*
        Completely reset cinematic.
    */

    level5Cinematic.classList.remove(
        "active",
        "warning",
        "struggle",
        "blackout",
        "fade-out"
    );


    level5CinematicCaption.classList.remove(
        "visible"
    );


    level5CinematicCaption.textContent =
        "";


    void level5Cinematic.offsetWidth;


    /*
        Fade chamber into view.
    */

    level5Cinematic.classList.add(
        "active"
    );


    await wait(
        1500
    );


    /*
        FIRST STRUGGLE
    */

    level5Cinematic.classList.add(
        "struggle"
    );


    if (
        typeof playLevel5StruggleSound ===
        "function"
    ) {

        playLevel5StruggleSound();
    }


    await wait(
        900
    );


    level5Cinematic.classList.remove(
        "struggle"
    );


    /*
        ELIAS — LINE 1
    */

    const lineOne =
        "Look at her, Subject 28.";


    level5CinematicCaption.textContent =
        lineOne;


    level5CinematicCaption.classList.add(
        "visible"
    );


    await speakAsCurator(
        lineOne
    );


    await wait(
        350
    );


    /*
        MACHINE ACTIVATES.
    */

    level5Cinematic.classList.add(
        "warning"
    );


    if (
        typeof playLevel5PowerupSound ===
        "function"
    ) {

        playLevel5PowerupSound();
    }


    const lineTwo =
        "Until now, your mistakes have only endangered you.";


    level5CinematicCaption.classList.remove(
        "visible"
    );


    await wait(
        300
    );


    level5CinematicCaption.textContent =
        lineTwo;


    level5CinematicCaption.classList.add(
        "visible"
    );


    await speakAsCurator(
        lineTwo
    );


    /*
        SECOND STRUGGLE
    */

    level5Cinematic.classList.add(
        "struggle"
    );


    if (
        typeof playLevel5StruggleSound ===
        "function"
    ) {

        playLevel5StruggleSound();
    }


    await wait(
        700
    );


    level5Cinematic.classList.remove(
        "struggle"
    );


    /*
        ELIAS — LINE 3
    */

    const lineThree =
        "I thought it was time we changed that.";


    level5CinematicCaption.classList.remove(
        "visible"
    );


    await wait(
        300
    );


    level5CinematicCaption.textContent =
        lineThree;


    level5CinematicCaption.classList.add(
        "visible"
    );


    await speakAsCurator(
        lineThree
    );


    await wait(
        450
    );


    /*
        ELIAS — FINAL WARNING
    */

    const lineFour =
        "Her life now depends on what you do next.";


    level5CinematicCaption.classList.remove(
        "visible"
    );


    await wait(
        300
    );


    level5CinematicCaption.textContent =
        lineFour;


    level5CinematicCaption.classList.add(
        "visible"
    );


    await speakAsCurator(
        lineFour
    );


    await wait(
        500
    );


    /*
        BLACKOUT.
    */

    level5CinematicCaption.classList.remove(
        "visible"
    );


    level5Cinematic.classList.add(
        "blackout"
    );


    await wait(
        900
    );


    level5Cinematic.classList.add(
        "fade-out"
    );


    await wait(
        800
    );


    level5Cinematic.classList.remove(
        "active",
        "warning",
        "struggle",
        "blackout",
        "fade-out"
    );
}

/*
    ========================================
    END LEVEL 5 CINEMATIC
    ========================================
*/
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
    ========================================
    LEVEL 5 — INTERVENTION ENGINE
    ========================================
*/


function updateBladeSequenceDisplay() {

    const visible =
        bladeEntry.slice();


    while (
        visible.length < 4
    ) {

        visible.push(
            "_"
        );

    }


    bladeSequenceDisplay.textContent =
        visible.join(
            " → "
        );
}


/*
    ========================================
    TIMER DISPLAY
    ========================================
*/

function updateBladeTimerDisplay(
    milliseconds
) {

    const totalSeconds =
        Math.max(
            0,
            Math.ceil(
                milliseconds / 1000
            )
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    bladeTimerDisplay.textContent =
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(seconds)
            .padStart(2, "0");
}


/*
    ========================================
    RESET LEVEL 5
    ========================================
*/

function resetBladeState() {
if (
    typeof stopLevel5Hum ===
    "function"
) {

    stopLevel5Hum();
}
    bladeEntry =
        [];

    bladeSolved =
        false;

    bladeRunning =
        false;

    bladeDeadline =
        0;

    bladeHalfwaySpoken =
        false;

    bladeWarningSpoken =
        false;

    bladeFailureRunning =
        false;


    if (
        bladeTimer
    ) {

        clearInterval(
            bladeTimer
        );

        bladeTimer =
            null;
    }


    bladeOverlay.classList.remove(
        "active",
        "running",
        "warning-stage",
        "stage-one",
        "stage-two",
        "stage-three",
        "secured"
    );


    bladeEvidence.textContent =
        "Examine the suspension system.";


    bladeStatus.textContent =
        "";


    bladeStatus.classList.remove(
        "correct",
        "wrong"
    );


    bladeInvestigationButtons.forEach(
        function (button) {

            button.classList.remove(
                "investigated"
            );


            button.disabled =
                false;

        }
    );


    bladeControlButtons.forEach(
        function (button) {

            button.disabled =
                false;

        }
    );


    updateBladeTimerDisplay(
        70000
    );


    updateBladeSequenceDisplay();
}


/*
    ========================================
    CURRENT LEVEL 5 DATA
    ========================================
*/

function getCurrentBladeLevel() {

    const level =
        levels[
            currentLevelIndex
        ];


    if (
        !level ||
        !level.bladePuzzle
    ) {

        return null;
    }


    return level;
}


/*
    ========================================
    INVESTIGATE LEVEL 5
    ========================================
*/

async function investigateBladeObject(
    button
) {

    const level =
        getCurrentBladeLevel();


    if (
        !level ||
        bladeSolved ||
        bladeFailureRunning
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


    bladeEvidence.innerHTML = `

        <strong>
            ${investigation.icon || ""}
            ${investigation.name}
        </strong>

        <br><br>

        ${investigation.description}

    `;


    /*
        Elias only comments the first
        time a clue is examined.
    */

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


/*
    ========================================
    LEVEL 5 CONTROL INPUT
    ========================================
*/

async function submitBladeControl(
    control
) {

    const level =
        getCurrentBladeLevel();


    if (
        !level ||
        !bladeRunning ||
        bladeSolved ||
        bladeFailureRunning
    ) {

        return;
    }


    if (
        bladeEntry.length >=
        4
    ) {

        return;
    }


    bladeEntry.push(
        control
    );


    updateBladeSequenceDisplay();


    /*
        Do not reveal whether individual
        controls are right or wrong.

        Judge only after all four
        have been entered.
    */

    if (
        bladeEntry.length < 4
    ) {

        return;
    }


    await wait(
        250
    );


    /*
        ========================================
        CORRECT SEQUENCE
        ========================================
    */

    if (
        arraysMatch(
            bladeEntry,
            level.bladePuzzle.answer
        )
    ) {

        bladeSolved =
            true;

        bladeRunning =
            false;
if (
    typeof stopLevel5Hum ===
    "function"
) {

    stopLevel5Hum();
}

        if (
            bladeTimer
        ) {

            clearInterval(
                bladeTimer
            );

            bladeTimer =
                null;
        }


        bladeStatus.textContent =
            level.bladePuzzle.correct;


        bladeStatus.classList.remove(
            "wrong"
        );


        bladeStatus.classList.add(
            "correct"
        );


        bladeOverlay.classList.remove(
            "running",
            "warning-stage",
            "stage-one",
            "stage-two",
            "stage-three"
        );


        bladeOverlay.classList.add(
            "secured"
        );


        /*
            Lock the controls.
        */

        bladeControlButtons.forEach(
            function (button) {

                button.disabled =
                    true;

            }
        );


        bladeInvestigationButtons.forEach(
            function (button) {

                button.disabled =
                    true;

            }
        );


        await wait(
            1300
        );


        bladeStatus.textContent =
            "BLADE SECURED — EXIT UNLOCKED";


        /*
            Allow the normal Level 5
            exit button to be pressed.
        */

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


        /*
            Hold the secured scene briefly.
        */

        await wait(
            1200
        );


        bladeOverlay.classList.remove(
            "active"
        );


        if (
            level.bladePuzzle
                .curatorSuccess
        ) {

            curatorMessage.textContent =
                level.bladePuzzle
                    .curatorSuccess;


            await speakAsCurator(
                level.bladePuzzle
                    .curatorSuccess
            );

        }


        return;
    }


    /*
        ========================================
        WRONG SEQUENCE
        ========================================

        Wrong sequence costs time,
        but does not instantly kill
        the captive.
    */

    bladeStatus.textContent =
        level.bladePuzzle.wrong;


    bladeStatus.classList.remove(
        "correct"
    );


    bladeStatus.classList.add(
        "wrong"
    );


    /*
        Penalty:
        remove five seconds.
    */

    bladeDeadline -=
        5000;


    await wait(
        700
    );


    bladeEntry =
        [];


    updateBladeSequenceDisplay();


    bladeStatus.textContent =
        "SYSTEM RESET — 5 SECONDS LOST";


    await wait(
        650
    );


    bladeStatus.textContent =
        "";


    bladeStatus.classList.remove(
        "wrong"
    );
}


/*
    ========================================
    LEVEL 5 FAILURE CINEMATIC
    ========================================
*/

async function bladeFailure() {

    const level =
        getCurrentBladeLevel();


    if (
        !level ||
        bladeSolved ||
        bladeFailureRunning
    ) {

        return;
    }


    bladeFailureRunning =
        true;


    bladeRunning =
        false;


    /*
        Stop normal Level 5 hum.
    */

    if (
        typeof stopLevel5Hum ===
        "function"
    ) {

        stopLevel5Hum();
    }


    /*
        Stop countdown.
    */

    if (
        bladeTimer
    ) {

        clearInterval(
            bladeTimer
        );

        bladeTimer =
            null;
    }


    /*
        Disable all controls.
    */

    bladeControlButtons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    bladeInvestigationButtons.forEach(
        function (button) {

            button.disabled =
                true;

        }
    );


    bladeTimerDisplay.textContent =
        "00:00";


    bladeStatus.textContent =
        "RELEASE MECHANISM ACTIVATED";


    /*
        Give the player a fraction of
        a second to see 00:00.
    */

    await wait(
        550
    );


    /*
        Final restraint movement.
    */

    if (
        typeof playLevel5StruggleSound ===
        "function"
    ) {

        playLevel5StruggleSound();
    }


    await wait(
        450
    );


    /*
        ========================================
        REMOVE PUZZLE VIEW
        ========================================
    */

    bladeOverlay.classList.remove(
        "active"
    );


    /*
        ========================================
        CREATE BLACK DEATH SCREEN
        ========================================
    */

    let cinematic =
        document.getElementById(
            "bladeDeathCinematic"
        );


    if (
        !cinematic
    ) {

        cinematic =
            document.createElement(
                "div"
            );


        cinematic.id =
            "bladeDeathCinematic";


        cinematic.className =
            "blade-death-cinematic";


        cinematic.innerHTML = `

            <div
                class="blade-death-black-screen"
            >

                <div
                    class="blade-blood-splatter"
                ></div>

            </div>

        `;


        document.body.appendChild(
            cinematic
        );
    }


    /*
        Reset previous attempt.
    */

    cinematic.classList.remove(
        "splatter",
        "fade-blood"
    );


    void cinematic.offsetWidth;


    cinematic.classList.add(
        "active"
    );


    /*
        ========================================
        SILENCE
        ========================================
    */

    await wait(
        450
    );


    /*
        ========================================
        RELEASE MECHANISM
        ========================================
    */

    if (
        typeof playLevel5PowerupSound ===
        "function"
    ) {

        playLevel5PowerupSound();
    }


    await wait(
        650
    );


    /*
        ========================================
        SCREAM
        ========================================

        This uses the persistent,
        iPad-unlocked audio object.
    */

    if (
        typeof playLevel5DeathScream ===
        "function"
    ) {

        playLevel5DeathScream();
    }


    /*
        Blood hits shortly after
        the scream begins.
    */

    await wait(
        120
    );


    cinematic.classList.add(
        "splatter"
    );


    /*
        Hold the image while scream plays.
    */

    await wait(
        1200
    );


    /*
        Blood slowly disappears
        back into darkness.
    */

    cinematic.classList.add(
        "fade-blood"
    );


    await wait(
        1300
    );


    /*
        ========================================
        PURE BLACK
        ========================================
    */

    cinematic.classList.remove(
        "splatter"
    );


    await wait(
        600
    );


    /*
        Remove cinematic.
    */

    cinematic.classList.remove(
        "active",
        "fade-blood"
    );


    /*
        ========================================
        DEATH SCREEN
        ========================================
    */

    deathMessage.textContent =
        "INTERVENTION FAILED.";


    curatorMessage.textContent =
        level.death;


    showScreen(
        deathScreen
    );


    /*
        Elias deliberately waits until
        everything has gone silent.
    */

    await wait(
        700
    );


     if (
        level.death
    ) {

        await speakAsCurator(
            level.death
        );
    }
}


/*
    ========================================
    LEVEL 5 TIMER ENGINE
    ========================================
*/

function updateBladeTimer(
    level
) {

    if (
        !bladeRunning ||
        bladeSolved ||
        bladeFailureRunning
    ) {

        return;
    }


    const now =
        Date.now();


    const totalTime =
        level.bladePuzzle
            .timeLimit *
        1000;


    const remaining =
        Math.max(
            0,
            bladeDeadline -
            now
        );


    const progress =
        1 -
        (
            remaining /
            totalTime
        );


    updateBladeTimerDisplay(
        remaining
    );


    /*
        ========================================
        BLADE LOWERS IN STAGES
        ========================================
    */

    if (
        progress >=
        0.25
    ) {

        bladeOverlay.classList.add(
            "stage-one"
        );

    }


    if (
        progress >=
        0.50
    ) {

        bladeOverlay.classList.add(
            "stage-two"
        );

    }


    if (
        progress >=
        0.72
    ) {

        bladeOverlay.classList.add(
            "stage-three"
        );

    }


    /*
        Half-way Elias dialogue.
    */

    if (
        progress >= 0.50 &&
        !bladeHalfwaySpoken
    ) {

        bladeHalfwaySpoken =
            true;


        if (
            level.bladePuzzle
                .curatorHalfway
        ) {

            curatorMessage.textContent =
                level.bladePuzzle
                    .curatorHalfway;


            speakAsCurator(
                level.bladePuzzle
                    .curatorHalfway
            );

        }

    }


    /*
        Panic begins in final portion.
    */

    if (
        progress >=
        0.75
    ) {

        bladeOverlay.classList.add(
            "warning-stage"
        );

    }


    /*
        Final Elias warning.
    */

    if (
        progress >= 0.82 &&
        !bladeWarningSpoken
    ) {

        bladeWarningSpoken =
            true;


        if (
            level.bladePuzzle
                .curatorWarning
        ) {

            curatorMessage.textContent =
                level.bladePuzzle
                    .curatorWarning;


            speakAsCurator(
                level.bladePuzzle
                    .curatorWarning
            );

        }

    }


    /*
        Time expired.
    */

    if (
        remaining <= 0
    ) {

        bladeFailure();

    }
}


/*
    ========================================
    START LEVEL 5
    ========================================
*/

async function startBladeLevel(
    level
) {

    if (
        !level ||
        !level.bladePuzzle
    ) {

        return;
    }


    /*
        ========================================
        RESET LEVEL 5
        ========================================
    */

    resetBladeState();


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


    choicesContainer.classList.add(
        "choices-locked"
    );


    bladeOverlay.classList.remove(
        "active",
        "running",
        "warning-stage",
        "stage-one",
        "stage-two",
        "stage-three",
        "secured"
    );


    /*
        ========================================
        OPENING CINEMATIC
        ========================================
    */

    await playLevel5Cinematic();


    /*
        ========================================
        REVEAL PUZZLE
        ========================================
    */

    bladeOverlay.classList.add(
        "active"
    );


    bladeTimerDisplay.textContent =
        "01:10";


    bladeStatus.textContent =
        "SUSPENSION SYSTEM ONLINE";


    await wait(
        900
    );


    bladeStatus.textContent =
        "EMERGENCY SHUTDOWN REQUIRED";


    await wait(
        650
    );


    /*
        Start machinery hum at exactly
        the same moment as the timer.
    */

    if (
        typeof startLevel5Hum ===
        "function"
    ) {

        startLevel5Hum();
    }


    /*
        ========================================
        START TIMER
        ========================================
    */

    bladeRunning =
        true;


    bladeOverlay.classList.add(
        "running"
    );


    bladeDeadline =
        Date.now() +
        (
            level.bladePuzzle
                .timeLimit *
            1000
        );


    updateBladeTimer(
        level
    );


     bladeTimer =
        setInterval(
            function () {

                updateBladeTimer(
                    level
                );

            },
            100
        );
}


/*
    ========================================
    LEVEL 5 INVESTIGATION BUTTONS
    ========================================
*/

bladeInvestigationButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                investigateBladeObject(
                    button
                );

            }
        );

    }
);


/*
    ========================================
    LEVEL 5 CONTROL BUTTONS
    ========================================
*/

bladeControlButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                submitBladeControl(
                    button.dataset.control
                );

            }
        );

    }
);


/*
    ========================================
    END LEVEL 5 ENGINE
    ========================================
*/
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
 /*
            Show special Level 6 room
            only when this level uses
            the Judgement puzzle.
        */

        updateJudgementChamber(
            level
        );
        updateContradictionRoom(
            level
);
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
            ========================================
            RESET LEVEL 4
            ========================================
        */

        if (
            typeof resetPressureState ===
            "function"
        ) {

            resetPressureState();
        }


        /*
            ========================================
            RESET LEVEL 5
            ========================================
        */

        if (
            typeof resetBladeState ===
            "function"
        ) {

            resetBladeState();
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
            ========================================
            LEVEL 4 — PRESSURE
            ========================================
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


            return;
        }


        /*
            ========================================
            LEVEL 5 — INTERVENTION
            ========================================

            Elias finishes speaking before
            the hostage scene is activated.
        */

        if (
            level &&
            level.bladePuzzle
        ) {

            await wait(
                500
            );


            await startBladeLevel(
                level
            );
        }

    
    /*
    ========================================
    LEVEL 6 — JUDGEMENT
    ========================================
*/

if (
    level &&
    level.judgementPuzzle
) {

    resetJudgementState();

    await playLevel6Cinematic();

    startJudgementLevel();

    return;
    
}
     }
);


/*
    ========================================
    CONTINUE — UNIVERSAL CORRIDOR
    ========================================

    After every successful level:

    1. Corridor ambience begins
    2. Walking corridor plays
    3. Next level loads
    4. Elias introduces the room
    5. Special level engine starts
*/


continueButton.addEventListener(
    "click",
    async function () {
    /*
            ========================================
            PREPARE LEVEL 5 AUDIO ON IPAD
            ========================================

            If the NEXT room is Level 5, unlock
            its sounds from this genuine player tap.
        */

        const upcomingLevel =
            levels[
                currentLevelIndex + 1
            ];


        if (
            upcomingLevel &&
            upcomingLevel.bladePuzzle &&
            typeof unlockLevel5Audio ===
                "function"
        ) {

            unlockLevel5Audio();
        }
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
            Hide success screen while
            Subject 28 moves onward.
        */

       successScreen.classList.remove(
    "active"
);


/*
    ========================================
    ELIAS CINEMATIC AFTER LEVEL 5
    ========================================
*/

if (
    levels[
        currentLevelIndex
    ] &&
    levels[
        currentLevelIndex
    ].number === 5
) {

    await playEliasRevealCinematic();
}
/*
    ========================================
    ANNA CINEMATIC AFTER LEVEL 6
    ========================================
*/

if (
    levels[
        currentLevelIndex
    ] &&
    levels[
        currentLevelIndex
    ].number === 6
) {

    await playAnnaCinematic();
}

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
    LEVEL 6 — OPENING CINEMATIC
    ========================================
*/

if (
    newLevel &&
    newLevel.judgementPuzzle
) {

    await playLevel6Cinematic();

    startJudgementLevel();

} else {
    /*
        Normal Elias room introduction.
    */

    await playLevelIntroduction(
        newLevel
    );
}

        /*
            ========================================
            LEVEL 4 — PRESSURE
            ========================================
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


            continueButton.disabled =
                false;


            return;
        }


        /*
            ========================================
            LEVEL 5 — INTERVENTION
            ========================================

            Corridor ends.

            Elias speaks.

            Then the restrained captive
            and suspended blade are revealed.

            Only after that does the
            70-second countdown begin.
        */

        if (
            newLevel &&
            newLevel.bladePuzzle
        ) {

            await wait(
                500
            );


            await startBladeLevel(
                newLevel
            );


            continueButton.disabled =
                false;


            return;
        }


        /*
            Normal levels.
        */

        continueButton.disabled =
            false;

    }
);
});
