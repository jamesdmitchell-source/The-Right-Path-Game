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

    async function showDialogueLine(line) {
        introText.classList.add("hidden");

        await wait(450);

        introText.textContent = line;
        introText.classList.remove("hidden");

        await wait(2200);
    }

    async function playIntroduction() {
        startButton.disabled = true;

        await fadeToScreen(titleScreen, introScreen);

        await wait(1200);

        for (const line of introLines) {
            await showDialogueLine(line);
        }

        introText.classList.add("hidden");

        await wait(900);

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
                curatorMessage.textContent =
                    "Interesting. You observed before acting.";

                await wait(1800);
                await fadeToScreen(levelScreen, successScreen);
            } else {
                curatorMessage.textContent =
                    "You mistook confidence for understanding.";

                await wait(1800);
                await fadeToScreen(levelScreen, deathScreen);
            }
        });
    });

    retryButton.addEventListener("click", function () {
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
