document.addEventListener("DOMContentLoaded", function () {

    /*
        MAIN ELEMENTS
    */

    const screens = document.querySelectorAll(".screen");

    const titleScreen = document.getElementById("titleScreen");
    const introScreen = document.getElementById("introScreen");
    const levelScreen = document.getElementById("levelScreen");
    const deathScreen = document.getElementById("deathScreen");
    const successScreen = document.getElementById("successScreen");

    const startButton = document.getElementById("startButton");
    const retryButton = document.getElementById("retryButton");
    const continueButton = document.getElementById("continueButton");

    const deathMessage = document.getElementById("deathMessage");
    const successLabel = document.getElementById("successLabel");
    const successTitle = document.getElementById("successTitle");
    const successMessage = document.getElementById("successMessage");

    const introText = document.getElementById("introText");
    const curatorMessage = document.getElementById("curatorMessage");

    const levelHeader = document.querySelector(".level-header");
    const observationText = document.querySelector(".observation");
    const clueText = document.querySelector("blockquote");
    const questionTitle = document.querySelector(".room h2");

    const questionText = document.querySelector(
        ".room > p:not(.observation):not(.curator-message)"
    );

    const choicesContainer = document.querySelector(".choices");


    /*
        GAME STATE
    */

    let currentLevelIndex = 0;
    let investigatedIds = new Set();
    let journalEntries = [];
    let puzzleSolved = false;
    let keypadEntry = "";
    let transitionRunning = false;


    /*
        CURATOR VOICE
    */

    let curatorVoice = null;

    const selectedVoiceName =
        localStorage.getItem("rightPathCuratorVoice") || "";

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

    const investigationPanel = document.createElement("section");

    investigationPanel.className = "investigation-panel";

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
        KEYPAD PANEL
    */

    const puzzlePanel = document.createElement("section");

    puzzlePanel.className = "puzzle-panel hidden-panel";

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

            <button class="keypad-number" data-number="1">1</button>
            <button class="keypad-number" data-number="2">2</button>
            <button class="keypad-number" data-number="3">3</button>

            <button class="keypad-number" data-number="4">4</button>
            <button class="keypad-number" data-number="5">5</button>
            <button class="keypad-number" data-number="6">6</button>

            <button class="keypad-number" data-number="7">7</button>
            <button class="keypad-number" data-number="8">8</button>
            <button class="keypad-number" data-number="9">9</button>

            <button id="keypadClear">
                CLEAR
            </button>

            <button class="keypad-number" data-number="0">
                0
            </button>

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

    const journalOverlay = document.createElement("div");

    journalOverlay.className = "journal-overlay";

    journalOverlay.innerHTML = `
        <div class="journal-card">

            <div class="journal-topbar">
                <span>SUBJECT 47 — JOURNAL</span>

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

    document.body.appendChild(journalOverlay);


    /*
        DOOR CINEMATIC
    */

    const doorTransition = document.createElement("div");

    doorTransition.className = "door-transition";

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

    document.body.appendChild(doorTransition);


    /*
        REFERENCES
    */

    const investigationGrid =
        document.getElementById("investigationGrid");

    const evidenceCard =
        document.getElementById("evidenceCard");

    const evidenceProgress =
        document.getElementById("evidenceProgress");

    const journalButton =
        document.getElementById("journalButton");

    const closeJournalButton =
        document.getElementById("closeJournalButton");

    const journalContent =
        document.getElementById("journalContent");

    const puzzleTitle =
        document.getElementById("puzzleTitle");

    const puzzleInstruction =
        document.getElementById("puzzleInstruction");

    const keypadDisplay =
        document.getElementById("keypadDisplay");

    const keypadClear =
        document.getElementById("keypadClear");

    const keypadEnter =
        document.getElementById("keypadEnter");

    const puzzleStatus =
        document.getElementById("puzzleStatus");


    /*
        BASIC FUNCTIONS
    */

    function wait(milliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, milliseconds);
        });
    }


    function showScreen(screen) {

        screens.forEach(function (item) {

            item.classList.remove(
                "active",
                "fade-out"
            );
        });

        screen.classList.add("active");
    }


    async function fadeToScreen(
        currentScreen,
        nextScreen
    ) {

        currentScreen.classList.add("fade-out");

        await wait(900);

        showScreen(nextScreen);
    }


    /*
        CURATOR VOICE
    */

    function getEnglishVoices() {

        if (!("speechSynthesis" in window)) {
            return [];
        }

        return window.speechSynthesis
            .getVoices()
            .filter(function (voice) {

                return voice.lang
                    .toLowerCase()
                    .startsWith("en");
            });
    }


    function chooseCuratorVoice() {

        const voices = getEnglishVoices();

        if (!voices.length) {
            curatorVoice = null;
            return;
        }


        if (selectedVoiceName) {

            const savedVoice =
                voices.find(function (voice) {

                    return voice.name ===
                        selectedVoiceName;
                });

            if (savedVoice) {

                curatorVoice = savedVoice;

                return;
            }
        }


        const preferredNames = [
            "daniel",
            "arthur",
            "george",
            "oliver"
        ];


        curatorVoice =
            voices.find(function (voice) {

                const name =
                    voice.name.toLowerCase();

                return (
                    voice.lang
                        .toLowerCase()
                        .startsWith("en-gb") &&

                    preferredNames.some(
                        function (preferred) {

                            return name.includes(
                                preferred
                            );
                        }
                    )
                );
            })

            ||

            voices.find(function (voice) {

                return voice.lang
                    .toLowerCase()
                    .startsWith("en-gb");
            })

            ||

            voices[0];
    }


    chooseCuratorVoice();


    if ("speechSynthesis" in window) {

        window.speechSynthesis.onvoiceschanged =
            function () {

                chooseCuratorVoice();
            };
    }


    function speakAsCurator(line) {

        return new Promise(function (resolve) {

            let finished = false;


            function finish() {

                if (finished) {
                    return;
                }

                finished = true;

                resolve();
            }


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
                setTimeout(function () {

                    try {

                        window
                            .speechSynthesis
                            .cancel();

                    } catch (error) {

                        // Ignore.
                    }

                    finish();

                }, safetyTime);


            if (!("speechSynthesis" in window)) {

                clearTimeout(safetyTimer);

                setTimeout(
                    finish,
                    1500
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


                speech.onend = function () {

                    clearTimeout(
                        safetyTimer
                    );

                    setTimeout(
                        finish,
                        400
                    );
                };


                speech.onerror = function () {

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
                    .speak(speech);


            } catch (error) {

                clearTimeout(
                    safetyTimer
                );

                setTimeout(
                    finish,
                    700
                );
            }
        });
    }


    /*
        INTRO
    */

    async function showDialogueLine(line) {

        introText.classList.add("hidden");

        await wait(400);

        introText.textContent = line;

        introText.classList.remove("hidden");

        await speakAsCurator(line);

        await wait(250);
    }


    async function playIntroduction() {

        startButton.disabled = true;

        await fadeToScreen(
            titleScreen,
            introScreen
        );

        await wait(1200);


        for (const line of introLines) {

            await showDialogueLine(line);
        }


        introText.classList.add("hidden");

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
                        entry.level === level.number &&
                        entry.id === investigation.id
                    );
                }
            );


        if (!exists) {

            journalEntries.push({

                level: level.number,

                id: investigation.id,

                name: investigation.name,

                description:
                    investigation.description
            });
        }
    }


    function renderJournal() {

        if (!journalEntries.length) {

            journalContent.innerHTML =
                "<p>No evidence recorded yet.</p>";

            return;
        }


        const grouped = {};


        journalEntries.forEach(
            function (entry) {

                if (!grouped[entry.level]) {

                    grouped[entry.level] = [];
                }

                grouped[entry.level]
                    .push(entry);
            }
        );


        journalContent.innerHTML =
            Object.keys(grouped)

            .map(function (levelNumber) {

                const entries =
                    grouped[levelNumber]

                    .map(function (entry) {

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
                    })

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
            })

            .join("");
    }


    /*
        LEVEL STATE
    */

    function resetLevelState() {

        investigatedIds =
            new Set();

        puzzleSolved = false;

        keypadEntry = "";

        transitionRunning = false;


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
        INVESTIGATION
    */

    function updateKeypadDisplay() {

        keypadDisplay.textContent =
            keypadEntry
                .padEnd(4, "_")
                .split("")
                .join(" ");
    }


    function updateLevelProgress(level) {

        const required =
            level.requiredInvestigations || 0;


        const found =
            investigatedIds.size;


        const hasInvestigations =
            level.investigations &&
            level.investigations.length > 0;


        if (hasInvestigations) {

            if (found >= required) {

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


        if (
            level.puzzle &&
            found >= required &&
            !puzzleSolved
        ) {

            puzzlePanel.classList.remove(
                "hidden-panel"
            );
        }


        const choiceButtons =
            choicesContainer
                .querySelectorAll(
                    ".choice"
                );


        /*
            IMPORTANT FIX:

            After puzzleSolved becomes true,
            ALL choice buttons are explicitly
            enabled.
        */

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


        updateLevelProgress(level);


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


    function renderInvestigations(level) {

        investigationGrid.innerHTML = "";


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
            function (investigation) {

                const button =
                    document
                        .createElement(
                            "button"
                        );


                button.className =
                    "investigation-button";


                button.type = "button";


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
        KEYPAD
    */

    function setupPuzzle(level) {

        keypadEntry = "";

        puzzleStatus.textContent = "";

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


        puzzleInstruction.textContent =
            level.puzzle.instruction;
    }


    async function submitKeypad() {

        const level =
            levels[currentLevelIndex];


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
                THIS NOW EXPLICITLY
                UNLOCKS BOTH DOORS.
            */

            updateLevelProgress(level);


            curatorMessage.textContent =
                level
                    .puzzle
                    .curatorSuccess;


            await wait(250);


            await speakAsCurator(
                level
                    .puzzle
                    .curatorSuccess
            );


            /*
                Retract the control panel
                so the doors are clearly
                available.
            */

            await wait(400);


            puzzlePanel.classList.add(
                "hidden-panel"
            );


            evidenceProgress.textContent =
                "The doors are unlocked. Choose carefully.";


            /*
                One final explicit enable,
                just to ensure Safari cannot
                leave them disabled.
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
                            keypadEntry.length >=
                            4
                        ) {
                            return;
                        }


                        keypadEntry +=
                            button.dataset.number;


                        updateKeypadDisplay();
                    }
                );
            }
        );


    keypadClear.addEventListener(
        "click",
        function () {

            keypadEntry = "";

            puzzleStatus.textContent = "";

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
        CREEPY DOOR SOUND
    */

    function playDoorSound() {

        try {

            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;


            if (!AudioContextClass) {
                return;
            }


            const context =
                new AudioContextClass();


            const master =
                context.createGain();


            master.gain.setValueAtTime(
                0.0001,
                context.currentTime
            );


            master.gain.exponentialRampToValueAtTime(
                0.12,
                context.currentTime + 0.3
            );


            master.gain.exponentialRampToValueAtTime(
                0.0001,
                context.currentTime + 5
            );


            master.connect(
                context.destination
            );


            /*
                Deep industrial tone.
            */

            const bass =
                context.createOscillator();


            bass.type = "sine";


            bass.frequency.setValueAtTime(
                48,
                context.currentTime
            );


            bass.frequency.exponentialRampToValueAtTime(
                32,
                context.currentTime + 4.5
            );


            bass.connect(master);


            bass.start();


            bass.stop(
                context.currentTime + 5
            );


            /*
                Three-note eerie motif.
            */

            const notes = [
                {
                    frequency: 146.83,
                    delay: 0.4
                },

                {
                    frequency: 110,
                    delay: 1.45
                },

                {
                    frequency: 87.31,
                    delay: 2.5
                }
            ];


            notes.forEach(
                function (note) {

                    const oscillator =
                        context.createOscillator();


                    const gain =
                        context.createGain();


                    oscillator.type =
                        "sine";


                    oscillator.frequency.value =
                        note.frequency;


                    gain.gain.setValueAtTime(
                        0.0001,
                        context.currentTime +
                        note.delay
                    );


                    gain.gain.exponentialRampToValueAtTime(
                        0.045,
                        context.currentTime +
                        note.delay +
                        0.1
                    );


                    gain.gain.exponentialRampToValueAtTime(
                        0.0001,
                        context.currentTime +
                        note.delay +
                        1.5
                    );


                    oscillator.connect(
                        gain
                    );


                    gain.connect(
                        context.destination
                    );


                    oscillator.start(
                        context.currentTime +
                        note.delay
                    );


                    oscillator.stop(
                        context.currentTime +
                        note.delay +
                        1.6
                    );
                }
            );


        } catch (error) {

            console.log(
                "Door sound unavailable."
            );
        }
    }


    /*
        DOOR OPENING CINEMATIC
    */

    async function playDoorOpening() {

        if (transitionRunning) {
            return;
        }


        transitionRunning = true;


        doorTransition.classList.add(
            "active"
        );


        playDoorSound();


        await wait(900);


        doorTransition.classList.add(
            "opening"
        );


        await wait(4200);


        doorTransition.classList.remove(
            "active",
            "opening"
        );


        transitionRunning = false;
    }


    /*
        LOAD LEVEL
    */

    function loadLevel() {

        const level =
            levels[currentLevelIndex];


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


        curatorMessage.textContent = "";


        choicesContainer.innerHTML = "";


        level.choices.forEach(
            function (choice) {

                const button =
                    document
                        .createElement(
                            "button"
                        );


                button.className =
                    "choice";


                button.type = "button";


                button.textContent =
                    choice.text;


                button.addEventListener(
                    "click",
                    function () {

                        /*
                            Extra protection:
                            do nothing until puzzle
                            has been solved.
                        */

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


        renderInvestigations(level);

        setupPuzzle(level);

        updateLevelProgress(level);
    }


    /*
        DOOR CHOICE
    */

    async function handleChoice(choice) {

        const level =
            levels[currentLevelIndex];


        if (transitionRunning) {
            return;
        }


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

            /*
                Level 1 gets the special
                door-opening cinematic.
            */

            if (level.number === 1) {

                curatorMessage.textContent =
                    "The lock releases.";


                await wait(500);


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


    closeJournalButton.addEventListener(
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
        MAIN BUTTONS
    */

    startButton.addEventListener(
        "click",
        function () {

            try {

                if (
                    typeof
                    startAmbientSound ===
                    "function"
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


    continueButton.addEventListener(
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
