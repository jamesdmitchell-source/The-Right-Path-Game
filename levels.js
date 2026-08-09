const levels = [

    /*
        ==============================
        LEVEL 1
        OBSERVATION
        ==============================
    */

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
        ==============================
        LEVEL 2
        THE THREE VOICES
        ==============================
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
            SPEAKER RECORDINGS
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
                    "Do not trust the first speaker."
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
    },


    /*
        ==============================
        LEVEL 3
        THE PREVIOUS SUBJECT
        ==============================
    */

    {
        number: 3,
        title: "The Previous Subject",

        observation:
            "The next room is older than the others. Damp stains spread across the concrete walls. A restraint chair is bolted to the centre of the floor. Above it, scratched deeply into the wall, are the words SUBJECT 19.",

        clue:
            "Someone was here before you.",

        intro:
            "Some people leave remarkably persistent traces behind.",

        question:
            "Find what Subject 19 discovered.",


        /*
            SUBJECT 19 RECORDING
        */

        recording: {

            id: "subject19Recording",

            label:
                "DAMAGED RECORDER",

            lines: [

                "If someone finds this... don't listen to him.",

                "The rooms aren't what he's testing.",

                "He's testing you."

            ],

            curatorAfter:
                "Curiosity can be a dangerous habit."
        },


        /*
            LEVEL 3 INVESTIGATIONS
        */

        investigations: [

            {
                id: "brokenWatch",
                name: "Broken Watch",
                icon: "⌚",

                description:
                    "A cracked wristwatch lies beneath the chair. Its hands are frozen, but someone has scratched four marks into the back: left, right, right, left."
            },

            {
                id: "restraints",
                name: "Restraints",
                icon: "⛓️",

                description:
                    "Leather restraints are fixed to both arms of the chair. Beneath each armrest is a small metal pressure switch."
            },

            {
                id: "floorScratches",
                name: "Floor Scratches",
                icon: "〰️",

                description:
                    "The floor around the chair is scored with repeated drag marks. Four of them have been deliberately deepened: left, right, right, left."
            },

            {
                id: "photograph",
                name: "Photograph",
                icon: "📷",

                description:
                    "A faded photograph shows a frightened man standing beside a woman and young girl. Someone has written SUBJECT 19 on the back.",

                optional: true,

                journalSecret:
                    "Subject 19 had a family. Elias did not choose people without lives outside this place."
            },

            {
                id: "recorder",
                name: "Audio Recorder",
                icon: "🎙️",

                description:
                    "An old handheld recorder has been wedged beneath the chair. Its battery indicator flickers weakly."
            }

        ],


        /*
            The player only NEEDS four
            investigation discoveries.

            The photograph is optional evidence.
        */

        requiredInvestigations: 4,


        /*
            NEW LEVEL 3 PUZZLE TYPE

            script.js will turn this into
            LEFT and RIGHT switches.

            Required sequence:

            LEFT
            RIGHT
            RIGHT
            LEFT
        */

        sequencePuzzle: {

            type:
                "direction",

            title:
                "RESTRAINT CONTROL",

            instruction:
                "Four inputs are required.",

            answer: [
                "LEFT",
                "RIGHT",
                "RIGHT",
                "LEFT"
            ],

            correct:
                "RELEASE MECHANISM ENGAGED",

            wrong:
                "SEQUENCE REJECTED",

            curatorSuccess:
                "He noticed more than I expected."
        },


        /*
            Only one exit.

            The puzzle unlocks it.
        */

        choices: [

            {
                text:
                    "Heavy Steel Door",

                correct:
                    true
            }

        ],

        success:
            "Subject 19 found the pattern. You found what he left behind.",

        death:
            "Patterns are meaningless if you cannot follow them."
    }

];
