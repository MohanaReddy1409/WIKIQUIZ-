
// This simulates the data that would return from the Python Backend
export const MOCK_QUIZ_RESPONSE = {
    url: "https://en.wikipedia.org/wiki/Alan_Turing",
    title: "Alan Turing",
    summary: "A brief history of the father of modern computer science.",
    generated_at: new Date().toISOString(),
    quiz: [
        {
            id: 1,
            question: "Which machine did Alan Turing help decode during World War II?",
            options: ["The Enigma", "The Colossus", "The Lorenz", "The Sputnik"],
            answer: "The Enigma",
            explanation: "Turing played a crucial role in cracking intercepted coded messages that enabled the Allies to defeat the Nazis in many crucial engagements.",
            difficulty: "easy"
        },
        {
            id: 2,
            question: "What is the Turing Test designed to evaluate?",
            options: ["Computer Speed", "Machine Intelligence", "Memory Capacity", "Network Latency"],
            answer: "Machine Intelligence",
            explanation: "The Turing Test determines if a machine's ability to exhibit intelligent behavior is equivalent to, or indistinguishable from, that of a human.",
            difficulty: "medium"
        },
        {
            id: 3,
            question: "In which year was Alan Turing prosecuted for homosexual acts?",
            options: ["1945", "1952", "1960", "1939"],
            answer: "1952",
            explanation: "He was prosecuted in 1952 for homosexual acts; the Labouchere Amendment of 1885 had mandated that 'gross indecency' was a criminal offence in the UK.",
            difficulty: "hard"
        }
    ],
    sections: ["Early Life", "Cryptanalysis", "Legacy"],
    key_entities: {
        people: ["Alan Turing"],
        organizations: ["Bletchley Park"],
        locations: ["United Kingdom"]
    },
    related_topics: [
        "Enigma machine",
        "Turing completeness",
        "History of artificial intelligence",
        "Bletchley Park"
    ]
};

export const MOCK_HISTORY = [
    {
        id: 101,
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
        title: "Artificial Intelligence",
        date: "2023-10-25",
        questions_count: 10
    },
    {
        id: 102,
        url: "https://en.wikipedia.org/wiki/Quantum_mechanics",
        title: "Quantum Mechanics",
        date: "2023-10-26",
        questions_count: 8
    },
    {
        id: 103,
        url: "https://en.wikipedia.org/wiki/Renaissance",
        title: "Renaissance",
        date: "2023-10-27",
        questions_count: 5
    }
];
