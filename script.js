document.addEventListener("DOMContentLoaded", function () {
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

    let currentLevelIndex = 0;
    let investigatedIds = new Set();
    let journalEntries = [];

    let curatorVoice = null;
    let selectedVoiceName =
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
        JOURNAL
    */

    const journalOverlay =
        document.createElement("div");

    journalOverlay.id = "journalOverlay";
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

            <div
                id="journalContent"
                class="journal-content"
            ></div>

        </div>
    `;

    document.body.appendChild(journalOverlay);

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


    /*
        CURATOR VOICE SELECTOR
    */

    const voiceButton =
        document.createElement("button");

    voiceButton.type = "button";
    voiceButton.textContent = "Choose Curator Voice";

    voiceButton.style.marginTop = "18px";
    voiceButton.style.minWidth = "220px";

    titleScreen.appendChild(voiceButton);


    const voiceOverlay =
        document.createElement("div");

    voiceOverlay.style.position = "fixed";
    voiceOverlay.style.inset = "0";
    voiceOverlay.style.zIndex = "2000";
    voiceOverlay.style.display = "none";
    voiceOverlay.style.alignItems = "center";
    voiceOverlay.style.justifyContent = "center";
    voiceOverlay.style.padding = "20px";
    voiceOverlay.style.background =
        "rgba(0, 0, 0, 0.96)";


    const voiceCard =
        document.createElement("div");

    voiceCard.style.width = "min(700px, 100%)";
    voiceCard.style.maxHeight = "85vh";
    voiceCard.style.overflowY = "auto";
    voiceCard.style.padding = "25px";
    voiceCard.style.border = "1px solid #444";
    voiceCard.style.background = "#080808";
    voiceCard.style.color = "#eee";
    voiceCard.style.textAlign = "left";


    voiceCard.innerHTML = `
        <h2 style="margin-top:0;">
            Curator Voice Audition
        </h2>

        <p style="
            color:#999;
            line-height:1.6;
        ">
            Listen to the available English voices.
            When you find the voice that suits Elias,
            select it and press Save Voice.
        </p>

        <select
            id="voiceSelect"
            style="
                width:100%;
                padding:12px;
                margin:15px 0;
                background:#111;
                color:#eee;
                border:1px solid #555;
                font-size:16px;
            "
        ></select>

        <div style="
            display:flex;
            gap:10px;
            flex-wrap:wrap;
        ">
            <button
                id="testVoiceButton"
                type="button"
            >
                Test Voice
            </button>

            <button
                id="saveVoiceButton"
                type="button"
            >
                Save Voice
            </button>

            <button
                id="refreshVoicesButton"
                type="button"
            >
                Refresh Voices
            </button>

            <button
                id="closeVoiceButton"
                type="button"
            >
                Close
            </button>
        </div>

        <p
            id="voiceStatus"
            style="
                margin-top:20px;
                color:#aaa;
            "
        ></p>
    `;

    voiceOverlay.appendChild(voiceCard);
    document.body.appendChild(voiceOverlay);

    const voiceSelect =
        document.getElementById("voiceSelect");

    const testVoiceButton =
        document.getElementById("testVoiceButton");

    const saveVoiceButton =
        document.getElementById("saveVoiceButton");

    const refreshVoicesButton =
        document.getElementById("refreshVoicesButton");

    const closeVoiceButton =
        document.getElementById("closeVoiceButton");

    const voiceStatus =
        document.getElementById("voiceStatus");


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
        VOICE SYSTEM
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

        /*
            If the player has selected a voice,
            always try to use exactly that one.
        */

        if (selectedVoiceName) {
            const savedVoice =
                voices.find(function (voice) {
                    return (
                        voice.name === selectedVoiceName
                    );
                });

            if (savedVoice) {
                curatorVoice = savedVoice;
                return;
            }
        }

        /*
            Otherwise try some commonly male
            British voice names.
        */

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
                            return name.includes(preferred);
                        }
                    )
                );
            }) ||

            voices.find(function (voice) {
                return voice.lang
                    .toLowerCase()
                    .startsWith("en-gb");
            }) ||

            voices[0];
    }


    function populateVoiceSelector() {
        const voices = getEnglishVoices();

        voiceSelect.innerHTML = "";

        if (!voices.length) {
            const option =
                document.createElement("option");

            option.textContent =
                "No voices loaded yet";

            option.value = "";

            voiceSelect.appendChild(option);

            voiceStatus.textContent =
                "Press Refresh Voices in a few seconds.";

            return;
        }

        voices.forEach(function (voice) {
            const option =
                document.createElement("option");

            option.value = voice.name;

            option.textContent =
                voice.name +
                " — " +
                voice.lang;

            if (
                voice.name === selectedVoiceName
            ) {
                option.selected = true;
            }

            voiceSelect.appendChild(option);
        });

        voiceStatus.textContent =
            voices.length +
            " English voices available.";
    }


    chooseCuratorVoice();


    if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged =
            function () {

                chooseCuratorVoice();

                if (
                    voiceOverlay.style.display ===
                    "flex"
                ) {
                    populateVoiceSelector();
                }
            };
    }


    function testSelectedVoice() {
        if (!("speechSynthesis" in window)) {
            voiceStatus.textContent =
                "Speech is not supported on this device.";

            return;
        }

        const voices = getEnglishVoices();

        const chosen =
            voices.find(function (voice) {
                return (
                    voice.name ===
                    voiceSelect.value
                );
            });

        if (!chosen) {
            voiceStatus.textContent =
                "Please choose a voice.";

            return;
        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(
                "Can you hear me? Good. We may begin."
            );

        speech.voice = chosen;

        /*
            We keep the pitch fairly low,
            but not so low that it becomes distorted.
        */

        speech.rate = 0.64;
        speech.pitch = 0.45;
        speech.volume = 1;

        window.speechSynthesis.speak(speech);
    }


    function saveSelectedVoice() {
        const chosenName =
            voiceSelect.value;

        if (!chosenName) {
            voiceStatus.textContent =
                "Choose a voice first.";

            return;
        }

        selectedVoiceName = chosenName;

        localStorage.setItem(
            "rightPathCuratorVoice",
            selectedVoiceName
        );

        chooseCuratorVoice();

        voiceStatus.textContent =
            "Saved: " + selectedVoiceName;
    }


    /*
        NORMAL ELIAS SPEECH
    */

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

            /*
                Safety timer:
                voice can never freeze the game.
            */

            const safetyTimer =
                setTimeout(function () {

                    try {
                        window.speechSynthesis.cancel();
                    } catch (error) {
                        // Ignore.
                    }

                    finish();

                }, 5000);


            if (!("speechSynthesis" in window)) {
                clearTimeout(safetyTimer);

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

                window.speechSynthesis.cancel();

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
                    clearTimeout(safetyTimer);

                    setTimeout(
                        finish,
                        400
                    );
                };

                speech.onerror = function () {
                    clearTimeout(safetyTimer);

                    setTimeout(
                        finish,
                        700
                    );
                };

                window.speechSynthesis.speak(
                    speech
                );

            } catch (error) {
                clearTimeout(safetyTimer);

                setTimeout(
                    finish,
                    900
                );
            }
        });
    }


    /*
        INTRODUCTION
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
        const alreadyAdded =
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

        if (!alreadyAdded) {
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
        if (journalEntries.length === 0) {
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

                grouped[entry.level].push(
                    entry
                );
            }
        );

        journalContent.innerHTML =
            Object.keys(grouped)

            .map(function (levelNumber) {
                const entries =
                    grouped[levelNumber]

                    .map(function (entry) {

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
                    })

                    .join("");

                return `
                    <section class="journal-level">
                        <h3>
                            Room ${levelNumber}
                        </h3>

                        ${entries}
                    </section>
                `;
            })

            .join("");
    }


    function openJournal() {
        renderJournal();

        journalOverlay.classList.add("open");
    }


    function closeJournal() {
        journalOverlay.classList.remove("open");
    }


    /*
        INVESTIGATION
    */

    function resetInvestigationState() {
        investigatedIds = new Set();

        evidenceCard.textContent =
            "Select an object to examine it.";
    }


    function updateInvestigationProgress(level) {
        const required =
            level.requiredInvestigations || 0;

        const found =
            investigatedIds.size;

        const enoughEvidence =
            found >= required;

        const choiceButtons =
            choicesContainer.querySelectorAll(
                ".choice"
            );

        if (
            level.investigations &&
            level.investigations.length > 0
        ) {
            evidenceProgress.textContent =
                enoughEvidence
                    ? "You have enough evidence. Make your choice."
                    : "Evidence examined: " +
                      found +
                      " / " +
                      required;
        } else {
            evidenceProgress.textContent = "";
        }

        choiceButtons.forEach(
            function (button) {
                button.disabled =
                    !enoughEvidence;
            }
        );

        choicesContainer.classList.toggle(
            "choices-locked",
            !enoughEvidence
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

        updateInvestigationProgress(
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


    function renderInvestigations(level) {
        investigationGrid.innerHTML = "";

        if (
            !level.investigations ||
            level.investigations.length === 0
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
            function (investigation) {

                const button =
                    document.createElement("button");

                button.className =
                    "investigation-button";

                button.type = "button";

                button.innerHTML = `
                    <span class="investigation-icon">
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
        LEVEL SYSTEM
    */

    function loadLevel() {
        const level =
            levels[currentLevelIndex];

        resetInvestigationState();

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
                    document.createElement("button");

                button.className = "choice";

                button.textContent =
                    choice.text;

                button.addEventListener(
                    "click",
                    function () {

                        handleChoice(choice);
                    }
                );

                choicesContainer.appendChild(
                    button
                );
            }
        );

        renderInvestigations(level);

        if (
            level.investigations &&
            level.investigations.length > 0
        ) {
            updateInvestigationProgress(
                level
            );

        } else {
            const choiceButtons =
                choicesContainer.querySelectorAll(
                    ".choice"
                );

            choiceButtons.forEach(
                function (button) {
                    button.disabled = false;
                }
            );

            choicesContainer.classList.remove(
                "choices-locked"
            );
        }
    }


    async function handleChoice(choice) {
        const level =
            levels[currentLevelIndex];

        const choiceButtons =
            document.querySelectorAll(
                ".choice"
            );

        choiceButtons.forEach(
            function (button) {
                button.disabled = true;
            }
        );

        if (choice.correct) {
            curatorMessage.textContent =
                level.success;

            successLabel.textContent =
                "LEVEL " +
                level.number +
                " COMPLETE";

            successTitle.textContent =
                "You chose correctly.";

            successMessage.textContent =
                level.success;

            await speakAsCurator(
                level.success
            );

            await fadeToScreen(
                levelScreen,
                successScreen
            );

        } else {
            curatorMessage.textContent =
                level.death;

            deathMessage.textContent =
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
        MAIN BUTTONS
    */

    startButton.addEventListener(
        "click",
        function () {

            try {
                if (
                    typeof startAmbientSound ===
                    "function"
                ) {
                    startAmbientSound();
                }
            } catch (error) {
                console.log(
                    "Ambient audio unavailable."
                );
            }

            playIntroduction();
        }
    );


    retryButton.addEventListener(
        "click",
        function () {

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }

            loadLevel();

            showScreen(levelScreen);
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

                showScreen(titleScreen);

                return;
            }

            loadLevel();

            showScreen(levelScreen);
        }
    );


    journalButton.addEventListener(
        "click",
        openJournal
    );


    closeJournalButton.addEventListener(
        "click",
        closeJournal
    );


    journalOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                journalOverlay
            ) {
                closeJournal();
            }
        }
    );


    /*
        VOICE SELECTOR BUTTONS
    */

    voiceButton.addEventListener(
        "click",
        function () {

            populateVoiceSelector();

            voiceOverlay.style.display =
                "flex";
        }
    );


    closeVoiceButton.addEventListener(
        "click",
        function () {

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }

            voiceOverlay.style.display =
                "none";
        }
    );


    testVoiceButton.addEventListener(
        "click",
        testSelectedVoice
    );


    saveVoiceButton.addEventListener(
        "click",
        saveSelectedVoice
    );


    refreshVoicesButton.addEventListener(
        "click",
        function () {

            populateVoiceSelector();
        }
    );
});
