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

    const introLines = [
        "Can you hear me?",
        "Good.",
        "You have been looking for answers.",
        "Now you will discover whether you deserve them.",
        "Observe first.",
        "Choose second."
    ];

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

            const speech = new SpeechSynthesisUtterance(line);
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

        await fadeToScreen(titleScreen, introScreen);
        await wait(1000);

        for (const line of introLines) {
            await showDialogueLine(line);
        }

        introText.classList.add("hidden");
        await wait(800);

        loadLevel();
        await fadeToScreen(introScreen, levelScreen);

        startButton.disabled = false;
    }

    function loadLevel() {
        const level = levels[currentLevelIndex];

        levelHeader.innerHTML =
            "<span>SUBJECT 47</span>" +
            "<span>LEVEL " + level.number + " / 100</span>";

        observationText.textContent = level.observation;
        clueText.textContent = level.clue;
        questionTitle.textContent = level.title;
        questionText.textContent = level.question;
        curatorMessage.textContent = "";

        choicesContainer.innerHTML = "";

        level.choices.forEach(function (choice) {
            const button = document.createElement("button");

            button.className = "choice";
            button.textContent = choice.text;

            button.addEventListener("click", function () {
                handleChoice(choice);
            });

            choicesContainer.appendChild(button);
        });
    }

    async function handleChoice(choice) {
        const level = levels[currentLevelIndex];
        const choiceButtons = document.querySelectorAll(".choice");

        choiceButtons.forEach(function (button) {
            button.disabled = true;
        });

        if (choice.correct) {
            curatorMessage.textContent = level.success;

            successLabel.textContent =
                "LEVEL " + level.number + " COMPLETE";

            successTitle.textContent =
                "You chose correctly.";

            successMessage.textContent =
                level.success;

            await speakAsCurator(level.success);
            await fadeToScreen(levelScreen, successScreen);
        } else {
            curatorMessage.textContent = level.death;
            deathMessage.textContent = level.death;

            await speakAsCurator(level.death);
            await fadeToScreen(levelScreen, deathScreen);
        }
    }

    startButton.addEventListener("click", function () {
        playIntroduction();
    });

    retryButton.addEventListener("click", function () {
        window.speechSynthesis.cancel();
        loadLevel();
        showScreen(levelScreen);
    });

    continueButton.addEventListener("click", function () {
        currentLevelIndex += 1;

        if (currentLevelIndex >= levels.length) {
            alert("You have completed the current prototype.");
            currentLevelIndex = 0;
            showScreen(titleScreen);
            return;
        }

        loadLevel();
        showScreen(levelScreen);
    });
});
