/* =========================
   GLOBAL DATA
========================= */

let subjectData = {};

let completedTopics =
    JSON.parse(
        localStorage.getItem(
            "completedTopics"
        )
    ) || [];

let quizScore =
    Number(
        localStorage.getItem(
            "quizScore"
        )
    ) || 0;


/* =========================
   ELEMENTS
========================= */

const subjectCards =
    document.querySelectorAll(
        ".subject-card"
    );

const subjectContent =
    document.getElementById(
        "subject-content"
    );

const themeBtn =
    document.getElementById(
        "theme-btn"
    );


/* =========================
   LOAD JSON
========================= */

fetch("subjects.json")

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Could not load subjects.json"
            );

        }

        return response.json();

    })

    .then(function(data) {

        subjectData = data;

        console.log(
            "Subject data loaded successfully"
        );

        updateProgress();

    })

    .catch(function(error) {

        console.error(error);

        subjectContent.innerHTML = `
            <div class="empty-state">
                <h3>
                    ⚠️ Could not load subjects
                </h3>

                <p>
                    Make sure you are using
                    Live Server.
                </p>
            </div>
        `;

    });


/* =========================
   SUBJECT CARDS
========================= */

subjectCards.forEach(function(card) {

    card.addEventListener(
        "click",
        function() {

            const subject =
                card.dataset.subject;

            showSubject(subject);

        }
    );

});


/* =========================
   SHOW SUBJECT
========================= */

function showSubject(subject) {

    const data =
        subjectData[subject];


    if (!data) {

        return;

    }


    subjectContent.innerHTML = `

        <h2>
            ${subject}
        </h2>

        <p>
            ${data.description}
        </p>

        <h3>
            📚 Topics
        </h3>

        <div class="topic-list">

            ${data.topics.map(
                function(topic, index) {

                    const topicId =
                        `${subject}-${topic.name}`;

                    const isCompleted =
                        completedTopics.includes(
                            topicId
                        );


                    return `

                        <div
                            class="topic-card"
                            onclick="openTopic(
                                '${subject}',
                                ${index}
                            )"
                        >

                            <h4>
                                ${topic.name}
                            </h4>

                            <p>

                                ${
                                    isCompleted
                                    ? "✓ Completed"
                                    : "Learn →"
                                }

                            </p>

                        </div>

                    `;

                }
            ).join("")}

        </div>

    `;


    subjectContent.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================
   OPEN TOPIC
========================= */

function openTopic(subject, index) {

    const topic = subjectData[subject].topics[index];

    const topicId = `${subject}-${topic.name}`;

    const isCompleted = completedTopics.includes(topicId);

    subjectContent.innerHTML = `
        <div class="topic-detail">

            <button onclick="showSubject('${subject}')">
                ← Back to ${subject}
            </button>

            <h2>📚 ${topic.name}</h2>

            <span class="difficulty">
                ${topic.difficulty}
            </span>

            <h3>📖 What is ${topic.name}?</h3>

            <p>${topic.description}</p>

            <h3>💡 Key Concepts</h3>

            <div class="key-points">
                ${topic.keyPoints.map(point => `
                    <div class="key-point">
                        ✓ ${point}
                    </div>
                `).join("")}
            </div>

            <h3>💻 Example</h3>

            <div class="topic-example">
                <code>${topic.example}</code>
            </div>

            <h3>⏱ Complexity</h3>

            <p>${topic.complexity}</p>

            <h3>🧠 Quick Check</h3>

            <div class="practice-box">

                <p class="practice-question">
                    ${topic.practice.question}
                </p>

                <div class="practice-options">

                    ${topic.practice.options.map(option => `
                        <label>
                            <input
                                type="radio"
                                name="practice-answer"
                                value="${option}"
                            >
                            ${option}
                        </label>
                    `).join("")}

                </div>

                <button
                    class="check-answer-btn"
                    onclick="checkPracticeAnswer('${subject}', ${index})"
                >
                    Check Answer
                </button>

                <p
                    id="practice-result"
                    class="practice-result"
                ></p>

            </div>

            <button
                id="complete-btn"
                onclick="completeTopic('${subject}', ${index})"
                ${isCompleted ? "disabled" : ""}
            >
                ${isCompleted ? "✓ Completed" : "✓ Mark as Completed"}
            </button>

        </div>
    `;

    subjectContent.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}
