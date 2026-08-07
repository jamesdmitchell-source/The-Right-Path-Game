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

    const introText = document.getElementById("introText");
    const curatorMessage = document.getElementById("curatorMessage");
    const choiceButtons = document.querySelectorAll(".choice");

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

        const preferredVoice = voices.find(function (voice) {
            const name = voice.name.toLowerCase();

            return (
                voice.lang.startsWith("en-GB") &&
                (
                    name.includes("male") ||
                    name.includes("daniel") ||
                    name.includes("arthur")
                )
            );
        });

        return preferredVoice ||
            voices.find(function (voice) {
                return voice.lang.startsWith("en-GB");
            }) ||
            voices.find(function (voice) {
                return voice.lang.startsWith("en");
            }) ||
            null;
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
                setTimeout(resolve, 1500);
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

        await fadeToScreen(introScreen, levelScreen);

        startButton.disabled = false;
    }

    startButton.addEventListener("click", function () {
        playIntroduction();
    });

    choiceButtons.forEach(function (button) {
        button.addEventListener("click", async function () {
            const choice = button.dataset.choice;

            choiceButtons.forEach(function (item) {
                item.disabled = true;
            });

            if (choice === "white") {
                const successLine =
                    "Interesting. You observed before acting.";

                curatorMessage.textContent = successLine;
                await speakAsCurator(successLine);
                await fadeToScreen(levelScreen, successScreen);
            } else {
                const deathLine =
                    "You mistook confidence for understanding.";

                curatorMessage.textContent = deathLine;
                await speakAsCurator(deathLine);
                await fadeToScreen(levelScreen, deathScreen);
            }
        });
    });

    retryButton.addEventListener("click", function () {
        window.speechSynthesis.cancel();
        curatorMessage.textContent = "";

        choiceButtons.forEach(function (item) {
            item.disabled = false;
        });

        showScreen(levelScreen);
    });

    continueButton.addEventListener("click", function () {
        alert("Level 2 will be added in the next update.");
    });
});
