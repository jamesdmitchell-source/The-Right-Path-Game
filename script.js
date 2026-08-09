document.addEventListener("DOMContentLoaded", function () {

    /*
        THE RIGHT PATH
        MAIN GAME SCRIPT
    */

    const screens = document.querySelectorAll(".screen");

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
        GAME STATE
    */

    let currentLevelIndex = 0;

    let investigatedIds =
        new Set();

    let journalEntries = [];

    let puzzleSolved = false;

    let keypadEntry = "";

    let transitionRunning = false;

    let puzzleVisible = false;


    /*
        ELIAS VOICE
    */

    let curatorVoice = null;

    const selectedVoiceName =
        localStorage.getItem(
            "rightPathCuratorVoice"
        ) || "";


    const introLines = [
        "Can you hear me?",
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
        KEYPAD OVERLAY
    */

    const puzzleOverlay =
        document.createElement("div");

    puzzleOverlay.id =
        "puzzleOverlay";


    /*
        Inline positioning means we do not
        need to alter style.css for this fix.
    */

    Object.assign(
        puzzleOverlay.style,
        {
            position: "fixed",
            inset: "0",
            zIndex: "2500",
            display: "none",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "8vh 18px 30px",
            boxSizing: "border-box",
            overflowY: "auto",
            background:
                "rgba(0, 0, 0, 0.86)"
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
            width: "min(430px, 92vw)",
            maxHeight: "82vh",
            overflowY: "auto",
            margin: "0",
            boxSizing: "border-box"
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
            >
                1
            </button>

            <button
                class="keypad-number"
                data-number="2"
                type="button"
            >
                2
            </button>

            <button
                class="keypad-number"
                data-number="3"
                type="button"
            >
                3
            </button>

            <button
                class="keypad-number"
                data-number="4"
                type="button"
            >
                4
            </button>

            <button
                class="keypad-number"
                data-number="5"
                type="button"
            >
                5
            </button>

            <button
                class="keypad-number"
                data-number="6"
                type="button"
            >
                6
            </button>

            <button
                class="keypad-number"
                data-number="7"
                type="button"
            >
                7
            </button>

            <button
                class="keypad-number"
                data-number="8"
                type="button"
            >
                8
            </button>

            <button
                class="keypad-number"
                data-number="9"
                type="button"
            >
                9
            </button>

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
                    SUBJECT 47 — JOURNAL
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
        DOOR CINEMATIC
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
        ELEMENT REFERENCES
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


        await wait(900);


        showScreen(
            nextScreen
        );
    }


    /*
        ELIAS VOICE SYSTEM
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

            curatorVoice = null;

            return false;
        }


        /*
            First use the voice previously
            selected by the player.
        */

        if (selectedVoiceName) {

            const savedVoice =
                voices.find(
                    function (voice) {

                        return (
                            voice.name ===
                            selectedVoiceName
                        );

                    }
                );


            if (savedVoice) {

                curatorVoice =
                    savedVoice;

                return true;
            }
        }


        /*
            Prefer naturally male British
            voices instead of artificially
            forcing pitch down.
        */

        const preferredNames = [
            "daniel",
            "arthur",
            "george",
            "oliver",
            "jamie",
            "ryan",
            "male"
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
                            .startsWith("en-gb")

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


        return !!curatorVoice;
    }


    /*
        iPad Safari often loads its voice list
        slightly later than desktop browsers.

        Wait briefly before giving up.
    */

    async function waitForCuratorVoice() {

        if (
            !("speechSynthesis" in window)
        ) {

            return;
        }


        window.speechSynthesis.resume();


        for (
            let attempt = 0;
            attempt < 12;
            attempt++
        ) {

            if (
                chooseCuratorVoice()
            ) {

                return;
            }


            await wait(150);
        }
    }


    chooseCuratorVoice();


    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis
            .onvoiceschanged =
            function () {

                chooseCuratorVoice();

            };
    }


    function speakAsCurator(line) {

        return new Promise(
            function (resolve) {

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


                if (
                    !(
                        "speechSynthesis"
                        in window
                    )
                ) {

                    setTimeout(
                        finish,
                        1400
                    );

                    return;
                }


                const calculatedTime =
                    line.length * 150;


                const safetyTime =
                    Math.min(
                        16000,
                        Math.max(
                            7000,
                            calculatedTime
                        )
                    );


                const safetyTimer =
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

                    if (!curatorVoice) {

                        chooseCuratorVoice();

                    }


                    window
                        .speechSynthesis
                        .cancel();


                    window
                        .speechSynthesis
                        .resume();


                    const speech =
                        new SpeechSynthesisUtterance(
                            line
                        );


                    if (curatorVoice) {

                        speech.voice =
                            curatorVoice;

                    }


                    /*
                        IMPORTANT IPAD FIX

                        0.45 was creating distorted
                        words on some Apple voices.

                        0.82 keeps Elias slightly
                        deeper without mangling the
                        voice.
                    */

                    speech.rate =
                        0.72;

                    speech.pitch =
                        0.82;

                    speech.volume =
                        1;


                    speech.onend =
                        function () {

                            clearTimeout(
                                safetyTimer
                            );


                            setTimeout(
                                finish,
                                300
                            );

                        };


                    speech.onerror =
                        function () {

                            clearTimeout(
                                safetyTimer
                            );


                            setTimeout(
                                finish,
                                500
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
                        safetyTimer
                    );


                    setTimeout(
                        finish,
                        500
                    );

                }

            }
        );
    }


    /*
        INTRODUCTION
    */

    async function showDialogueLine(
        line
    ) {

        introText.classList.add(
            "hidden"
        );


        await wait(350);


        introText.textContent =
            line;


        introText.classList.remove(
            "hidden"
        );


        await speakAsCurator(
            line
        );


        await wait(220);
    }


    async function playIntroduction() {

        startButton.disabled =
            true;


        /*
            Give iPad Safari time to expose
            its speech voices BEFORE Elias'
            first sentence.
        */

        await waitForCuratorVoice();


        await fadeToScreen(
            titleScreen,
            introScreen
        );


        await wait(900);


        for (
            const line
            of introLines
        ) {

            await showDialogueLine(
                line
            );

        }


        introText.classList.add(
            "hidden"
        );


        await wait(700);


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


        /*
            Always begin at the top of the
            overlay on iPad.
        */

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


        puzzleSolved =
            false;


        keypadEntry =
            "";


        transitionRunning =
            false;


        puzzleVisible =
            false;


        hidePuzzleOverlay();


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


        puzzlePanel.classList.remove(
            "puzzle-solved"
        );


        doorTransition.classList.remove(
            "active",
            "opening"
        );


        updateKeypadDisplay();
    }


    /*
        KEYPAD DISPLAY
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


        if (hasInvestigations) {

            if (
                found >= required
            ) {

                evidenceProgress
                    .textContent =
                    "Enough evidence gathered.";

            } else {

                evidenceProgress
                    .textContent =
                    "Evidence examined: " +
                    found +
                    " / " +
                    required;

            }
        }


        /*
            The keypad only appears after
            ALL required items have been
            investigated.

            Level 1 currently requires 5.
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


        if (level.puzzle) {

            choiceButtons.forEach(
                function (button) {

                    button.disabled =
                        !puzzleSolved;

                }
            );


            choicesContainer
                .classList
                .toggle(
                    "choices-locked",
                    !puzzleSolved
                );


        } else {

            const unlocked =
                !hasInvestigations ||
                found >= required;


            choiceButtons.forEach(
                function (button) {

                    button.disabled =
                        !unlocked;

                }
            );


            choicesContainer
                .classList
                .toggle(
                    "choices-locked",
                    !unlocked
                );

        }
    }


    /*
        INVESTIGATION
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


        /*
            Speak first, THEN decide whether
            the final investigation should
            open the keypad.

            This avoids the panel covering
            Elias' final clue immediately.
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


        updateLevelProgress(
            level
        );
    }


    /*
        INVESTIGATION BUTTONS
    */

    function renderInvestigations(
        level
    ) {

        investigationGrid.innerHTML =
            "";


        if (
            !level.investigations ||
            !level.investigations.length
        ) {

            investigationPanel
                .classList
                .add(
                    "hidden-panel"
                );

            return;
        }


        investigationPanel
            .classList
            .remove(
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


                investigationGrid
                    .appendChild(
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


        if (!level.puzzle) {

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


        if (!level.puzzle) {

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


            /*
                Unlock the doors immediately.
            */

            updateLevelProgress(
                level
            );


            curatorMessage.textContent =
                level.puzzle
                    .curatorSuccess;


            await wait(300);


            await speakAsCurator(
                level.puzzle
                    .curatorSuccess
            );


            await wait(350);


            /*
                Remove the keypad and return
                to the room.
            */

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
                            keypadEntry
                                .length >= 4
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
        DOOR OPENING
    */

    async function playDoorOpening() {

        if (
            transitionRunning
        ) {

            return;
        }


        transitionRunning =
            true;


        doorTransition
            .classList
            .add(
                "active"
            );


        /*
            Real door-creak.wav is played
            by audio.js.
        */

        if (
            typeof playDoorMusic ===
            "function"
        ) {

            playDoorMusic();

        }


        await wait(900);


        doorTransition
            .classList
            .add(
                "opening"
            );


        await wait(4200);


        doorTransition
            .classList
            .remove(
                "active",
                "opening"
            );


        transitionRunning =
            false;
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
            "<span>SUBJECT 47</span>" +
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
            function (choice) {

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


                        handleChoice(
                            choice
                        );

                    }
                );


                choicesContainer
                    .appendChild(
                        button
                    );

            }
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
        choice
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


        const choiceButtons =
            choicesContainer
                .querySelectorAll(
                    ".choice"
                );


        choiceButtons.forEach(
            function (button) {

                button.disabled =
                    true;

            }
        );


        /*
            CORRECT DOOR
        */

        if (choice.correct) {

            if (
                level.number === 1
            ) {

                curatorMessage
                    .textContent =
                    "The lock releases.";


                await wait(450);


                await playDoorOpening();

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


        /*
            WRONG DOOR
        */

        } else {

            deathMessage.textContent =
                level.death;


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
        JOURNAL BUTTONS
    */

    journalButton.addEventListener(
        "click",
        function () {

            renderJournal();


            journalOverlay
                .classList
                .add(
                    "open"
                );

        }
    );


    closeJournalButton
        .addEventListener(
            "click",
            function () {

                journalOverlay
                    .classList
                    .remove(
                        "open"
                    );

            }
        );


    journalOverlay
        .addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    journalOverlay
                ) {

                    journalOverlay
                        .classList
                        .remove(
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

            /*
                audio.js now only prepares
                door-creak.wav.

                It must NOT play the creak
                at this point.
            */

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


            /*
                Wake up iPad speech synthesis
                while we're still inside the
                player's button press.
            */

            if (
                "speechSynthesis"
                in window
            ) {

                window
                    .speechSynthesis
                    .resume();


                chooseCuratorVoice();

            }


            playIntroduction();

        }
    );


    /*
        RETRY
    */

    retryButton.addEventListener(
        "click",
        function () {

            if (
                "speechSynthesis"
                in window
            ) {

                window
                    .speechSynthesis
                    .cancel();

            }


            hidePuzzleOverlay();


            loadLevel();


            showScreen(
                levelScreen
            );

        }
    );


    /*
        CONTINUE
    */

    continueButton.addEventListener(
        "click",
        function () {

            currentLevelIndex +=
                1;


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


                return;
            }


            loadLevel();


            showScreen(
                levelScreen
            );

        }
    );

});