function checkPracticeAnswer(subject, index) {

    const topic = subjectData[subject].topics[index];

    const selected = document.querySelector(
        'input[name="practice-answer"]:checked'
    );

    const result = document.getElementById("practice-result");

    if (!selected) {
        result.textContent = "⚠️ Please select an answer.";
        result.className = "practice-result wrong";
        return;
    }

    if (selected.value === topic.practice.answer) {

        result.textContent = "✅ Correct! Great job!";
        result.className = "practice-result correct";

    } else {

        result.textContent = "❌ Wrong answer. Try again.";
        result.className = "practice-result wrong";
    }
}


/* =========================
   COMPLETE TOPIC
========================= */

function completeTopic(
    subject,
    index
) {

    const topic =
        subjectData[
            subject
        ].topics[index];


    const topicId =
        `${subject}-${topic.name}`;


    if (
        !completedTopics.includes(
            topicId
        )
    ) {

        completedTopics.push(
            topicId
        );

    }


    localStorage.setItem(
        "completedTopics",
        JSON.stringify(
            completedTopics
        )
    );


    const button =
        document.getElementById(
            "complete-btn"
        );


    button.textContent =
        "✓ Completed";

    button.disabled =
        true;


    updateProgress();

}


/* =========================
   CALCULATE PROGRESS
========================= */

function getTotalTopics() {

    let total = 0;


    Object.values(
        subjectData
    ).forEach(function(subject) {

        total +=
            subject.topics.length;

    });


    return total;

}


/* =========================
   UPDATE PROGRESS
========================= */

function updateProgress() {

    if (
        Object.keys(subjectData).length === 0
    ) {

        return;

    }


    const total =
        getTotalTopics();


    const completed =
        completedTopics.length;


    const remaining =
        total - completed;


    const percentage =
        total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
        );


    /* Progress */

    document.getElementById(
        "progress-percent"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "progress-fill"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "progress-text"
    ).textContent =
        `${completed} / ${total} Topics Completed`;


    /* Stats */

    document.getElementById(
        "completed-count"
    ).textContent =
        completed;


    document.getElementById(
        "remaining-count"
    ).textContent =
        remaining;


    document.getElementById(
        "progress-score"
    ).textContent =
        `${quizScore}%`;


    /* Dashboard */

    document.getElementById(
        "dashboard-completed"
    ).textContent =
        completed;


    document.getElementById(
        "dashboard-progress"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "dashboard-score"
    ).textContent =
        `${quizScore}%`;


    updateRecommendation(
        percentage
    );

}


/* =========================
   AI RECOMMENDATION
========================= */

function updateRecommendation(
    percentage
) {

    const title =
        document.getElementById(
            "recommendation-title"
        );

    const text =
        document.getElementById(
            "recommendation-text"
        );


    if (percentage === 0) {

        title.textContent =
            "Start with Arrays 🚀";

        text.textContent =
            "Begin your journey by learning the fundamentals of DSA.";

    }

    else if (percentage < 30) {

        title.textContent =
            "Keep building your foundation 📚";

        text.textContent =
            "Complete a few more topics to build a strong foundation.";

    }

    else if (percentage < 70) {

        title.textContent =
            "You're making good progress 🔥";

        text.textContent =
            "Keep practicing and complete the remaining topics.";

    }

    else {

        title.textContent =
            "Excellent progress! 🚀";

        text.textContent =
            "You are doing great. Start revising advanced concepts.";

    }

}


/* =========================
   QUIZ
========================= */

const questions = [

    {
        question:
            "What is an array?",

        options: [
            "Data Structure",
            "Linear Data Structure",
            "Non-Linear Data Structure",
            "None"
        ],

        answer:
            "Linear Data Structure"
    },


    {
        question:
            "Which language is commonly used in AI?",

        options: [
            "Python",
            "HTML",
            "CSS",
            "SQL"
        ],

        answer:
            "Python"
    },


    {
        question:
            "Which data structure follows LIFO?",

        options: [
            "Queue",
            "Stack",
            "Array",
            "Graph"
        ],

        answer:
            "Stack"
    },


    {
        question:
            "Which data structure follows FIFO?",

        options: [
            "Stack",
            "Tree",
            "Queue",
            "Graph"
        ],

        answer:
            "Queue"
    },


    {
        question:
            "Which search algorithm requires a sorted array?",

        options: [
            "Linear Search",
            "Binary Search",
            "DFS",
            "BFS"
        ],

        answer:
            "Binary Search"
    },


    {
        question:
            "Which language is mainly used for web page structure?",

        options: [
            "Python",
            "HTML",
            "SQL",
            "C++"
        ],

        answer:
            "HTML"
    },


    {
        question:
            "Which SQL command is used to retrieve data?",

        options: [
            "INSERT",
            "DELETE",
            "SELECT",
            "UPDATE"
        ],

        answer:
            "SELECT"
    },


    {
        question:
            "How many layers are in the OSI model?",

        options: [
            "5",
            "6",
            "7",
            "8"
        ],

        answer:
            "7"
    },


    {
        question:
            "Which OS component manages processes?",

        options: [
            "Operating System",
            "Browser",
            "Compiler",
            "Database"
        ],

        answer:
            "Operating System"
    },


    {
        question:
            "What does CPU stand for?",

        options: [
            "Central Processing Unit",
            "Computer Processing Utility",
            "Central Program Unit",
            "Control Processing Unit"
        ],

        answer:
            "Central Processing Unit"
    }

];


