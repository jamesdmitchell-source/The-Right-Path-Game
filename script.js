document.addEventListener("DOMContentLoaded", function () {
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

    function showScreen(screen) {
        document.querySelectorAll(".screen").forEach(function (item) {
            item.classList.remove("active");
        });

        screen.classList.add("active");
    }

    function wait(milliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, milliseconds);
        });
    }

    async function playIntroduction() {
        showScreen(introScreen);

        for (const line of introLines) {
            introText.textContent = line;
            await wait(2200);
        }

        introText.textContent = "";
        await wait(700);
        showScreen(levelScreen);
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
                showScreen(successScreen);
            } else {
                curatorMessage.textContent =
                    "You mistook confidence for understanding.";

                await wait(1800);
                showScreen(deathScreen);
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
