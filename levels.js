const levels = [

    /*
        ==============================
        LEVEL 1
        OBSERVATION
        ==============================
    */

    {
        number: 1,

        title:
            "Observation",

        observation:
            "A cold concrete room. Two doors stand ahead beneath a flickering fluorescent light.",

        clue:
            "Observe first. Choose second.",

        question:
            "The control panel is unlocked. Which door do you choose?",

        investigations: [

            {
                id:
                    "clock",

                name:
                    "Clock",

                icon:
                    "🕒",

                description:
                    "The clock has stopped at 03:17. Scratched into the metal beneath it are two words: TOO LATE.",

                curator:
                    "Time matters more when you know what was lost."
            },

            {
                id:
                    "note",

                name:
                    "Note",

                icon:
                    "📝",

                description:
                    "A handwritten note reads: OBSERVE FIRST. CHOOSE SECOND. At the bottom is a single letter: C.",

                curator:
                    "At least you read before you act."
            },

            {
                id:
                    "camera",

                name:
                    "CCTV Camera",

                icon:
                    "📹",

                description:
                    "The camera is aimed directly at the black door. Its red recording light is still glowing."
            },

            {
                id:
                    "blackDoor",

                name:
                    "Black Door",

                icon:
                    "🚪",

                description:
                    "There are deep scratches around the handle. A dried bloodstain runs down the frame."
            },

            {
                id:
                    "whiteDoor",

                name:
                    "White Door",

                icon:
                    "🚪",

                description:
                    "The handle is clean. Dust has been disturbed around the base, as though this door opened recently."
            }

        ],

        requiredInvestigations:
            5,

        puzzle: {

            type:
                "keypad",

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
                text:
                    "Black Door",

                correct:
                    false
            },

            {
                text:
                    "White Door",

                correct:
                    true
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
        number:
            2,

        title:
            "The Three Voices",

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
                id:
                    "speakerA",

                label:
                    "SPEAKER A",

                statement:
                    "The correct door is not red."
            },

            {
                id:
                    "speakerB",

                label:
                    "SPEAKER B",

                statement:
                    "Do not trust the first speaker."
            },

            {
                id:
                    "speakerC",

                label:
                    "SPEAKER C",

                statement:
                    "The correct door is white."
            }

        ],


        /*
            INVESTIGATION CLUES
        */

        investigations: [

            {
                id:
                    "speakerAUnit",

                name:
                    "Speaker A",

                icon:
                    "🔊",

                description:
                    "The grille is dusty but undamaged. The wiring behind the casing appears old and untouched."
            },

            {
                id:
                    "speakerBUnit",

                name:
                    "Speaker B",

                icon:
                    "🔊",

                description:
                    "The casing has been opened recently. One of the internal wires is newer than the others."
            },

            {
                id:
                    "speakerCUnit",

                name:
                    "Speaker C",

                icon:
                    "🔊",

                description:
                    "The speaker casing is intact. Several scratches have been carved into the wall beneath it."
            },

            {
                id:
                    "maintenancePanel",

                name:
                    "Maintenance Panel",

                icon:
                    "🛠️",

                description:
                    "Inside is a faded technician's note: UNIT B — MEMORY FAULT. OUTPUT UNRELIABLE.",

                curator:
                    "You are beginning to understand. Information and truth are not the same thing."
            }

        ],

        requiredInvestigations:
            4,

        choices: [

            {
                text:
                    "Red Door",

                correct:
                    false,

                consequence:
                    "The red door opens three inches, then locks. A pressure valve releases above you."
            },

            {
                text:
                    "White Door",

                correct:
                    true
            },

            {
                text:
                    "Black Door",

                correct:
                    false,

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
        number:
            3,

        title:
            "The Previous Subject",

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

            id:
                "subject19Recording",

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
                id:
                    "brokenWatch",

                name:
                    "Broken Watch",

                icon:
                    "⌚",

                description:
                    "A cracked wristwatch lies beneath the chair. Its hands are frozen, but someone has scratched four marks into the back: left, right, right, left."
            },

            {
                id:
                    "restraints",

                name:
                    "Restraints",

                icon:
                    "⛓️",

                description:
                    "Leather restraints are fixed to both arms of the chair. Beneath each armrest is a small metal pressure switch."
            },

            {
                id:
                    "floorScratches",

                name:
                    "Floor Scratches",

                icon:
                    "〰️",

                description:
                    "The floor around the chair is scored with repeated drag marks. Four of them have been deliberately deepened: left, right, right, left."
            },

            {
                id:
                    "photograph",

                name:
                    "Photograph",

                icon:
                    "📷",

                description:
                    "A faded photograph shows a frightened man standing beside a woman and young girl. Someone has written SUBJECT 19 on the back.",

                optional:
                    true,

                journalSecret:
                    "Subject 19 had a family. Elias did not choose people without lives outside this place."
            },

            {
                id:
                    "recorder",

                name:
                    "Audio Recorder",

                icon:
                    "🎙️",

                description:
                    "An old handheld recorder has been wedged beneath the chair. Its battery indicator flickers weakly."
            }

        ],

        requiredInvestigations:
            4,


        /*
            LEVEL 3 SEQUENCE PUZZLE

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
    },


  /*
    ==============================
    LEVEL 4
    PRESSURE
    ==============================
*/

{
    number:
        4,

    title:
        "Pressure",

    intro:
        "You've had time to think until now. Let's see what happens when I take that away.",

    observation:
        "A wide concrete chamber. Four symbols are mounted around the walls beneath a heavy steel ceiling. Somewhere above you, machinery begins to stir.",

    clue:
        "The symbols are not the answer. Their order is.",

    question:
        "Reconstruct the sequence before the chamber closes around you.",

    investigations: [

        {
            id:
                "eye",

            name:
                "Eye",

            icon:
                "👁️",

            description:
                "A surveillance lens is mounted behind the eye symbol. Its recording indicator was activated before the chamber door opened.",

            curator:
                "Observation should always come first."
        },

        {
            id:
                "doorSymbol",

            name:
                "Door",

            icon:
                "🚪",

            description:
                "The locking mechanism logged its last activation immediately after someone crossed the threshold."
        },

        {
            id:
                "clockSymbol",

            name:
                "Clock",

            icon:
                "🕒",

            description:
                "The clock stopped at 03:17. The glass is cracked inward, as though something struck it from inside the room."
        },

        {
            id:
                "hand",

            name:
                "Handprint",

            icon:
                "✋",

            description:
                "A dark handprint has been dragged downward across the wall beneath the clock."
        },

        {
            id:
                "scratching",

            name:
                "Wall Scratching",

            icon:
                "🔎",

            description:
                "Four words have been scratched repeatedly into the concrete: WATCH. ENTER. TIME. FALL.",

            curator:
                "Someone before you understood eventually."
        }

    ],

    requiredInvestigations:
        5,

    pressurePuzzle: {

        type:
            "pressure-sequence",

        title:
            "PRESSURE CONTROL",

        instruction:
            "Reconstruct the sequence.",

        answer: [
            "EYE",
            "DOOR",
            "CLOCK",
            "HAND"
        ],

        timeLimit:
            85,

        wrong:
            "SEQUENCE REJECTED",

        correct:
            "SEQUENCE ACCEPTED",

        curatorHalfway:
            "Pressure changes people.",

        curatorWarning:
            "You're running out of room, Subject 28.",

        curatorSuccess:
            "Interesting. Fear usually makes people careless. You appear to be learning."
    },

    choices: [

        {
            text:
                "Exit Chamber",

            correct:
                true
        }

    ],

    success:
        "The ceiling retracts. The exit unlocks.",

    death:
        "Failure under pressure."
},


/*
    ==============================
    LEVEL 5
    INTERVENTION
    ==============================
*/

{
    number:
        5,

    title:
        "Intervention",

    intro:
        "Until now, your mistakes have only endangered you. I thought it was time we changed that.",

    observation:
        "A woman is restrained in a steel chair at the centre of the chamber. A cloth gag covers her mouth. Directly above her, a heavy blade hangs vertically from an electromagnetic release mechanism. A red warning lamp begins to pulse.",

    clue:
        "Stopping the machine is not the same as switching it off.",

    question:
        "Disable the suspension system before the blade is released.",


    /*
        ==============================
        LEVEL 5 INVESTIGATIONS
        ==============================
    */

    investigations: [

        {
            id:
                "magnet",

            name:
                "Electromagnet",

            icon:
                "🧲",

            description:
                "The blade is suspended by a powered electromagnet. A warning plate reads: LOSS OF CURRENT WILL RELEASE LOAD.",

            curator:
                "The obvious solution is often the most dangerous."
        },

        {
            id:
                "brake",

            name:
                "Mechanical Brake",

            icon:
                "⚙️",

            description:
                "A secondary brake surrounds the suspension rail. Its indicator is dark. A handwritten maintenance note says: ENGAGE BRAKE BEFORE POWER IS INTERRUPTED."
        },

        {
            id:
                "lock",

            name:
                "Safety Lock",

            icon:
                "🔒",

            description:
                "The locking pin cannot engage while the suspension rail is moving. A diagram shows the brake stopping the rail before the lock slides into position."
        },

        {
            id:
                "power",

            name:
                "Power Control",

            icon:
                "⚡",

            description:
                "The emergency power switch isolates the electromagnet. Turning it off before the mechanical safeguards engage would release the blade immediately."
        },

        {
            id:
                "release",

            name:
                "Release Control",

            icon:
                "🔧",

            description:
                "The final control disengages the automated drop mechanism. A service label reads: SAFETY LOCK REQUIRED BEFORE RELEASE CIRCUIT MAY BE DISABLED."
        },

        {
            id:
                "serviceDiagram",

            name:
                "Service Diagram",

            icon:
                "📋",

            description:
                "A faded diagram shows four stages of shutdown: stop movement, secure the load, isolate power, disable the release circuit."
        }

    ],

    requiredInvestigations:
        6,


    /*
        ==============================
        LEVEL 5 BLADE PUZZLE
        ==============================

        STOP MOVEMENT = BRAKE
        SECURE LOAD   = LOCK
        ISOLATE       = POWER
        DISABLE       = RELEASE

        Correct sequence:

        BRAKE
        LOCK
        POWER
        RELEASE
    */

    bladePuzzle: {

        type:
            "timed-sequence",

        title:
            "SUSPENSION CONTROL",

        instruction:
            "Complete the emergency shutdown procedure.",

        answer: [
            "BRAKE",
            "LOCK",
            "POWER",
            "RELEASE"
        ],

        timeLimit:
            70,

        wrong:
            "UNSAFE SHUTDOWN SEQUENCE",

        correct:
            "SUSPENSION SECURED",

        curatorHalfway:
            "Interesting, isn't it? People think very differently when the consequences belong to someone else.",

        curatorWarning:
            "She's running out of time, Subject 28.",

        curatorSuccess:
            "You acted. Most people spend longer deciding whether another life is worth the risk."
    },


    /*
        The player cannot leave until
        the blade system is secured.
    */

    choices: [

        {
            text:
                "Open Exit Door",

            correct:
                true
        }

    ],

    success:
        "The blade locks in place. The warning light dies. The exit mechanism releases.",

    death:
        "You hesitated."
},
/*
    ==============================
    LEVEL 6
    JUDGEMENT
    ==============================
*/

{
    number:
        6,

    title:
        "Judgement",

    intro:
        "You understand me a little better now, Twenty-eight. So perhaps you're ready to understand the purpose of judgement.",

    observation:
        "A vast observation window fills the far wall. Behind the reinforced glass, an adult man is restrained in a steel chair beneath a harsh white light. He is conscious. Two illuminated controls face you: MERCY and JUDGEMENT.",

    clue:
        "A verdict without truth is not justice.",

    question:
        "Decide the fate of the man behind the glass.",


    /*
        ==============================
        PRISONER
        ==============================
    */

    prisoner: {

        name:
            "Daniel Mercer",

        status:
            "SUBJECT 31",

        openingLines: [

            "Whatever he told you about me... he's lying.",

            "Please. You don't know what happened.",

            "Don't let him make you choose."

        ]
    },


    /*
        ==============================
        LEVEL 6 INVESTIGATIONS
        ==============================
    */

    investigations: [

        {
            id:
                "incidentReport",

            name:
                "Incident Report",

            icon:
                "📄",

            description:
                "An official incident report names Daniel Mercer. Several lines describing the event have been deliberately blacked out.",

            curator:
                "The facts that matter are still there."
        },

        {
            id:
                "newspaper",

            name:
                "Newspaper Clipping",

            icon:
                "📰",

            description:
                "A newspaper clipping describes an incident three years earlier. One person was seriously injured. Daniel's name has been circled in dark ink."
        },

        {
            id:
                "photograph",

            name:
                "Photograph",

            icon:
                "📷",

            description:
                "Daniel is standing beside another man outside a small workshop. On the back someone has written: THERE WERE TWO OF THEM."
        },

        {
            id:
                "intercom",

            name:
                "Intercom",

            icon:
                "🎙️",

            description:
                "The intercom connects directly to the chamber behind the glass.",

            prisonerLine:
                "I made a mistake. But what he's telling you isn't the whole story."
        },

        {
            id:
                "controlPanel",

            name:
                "Control Panel",

            icon:
                "⚙️",

            description:
                "The panel offers only two authorised commands: MERCY and JUDGEMENT. A maintenance indicator beneath them flashes faintly."
        },

        {
            id:
                "maintenancePort",

            name:
                "Maintenance Port",

            icon:
                "🔧",

            description:
                "Behind the maintenance cover is a third command circuit. Someone tried to conceal its label beneath black tape.",

            journalSecret:
                "The system was designed with a third possible response. Elias deliberately hid it."
        }

    ],

    requiredInvestigations:
        6,


    /*
        ==============================
        LEVEL 6 JUDGEMENT PUZZLE
        ==============================
    */

    judgementPuzzle: {

        type:
            "judgement",

        title:
            "FINAL VERDICT",

        instruction:
            "Choose a verdict.",

        timeLimit:
            60,

        options: [

            {
                id:
                    "MERCY",

                text:
                    "MERCY",

                correct:
                    false
            },

            {
                id:
                    "JUDGEMENT",

                text:
                    "JUDGEMENT",

                correct:
                    false
            },

            {
                id:
                    "NO_VERDICT",

                text:
                    "NO VERDICT",

                correct:
                    true,

                hidden:
                    true
            }

        ],

        wrong:
            "VERDICT ACCEPTED",

        correct:
            "VERDICT REFUSED",

        curatorHalfway:
            "Surely you don't need this long to decide whether a man deserves mercy.",

        curatorWarning:
            "Ten seconds, Twenty-eight. Judge him.",

        curatorSuccess:
            "Interesting. I offered you two paths... and you made your own."
    },


    choices: [

        {
            text:
                "Leave Judgement Chamber",

            correct:
                true
        }

    ],

    success:
        "The judgement system shuts down. The restraints behind the glass release.",

    death:
        "You judged a man without knowing the truth."
}
];
