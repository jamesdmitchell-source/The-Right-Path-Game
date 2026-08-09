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


    /*
        LEVEL 2
        THE THREE VOICES
    */

    {
        number: 2,
        title: "The Three Voices",

        observation:
            "A narrow concrete chamber. Three old wall speakers face you from behind metal grilles. Beneath them are three doors: RED, WHITE and BLACK.",

        clue:
            "A statement is only useful if the source can be trusted.",

        intro:
            "Observation served you well. But observation is useless if you cannot distinguish truth from deception.",

        question:
            "Which door do you trust?",


        /*
            THREE SPEAKERS

            script.js will turn these into
            visual speaker panels with
            PLAY buttons.
        */

        speakers: [
            {
                id: "speakerA",
                label: "SPEAKER A",

                statement:
                    "The correct door is not red."
            },

            {
                id: "speakerB",
                label: "SPEAKER B",

                statement:
                    "Speaker A is lying."
            },

            {
                id: "speakerC",
                label: "SPEAKER C",

                statement:
                    "The correct door is white."
            }
        ],


        /*
            INVESTIGATION CLUES
        */

        investigations: [
            {
                id: "speakerAUnit",
                name: "Speaker A",
                icon: "🔊",

                description:
                    "The grille is dusty but undamaged. The wiring behind the casing appears old and untouched."
            },

            {
                id: "speakerBUnit",
                name: "Speaker B",
                icon: "🔊",

                description:
                    "The casing has been opened recently. One of the internal wires is newer than the others."
            },

            {
                id: "speakerCUnit",
                name: "Speaker C",
                icon: "🔊",

                description:
                    "The speaker casing is intact. Several scratches have been carved into the wall beneath it."
            },

            {
                id: "maintenancePanel",
                name: "Maintenance Panel",
                icon: "🛠️",

                description:
                    "Inside is a faded technician's note: UNIT B — MEMORY FAULT. OUTPUT UNRELIABLE.",

                curator:
                    "You are beginning to understand. Information and truth are not the same thing."
            }
        ],

        requiredInvestigations: 4,


        /*
            No keypad in Level 2.

            Once all evidence has been
            examined, the three doors unlock.
        */

        choices: [
            {
                text: "Red Door",
                correct: false,

                consequence:
                    "The red door opens three inches, then locks. A pressure valve releases above you."
            },

            {
                text: "White Door",
                correct: true
            },

            {
                text: "Black Door",
                correct: false,

                consequence:
                    "The black door opens into total darkness. Something mechanical moves behind you."
            }
        ],

        success:
            "Good. You did not believe what you were told. You looked for evidence. Perhaps there is hope for you yet.",

        death:
            "You trusted the statement. You ignored the source."
    }
];