let currentQuestion = 0;

let currentScore = 0;


const questionNumber =
    document.getElementById(
        "question-number"
    );

const questionText =
    document.getElementById(
        "question-text"
    );

const options =
    document.getElementById(
        "options"
    );

const nextBtn =
    document.getElementById(
        "next-btn"
    );

const scoreText =
    document.getElementById(
        "score"
    );


/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    const question =
        questions[
            currentQuestion
        ];


    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;


    questionText.textContent =
        question.question;


    options.innerHTML = "";


    question.options.forEach(
        function(option) {

            const label =
                document.createElement(
                    "label"
                );


            label.innerHTML = `

                <input
                    type="radio"
                    name="answer"
                    value="${option}"
                >

                ${option}

            `;


            options.appendChild(
                label
            );

        }
    );

}


showQuestion();


/* =========================
   NEXT QUESTION
========================= */

nextBtn.addEventListener(
    "click",
    function() {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );


        if (!selected) {

            alert(
                "Please select an answer!"
            );

            return;

        }


        const correct =
            questions[
                currentQuestion
            ].answer;


        const labels =
            document.querySelectorAll(
                "#options label"
            );


        labels.forEach(
            function(label) {

                const input =
                    label.querySelector(
                        "input"
                    );


                input.disabled =
                    true;


                if (
                    input.value ===
                    correct
                ) {

                    label.style.background =
                        "#166534";

                    label.style.borderColor =
                        "#22c55e";

                    label.style.color =
                        "white";

                }


                if (
                    input.checked &&
                    input.value !== correct
                ) {

                    label.style.background =
                        "#991b1b";

                    label.style.borderColor =
                        "#ef4444";

                    label.style.color =
                        "white";

                }

            }
        );


        if (
            selected.value === correct
        ) {

            currentScore++;

        }


        scoreText.textContent =
            `Score: ${currentScore}`;


        nextBtn.textContent =
            "Next →";


        setTimeout(
            function() {

                currentQuestion++;


                if (
                    currentQuestion <
                    questions.length
                ) {

                    showQuestion();

                    nextBtn.textContent =
                        "Next Question →";

                }

                else {

                    finishQuiz();

                }

            },
            800
        );

    }
);


/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {

    const percentage =
        Math.round(
            (
                currentScore /
                questions.length
            ) * 100
        );


    localStorage.setItem(
        "quizScore",
        percentage
    );


    quizScore =
        percentage;


    questionNumber.textContent =
        "🎉 Quiz Completed!";


    questionText.textContent =
        `Your final score is ${currentScore}/${questions.length}`;


    options.innerHTML = "";


    nextBtn.style.display =
        "none";


    updateProgress();

}


/* =========================
   THEME
========================= */

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "light-mode"
        );


        if (
            document.body.classList.contains(
                "light-mode"
            )
        ) {

            themeBtn.textContent =
                "🌙 Dark";

        }

        else {

            themeBtn.textContent =
                "☀️ Light";

        }

    }
);


/* =========================
   RESET PROGRESS
========================= */

document.getElementById(
    "reset-progress"
).addEventListener(
    "click",
    function() {

        const confirmReset =
            confirm(
                "Are you sure you want to reset your progress?"
            );


        if (!confirmReset) {

            return;

        }


        completedTopics = [];

        quizScore = 0;


        localStorage.removeItem(
            "completedTopics"
        );

        localStorage.removeItem(
            "quizScore"
        );


        updateProgress();


        alert(
            "Progress has been reset!"
        );

    }
);