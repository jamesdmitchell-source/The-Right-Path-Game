const levels = [
    {
        number: 1,
        title: "Observation",

        observation:
            "A cold concrete room. Two doors stand ahead beneath a flickering fluorescent light.",

        clue:
            "Observe first. Choose second.",

        question:
            "The control panel is unlocked. Which door do you choose?",

        investigations: [
            {
                id: "clock",
                name: "Clock",
                icon: "🕒",

                description:
                    "The clock has stopped at 03:17. Scratched into the metal beneath it are two words: TOO LATE.",

                curator:
                    "Time matters more when you know what was lost."
            },

            {
                id: "note",
                name: "Note",
                icon: "📝",

                description:
                    "A handwritten note reads: OBSERVE FIRST. CHOOSE SECOND. At the bottom is a single letter: C.",

                curator:
                    "At least you read before you act."
            },

            {
                id: "camera",
                name: "CCTV Camera",
                icon: "📹",

                description:
                    "The camera is aimed directly at the black door. Its red recording light is still glowing."
            },

            {
                id: "blackDoor",
                name: "Black Door",
                icon: "🚪",

                description:
                    "There are deep scratches around the handle. A dried bloodstain runs down the frame."
            },

            {
                id: "whiteDoor",
                name: "White Door",
                icon: "🚪",

                description:
                    "The handle is clean. Dust has been disturbed around the base, as though this door opened recently."
            }
        ],

        requiredInvestigations: 5,

        puzzle: {
            type: "keypad",

            title:
                "OBSERVATION REQUIRED",

            instruction:
                "Enter the four-digit code hidden somewhere in this room.",

            answer:
                "0317",

            wrong:
                "ACCESS DENIED",

            correct:
                "ACCESS GRANTED",

            curatorSuccess:
                "Good. You can observe. Now let us see whether you can interpret."
        },

        choices: [
            {
                text: "Black Door",
                correct: false
            },

            {
                text: "White Door",
                correct: true
            }
        ],

        success:
            "Interesting. You observed before acting.",

        death:
            "You saw the evidence. You simply chose to ignore it."
    },

    {
        number: 2,
        title: "The Silent Room",

        observation:
            "Two corridors lie ahead. Music plays from one. The other is completely silent.",

        clue:
            "Noise is designed to attract attention. Silence often hides the truth.",

        question:
            "Which corridor do you enter?",

        choices: [
            {
                text: "The Corridor With Music",
                correct: false
            },

            {
                text: "The Silent Corridor",
                correct: true
            }
        ],

        success:
            "You resisted the distraction. Continue.",

        death:
            "You followed what wanted to be noticed."
    }
];
