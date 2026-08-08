document.addEventListener("DOMContentLoaded", function () {

    /*
        MAIN SCREEN ELEMENTS
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
        GAME STATE
    */

    let currentLevelIndex = 0;

    let investigatedIds =
        new Set();

    let journalEntries = [];

    let puzzleSolved = false;

    let keypadEntry = "";


    /*
        ELIAS VOICE
    */

    let curatorVoice = null;

    let selectedVoiceName =
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
        KEYPAD PUZZLE
    */

    const puzzlePanel =
        document.createElement("section");

    puzzlePanel.className =
        "puzzle-panel hidden-panel";

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
            >1</button>

            <button
                class="keypad-number"
                data-number="2"
            >2</button>

            <button
                class="keypad-number"
                data-number="3"
            >3</button>

            <button
                class="keypad-number"
                data-number="4"
            >4</button>

            <button
                class="keypad-number"
                data-number="5"
            >5</button>

            <button
                class="keypad-number"
                data-number="6"
            >6</button>

            <button
                class="keypad-number"
                data-number="7"
            >7</button>

            <button
                class="keypad-number"
                data-number="8"
            >8</button>

            <button
                class="keypad-number"
                data-number="9"
            >9</button>

            <button id="keypadClear">
                CLEAR
            </button>

            <button
                class="keypad-number"
                data-number="0"
            >0</button>

            <button id="keypadEnter">
                ENTER
            </button>

        </div>

        <p
            id="puzzleStatus"
            class="puzzle-status"
        ></p>
    `;

    choicesContainer.parentNode.insertBefore(
        puzzlePanel,
        choicesContainer
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

        await wait(900);

        showScreen(nextScreen);
    }


    /*
        VOICE SYSTEM
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

            return;
        }


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

                return;
            }
        }


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
                            ) &&
                        (
                            name.includes(
                                "daniel"
                            ) ||
                            name.includes(
                                "arthur"
                            ) ||
                            name.includes(
                                "george"
                            ) ||
                            name.includes(
                                "oliver"
                            )
                        )
                    );
                }
            ) ||

            voices.find(
                function (voice) {

                    return voice.lang
                        .toLowerCase()
                        .startsWith(
                            "en-gb"
                        );
                }
            ) ||

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
        ELIAS SPEECH

        IMPORTANT CHANGE:
        Longer sentences now receive a longer
        safety timeout.

        Safari can no longer cut a long sentence
        off simply because five seconds passed.
    */

    function speakAsCurator(line) {

        return new Promise(
            function (resolve) {

                let finished = false;


                function finish() {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    resolve();
                }


                /*
                    Work out how long the sentence
                    should reasonably be allowed.

                    Minimum: 7 seconds
                    Maximum: 15 seconds
                */

                const calculatedTime =
                    line.length * 140;

                const safetyTime =
                    Math.min(
                        15000,
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

                            } catch (error) {

                                // Ignore.
                            }

                            finish();

                        },
                        safetyTime
                    );


                if (
                    !(
                        "speechSynthesis"
                        in window
                    )
                ) {

                    clearTimeout(
                        safetyTimer
                    );

                    setTimeout(
                        finish,
                        1800
                    );

                    return;
                }


                try {

                    if (!curatorVoice) {

                        chooseCuratorVoice();
                    }


                    window
                        .speechSynthesis
                        .cancel();


                    const speech =
                        new SpeechSynthesisUtterance(
                            line
                        );


                    if (curatorVoice) {

                        speech.voice =
                            curatorVoice;
                    }


                    speech.rate = 0.64;
                    speech.pitch = 0.45;
                    speech.volume = 1;


                    speech.onend =
                        function () {

                            clearTimeout(
                                safetyTimer
                            );

                            setTimeout(
                                finish,
                                400
                            );
                        };


                    speech.onerror =
                        function () {

                            clearTimeout(
                                safetyTimer
                            );

                            setTimeout(
                                finish,
                                700
                            );
                        };


                    window
                        .speechSynthesis
                        .speak(
                            speech
                        );

                } catch (error) {

                    clearTimeout(
                        safetyTimer
                    );

                    setTimeout(
                        finish,
                        700
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

        await wait(400);

        introText.textContent =
            line;

        introText.classList.remove(
            "hidden"
        );

        await speakAsCurator(
            line
        );

        await wait(250);
    }


    async function playIntroduction() {

        startButton.disabled = true;

        await fadeToScreen(
            titleScreen,
            introScreen
        );

        await wait(1200);


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

        await wait(800);

        loadLevel();

        await fadeToScreen(
            introScreen,
            levelScreen
        );

        startButton.disabled = false;
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
                            level.number &&
                        entry.id ===
                            investigation.id
                    );
                }
            );


        if (!exists) {

            journalEntries.push({

                level:
                    level.number,

                id:
                    investigation.id,

                name:
                    investigation.name,

                description:
                    investigation.description
            });
        }
    }


    function renderJournal() {

        if (
            journalEntries.length === 0
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
                ].push(entry);
            }
        );


        journalContent.innerHTML =
            Object.keys(grouped)
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
                                        <article class="journal-entry">

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
                            <section class="journal-level">

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
        INVESTIGATION
    */

    function resetLevelState() {

        investigatedIds =
            new Set();

        puzzleSolved = false;

        keypadEntry = "";

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

        updateKeypadDisplay();
    }


    function updateKeypadDisplay() {

        const characters =
            keypadEntry
                .padEnd(
                    4,
                    "_"
                )
                .split("")
                .join(" ");

        keypadDisplay.textContent =
            characters;
    }


    function updateLevelProgress(
        level
    ) {

        const required =
            level
                .requiredInvestigations
                || 0;

        const found =
            investigatedIds.size;


        const hasInvestigation =
            level.investigations &&
            level.investigations.length;


        if (hasInvestigation) {

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
            Reveal the puzzle once enough
            evidence has been examined.
        */

        if (
            level.puzzle &&
            found >= required &&
            !puzzleSolved
        ) {

            puzzlePanel.classList.remove(
                "hidden-panel"
            );
        }


        /*
            Door choices stay locked until
            the keypad has been solved.
        */

        const choiceButtons =
            choicesContainer
                .querySelectorAll(
                    ".choice"
                );


        const choicesUnlocked =
            level.puzzle
                ? puzzleSolved
                : (
                    !hasInvestigation ||
                    found >= required
                );


        choiceButtons.forEach(
            function (button) {

                button.disabled =
                    !choicesUnlocked;
            }
        );


        choicesContainer
            .classList
            .toggle(
                "choices-locked",
                !choicesUnlocked
            );
    }


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


        updateLevelProgress(
            level
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
                    document
                        .createElement(
                            "button"
                        );


                button.className =
                    "investigation-button";


                button.innerHTML = `
                    <span
                        class="investigation-icon"
                    >
                        ${investigation.icon}
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
        KEYPAD
    */

    function setupPuzzle(
        level
    ) {

        keypadEntry = "";

        puzzleStatus.textContent =
            "";

        updateKeypadDisplay();


        if (!level.puzzle) {

            puzzlePanel.classList.add(
                "hidden-panel"
            );

            return;
        }


        puzzlePanel.classList.add(
            "hidden-panel"
        );


        puzzleTitle.textContent =
            level.puzzle.title;


        puzzleInstruction
            .textContent =
            level.puzzle.instruction;
    }


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

            puzzleSolved = true;


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


            /*
                IMPORTANT FIX:
                Put Elias's words on screen
                BEFORE he begins speaking.
            */

            curatorMessage.textContent =
                level
                    .puzzle
                    .curatorSuccess;


            await wait(300);


            await speakAsCurator(
                level
                    .puzzle
                    .curatorSuccess
            );


            puzzlePanel.classList.add(
                "puzzle-solved"
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


            keypadEntry = "";

            updateKeypadDisplay();
        }
    }


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

            keypadEntry = "";

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
        LEVEL LOADING
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
                    document
                        .createElement(
                            "button"
                        );


                button.className =
                    "choice";


                button.textContent =
                    choice.text;


                button.addEventListener(
                    "click",
                    function () {

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
        DOOR CHOICES
    */

    async function handleChoice(
        choice
    ) {

        const level =
            levels[
                currentLevelIndex
            ];


        const choiceButtons =
            choicesContainer
                .querySelectorAll(
                    ".choice"
                );


        choiceButtons.forEach(
            function (button) {

                button.disabled = true;
            }
        );


        if (choice.correct) {

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

    journalButton
        .addEventListener(
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


    journalOverlay.addEventListener(
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
        MAIN BUTTONS
    */

    startButton.addEventListener(
        "click",
        function () {

            try {

                if (
                    typeof
                    startAmbientSound
                    === "function"
                ) {

                    startAmbientSound();
                }

            } catch (error) {

                console.log(
                    "Ambient sound unavailable."
                );
            }


            playIntroduction();
        }
    );


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


            loadLevel();


            showScreen(
                levelScreen
            );
        }
    );


    continueButton
        .addEventListener(
            "click",
            function () {

                currentLevelIndex += 1;


                if (
                    currentLevelIndex >=
                    levels.length
                ) {

                    alert(
                        "You have completed the current prototype."
                    );


                    currentLevelIndex = 0;


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
