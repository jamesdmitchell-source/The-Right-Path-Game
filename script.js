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
        JOURNAL
    */

    const journalOverlay = document.createElement("div");
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
        ELIAS VOICE
    */

    function chooseCuratorVoice() {
        if (!("speechSynthesis" in window)) {
            return;
        }

        const voices =
            window.speechSynthesis.getVoices();

        if (!voices.length) {
            return;
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
                    voice.lang.startsWith("en-GB") &&
                    preferredNames.some(
                        function (preferred) {
                            return name.includes(preferred);
                        }
                    )
                );
            }) ||

            voices.find(function (voice) {
                return voice.lang.startsWith("en-GB");
            }) ||

            voices.find(function (voice) {
                return voice.lang.startsWith("en");
            }) ||

            null;
    }

    chooseCuratorVoice();

    if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged =
            function () {
                if (!curatorVoice) {
                    chooseCuratorVoice();
                }
            };
    }

    /*
        IMPORTANT:
        Speech is allowed a maximum of 5 seconds.
        If Safari gets stuck, the game carries on.
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
                Emergency timeout.
                Voice can NEVER freeze the game.
            */

            const safetyTimer =
                setTimeout(function () {
                    try {
                        window.speechSynthesis.cancel();
                    } catch (error) {
                        // Ignore speech errors.
                    }

                    finish();
                }, 5000);

            if (!("speechSynthesis" in window)) {
                clearTimeout(safetyTimer);
                setTimeout(finish, 1800);
                return;
            }

            try {
                if (!curatorVoice) {
                    chooseCuratorVoice();
                }

                window.speechSynthesis.cancel();

                const speech =
                    new SpeechSynthesisUtterance(line);

                if (curatorVoice) {
                    speech.voice = curatorVoice;
                }

                speech.rate = 0.66;
                speech.pitch = 0.45;
                speech.volume = 1;

                speech.onend = function () {
                    clearTimeout(safetyTimer);

                    setTimeout(
                        finish,
                        450
                    );
                };

                speech.onerror = function () {
                    clearTimeout(safetyTimer);

                    setTimeout(
                        finish,
                        700
                    );
                };

                window.speechSynthesis.speak(speech);

            } catch (error) {
                clearTimeout(safetyTimer);

                setTimeout(
                    finish,
                    1000
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

        /*
            Voice and text now have a guaranteed
            maximum waiting time.
        */

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
        JOURNAL FUNCTIONS
    */

    function addJournalEntry(
        level,
        investigation
    ) {
        const alreadyAdded =
            journalEntries.some(function (entry) {
                return (
                    entry.level === level.number &&
                    entry.id === investigation.id
                );
            });

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

        journalEntries.forEach(function (entry) {
            if (!grouped[entry.level]) {
                grouped[entry.level] = [];
            }

            grouped[entry.level].push(entry);
        });

        journalContent.innerHTML =
            Object.keys(grouped)

            .map(function (levelNumber) {
                const entries =
                    grouped[levelNumber]

                    .map(function (entry) {
                        return `
                            <article class="journal-entry">
                                <h4>${entry.name}</h4>
                                <p>${entry.description}</p>
                            </article>
                        `;
                    })

                    .join("");

                return `
                    <section class="journal-level">
                        <h3>Room ${levelNumber}</h3>
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
        INVESTIGATION MODE
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

        choiceButtons.forEach(function (button) {
            button.disabled = !enoughEvidence;
        });

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

        updateInvestigationProgress(level);

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

        level.choices.forEach(function (choice) {
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
        });

        renderInvestigations(level);

        if (
            level.investigations &&
            level.investigations.length > 0
        ) {
            updateInvestigationProgress(level);

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

            /*
                Ambient audio must never prevent
                the game from starting.
            */

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
});
