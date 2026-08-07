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

    const introLines = [
        "Can you hear me?",
        "Good.",
        "You have been looking for answers.",
        "Now you will discover whether you deserve them.",
        "Observe first.",
        "Choose second."
    ];

    const investigationPanel = document.createElement("section");

    investigationPanel.className = "investigation-panel";

    investigationPanel.innerHTML = `
        <div class="investigation-heading">
            <span>INVESTIGATE</span>
            <button id="journalButton" class="small-button" type="button">
                Journal
            </button>
        </div>

        <div id="investigationGrid" class="investigation-grid"></div>

        <div id="evidenceCard" class="evidence-card">
            Select an object to examine it.
        </div>

        <p id="evidenceProgress" class="evidence-progress"></p>
    `;

    choicesContainer.parentNode.insertBefore(
        investigationPanel,
        choicesContainer
    );

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

            <div id="journalContent" class="journal-content"></div>

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

    function wait(milliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, milliseconds);
        });
    }

    function showScreen(screen) {
        screens.forEach(function (item) {
            item.classList.remove("active", "fade-out");
        });

        screen.classList.add("active");
    }

    async function fadeToScreen(currentScreen, nextScreen) {
        currentScreen.classList.add("fade-out");

        await wait(900);

        showScreen(nextScreen);
    }

    function findCuratorVoice() {
        const voices = window.speechSynthesis.getVoices();

        return (
            voices.find(function (voice) {
                const name = voice.name.toLowerCase();

                return (
                    voice.lang.startsWith("en-GB") &&
                    (
                        name.includes("male") ||
                        name.includes("daniel") ||
                        name.includes("arthur")
                    )
                );
            }) ||

            voices.find(function (voice) {
                return voice.lang.startsWith("en-GB");
            }) ||

            voices.find(function (voice) {
                return voice.lang.startsWith("en");
            }) ||

            null
        );
    }

    function speakAsCurator(line) {
        return new Promise(function (resolve) {

            if (!("speechSynthesis" in window)) {
                setTimeout(resolve, 2200);
                return;
            }

            window.speechSynthesis.cancel();

            const speech =
                new SpeechSynthesisUtterance(line);

            const voice = findCuratorVoice();

            if (voice) {
                speech.voice = voice;
            }

            speech.rate = 0.72;
            speech.pitch = 0.65;
            speech.volume = 0.9;

            speech.onend = function () {
                setTimeout(resolve, 500);
            };

            speech.onerror = function () {
                setTimeout(resolve, 1200);
            };

            window.speechSynthesis.speak(speech);
        });
    }

    async function showDialogueLine(line) {
        introText.classList.add("hidden");

        await wait(450);

        introText.textContent = line;

        introText.classList.remove("hidden");

        await speakAsCurator(line);
    }

    async function playIntroduction() {
        startButton.disabled = true;

        await fadeToScreen(
            titleScreen,
            introScreen
        );

        await wait(1000);

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

    function resetInvestigationState() {
        investigatedIds = new Set();

        evidenceCard.textContent =
            "Select an object to examine it.";
    }

    function addJournalEntry(level, investigation) {
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
                description: investigation.description
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

    function updateInvestigationProgress(level) {
        const required =
            level.requiredInvestigations || 0;

        const found =
            investigatedIds.size;

        const enoughEvidence =
            found >= required;

        const choiceButtons =
            choicesContainer.querySelectorAll(".choice");

        if (
            level.investigations &&
            level.investigations.length > 0
        ) {
            evidenceProgress.textContent =
                enoughEvidence
                    ? "You have enough evidence to make your choice."
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
            !investigatedIds.has(investigation.id);

        investigatedIds.add(investigation.id);

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

        button.classList.add("investigated");

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
            button.textContent = choice.text;

            button.addEventListener(
                "click",
                function () {
                    handleChoice(choice);
                }
            );

            choicesContainer.appendChild(button);
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

            choiceButtons.forEach(function (button) {
                button.disabled = false;
            });

            choicesContainer.classList.remove(
                "choices-locked"
            );
        }
    }

    async function handleChoice(choice) {
        const level =
            levels[currentLevelIndex];

        const choiceButtons =
            document.querySelectorAll(".choice");

        choiceButtons.forEach(function (button) {
            button.disabled = true;
        });

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

    startButton.addEventListener(
        "click",
        function () {
            playIntroduction();
        }
    );

    retryButton.addEventListener(
        "click",
        function () {
            window.speechSynthesis.cancel();

            loadLevel();

            showScreen(levelScreen);
        }
    );

    continueButton.addEventListener(
        "click",
        function () {
            currentLevelIndex += 1;

            if (
                currentLevelIndex >= levels.length
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
                event.target === journalOverlay
            ) {
                closeJournal();
            }
        }
    );
});
