const levels = [
    {
        number: 1,
        title: "Two Doors",

        observation:
            "A stopped clock reads 03:17. A folded note lies on the concrete floor.",

        clue:
            "Observe first. Choose second.",

        question:
            "Two doors stand before you. One has a black frame. One has a white frame.",

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
            "You mistook confidence for understanding."
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
