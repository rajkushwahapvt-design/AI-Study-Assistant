
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

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Could not load subjects.json"
            );

        }

        return response.json();

    })

    .then(function (data) {

        subjectData = data;

        console.log(
            "Subject data loaded successfully"
        );

        updateProgress();

    })

    .catch(function (error) {

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

subjectCards.forEach(function (card) {

    card.addEventListener(
        "click",
        function () {

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
        function (topic, index) {

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

                                ${isCompleted
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
    ).forEach(function (subject) {

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
        function (option) {

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
    function () {

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
            function (label) {

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
            function () {

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
    function () {

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
    function () {

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
let streak = Number(localStorage.getItem("streak")) || 0;
let lastStudyDate = localStorage.getItem("lastStudyDate") || "";
function updateStreak() {

    const today = new Date().toDateString();

    if (!lastStudyDate) {
        streak = 1;
        lastStudyDate = today;
    }

    else if (lastStudyDate !== today) {

        const lastDate = new Date(lastStudyDate);
        const currentDate = new Date(today);

        const difference =
            Math.floor(
                (currentDate - lastDate) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {
            streak++;
        }

        else if (difference > 1) {
            streak = 1;
        }

        lastStudyDate = today;
    }

    localStorage.setItem(
        "streak",
        streak
    );

    localStorage.setItem(
        "lastStudyDate",
        lastStudyDate
    );

    const streakElement =
        document.getElementById("streak-count");

    if (streakElement) {
        streakElement.textContent = streak;
    }
}
// ================================
// GEMINI AI STUDY TUTOR
// ================================

async function askStudyTutor() {
    const apiKey = getGeminiApiKey();
    const subject = document
        .getElementById("tutor-subject")
        .value;

    const question = document
        .getElementById("tutor-question")
        .value.trim();

    const status = document.getElementById("tutor-status");
    const answerBox = document.getElementById("tutor-answer");
    const askButton = document.getElementById("ask-tutor-btn");

    if (!apiKey) {
        status.textContent = "Please enter your Gemini API key.";
        return;
    }

    if (!question) {
        status.textContent = "Please enter a question first.";
        return;
    }

    const prompt = `
You are a friendly and expert college-level study tutor.

The student's subject is: ${subject}

Student's question:
${question}

Explain the concept in simple language.

Follow this structure:
1. Basic explanation
2. Important concepts
3. Step-by-step explanation
4. A practical example
5. Important points for exams

Use clear headings and avoid unnecessary complexity.
If the question involves programming, include a simple example.
`;

    try {
        askButton.disabled = true;
        status.textContent = "AI Tutor is thinking...";
        answerBox.textContent = "Generating your explanation...";

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    model: "gemini-3.5-flash-lite",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Gemini API request failed."
            );
        }

        const modelOutput = data.steps?.find(
            step => step.type === "model_output"
        );

        const generatedText = modelOutput?.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        if (!generatedText) {
            throw new Error("No text response received from Gemini.");
        }

       answerBox.textContent = cleanAIResponse(generatedText);
        status.textContent = "Explanation generated successfully!";

    } catch (error) {
        console.error("Gemini API Error:", error);

        status.textContent = "Something went wrong.";
        answerBox.textContent = error.message;

    } finally {
        askButton.disabled = false;
    }
}
// ================================
// AI NOTES GENERATOR
// ================================

async function generateAINotes() {

    const apiKey = getGeminiApiKey();
    const subject = document.getElementById("notes-subject").value;
    const topic = document.getElementById("notes-topic").value.trim();

    const status = document.getElementById("notes-status");
    const output = document.getElementById("notes-output");
    const button = document.getElementById("generate-notes-btn");

    if (!apiKey) {
        status.textContent = "Enter your Gemini API key in AI Tutor section.";
        return;
    }

    if (!topic) {
        status.textContent = "Please enter a topic.";
        return;
    }

    const prompt = `
You are an expert college study notes generator.

Subject: ${subject}
Topic: ${topic}

Generate clear, accurate, exam-oriented notes in simple language.

Include:
1. Introduction
2. Important concepts
3. Detailed explanation
4. Examples
5. Important exam points
6. Five possible exam questions

Use headings, bullet points and simple explanations.
`;

    try {
        button.disabled = true;
        status.textContent = "Generating notes...";
        output.textContent = "Please wait...";

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    model: "gemini-3.5-flash-lite",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API request failed.");
        }

        const modelOutput = data.steps?.find(
            step => step.type === "model_output"
        );

        const generatedText = modelOutput?.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        if (!generatedText) {
            throw new Error("No notes generated.");
        }

        output.textContent = cleanAIResponse(generatedText);
        status.textContent = "Notes generated successfully!";

    } catch (error) {
        console.error(error);
        status.textContent = "Something went wrong.";
        output.textContent = error.message;

    } finally {
        button.disabled = false;
    }
}
// ================================
// AI QUIZ GENERATOR
// ================================

let aiQuizQuestions = [];
let aiQuizIndex = 0;
let aiQuizScore = 0;
let aiQuizAnswered = false;

async function generateAIQuiz() {

    const apiKey = getGeminiApiKey();
    const subject = document.getElementById("ai-quiz-subject").value;
    const topic = document.getElementById("ai-quiz-topic").value.trim();

    const status = document.getElementById("ai-quiz-status");
    const container = document.getElementById("ai-quiz-container");
    const button = document.getElementById("generate-ai-quiz");

    if (!apiKey || !topic) {
        status.textContent = !apiKey
            ? "Enter your API key in AI Tutor section."
            : "Please enter a topic.";
        return;
    }

    const prompt = `
Generate exactly 5 multiple-choice questions for a college student.

Subject: ${subject}
Topic: ${topic}

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0,
      "explanation": "Explanation of the correct answer"
    }
  ]
}

Rules:
- answer must be the zero-based index of the correct option.
- Exactly 4 options per question.
- Questions must be accurate and topic-related.
- Do not include Markdown or any text outside JSON.
`;

    try {
        button.disabled = true;
        status.textContent = "Generating your quiz...";
        container.replaceChildren();

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    model: "gemini-3.5-flash-lite",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API request failed.");
        }

        const modelOutput = data.steps?.find(
            step => step.type === "model_output"
        );

        let result = modelOutput?.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        if (!result) {
            throw new Error("No quiz received.");
        }

        // Remove Markdown code fences if Gemini adds them
        result = result.replace(/```json|```/gi, "").trim();

        const parsed = JSON.parse(result);

        if (
            !Array.isArray(parsed.questions) ||
            parsed.questions.length !== 5 ||
            parsed.questions.some(q =>
                typeof q.question !== "string" ||
                !Array.isArray(q.options) ||
                q.options.length !== 4 ||
                !Number.isInteger(q.answer) ||
                q.answer < 0 ||
                q.answer > 3 ||
                typeof q.explanation !== "string"
            )
        ) {
            throw new Error("AI returned an invalid quiz format. Try again.");
        }

        aiQuizQuestions = parsed.questions;
        aiQuizIndex = 0;
        aiQuizScore = 0;
        aiQuizAnswered = false;

        status.textContent = "Your quiz is ready!";
        showAIQuizQuestion();

    } catch (error) {
        console.error("AI Quiz Error:", error);
        status.textContent = "Something went wrong.";
        container.textContent = error.message;

    } finally {
        button.disabled = false;
    }
}


// Display one question

function showAIQuizQuestion() {

    const container = document.getElementById("ai-quiz-container");
    container.replaceChildren();

    const q = aiQuizQuestions[aiQuizIndex];

    const heading = document.createElement("h3");
    heading.textContent =
        `Question ${aiQuizIndex + 1} of ${aiQuizQuestions.length}`;

    const question = document.createElement("p");
    question.textContent = q.question;

    container.append(heading, question);

    q.options.forEach((option, index) => {

        const label = document.createElement("label");
        label.style.display = "block";
        label.style.margin = "12px 0";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "ai-quiz-option";
        radio.value = index;

        label.append(radio, document.createTextNode(" " + option));
        container.appendChild(label);
    });

    const feedback = document.createElement("p");
    feedback.id = "ai-quiz-feedback";
    container.appendChild(feedback);

    const submit = document.createElement("button");
    submit.textContent = "Submit Answer";
    submit.onclick = checkAIQuizAnswer;
    container.appendChild(submit);
}


// Check selected answer

function checkAIQuizAnswer() {

    if (aiQuizAnswered) return;

    const selected = document.querySelector(
        'input[name="ai-quiz-option"]:checked'
    );

    const feedback = document.getElementById("ai-quiz-feedback");

    if (!selected) {
        feedback.textContent = "Please select an option.";
        return;
    }

    aiQuizAnswered = true;

    const q = aiQuizQuestions[aiQuizIndex];
    const selectedAnswer = Number(selected.value);

    if (selectedAnswer === q.answer) {
        aiQuizScore++;
        feedback.textContent = "Correct! " + q.explanation;
    } else {
        feedback.textContent =
            "Incorrect. Correct answer: " +
            q.options[q.answer] + ". " + q.explanation;
    }

    document.querySelectorAll(
        'input[name="ai-quiz-option"]'
    ).forEach(radio => {
        radio.disabled = true;
    });

    const button = document.querySelector(
        "#ai-quiz-container button"
    );

    button.textContent =
        aiQuizIndex === aiQuizQuestions.length - 1
            ? "View Result"
            : "Next Question";

    button.onclick = nextAIQuizQuestion;
}


// Move to next question

function nextAIQuizQuestion() {

    aiQuizIndex++;
    aiQuizAnswered = false;

    if (aiQuizIndex < aiQuizQuestions.length) {
        showAIQuizQuestion();
    } else {
        showAIQuizResult();
    }
}


// Show final score

function showAIQuizResult() {

    const container = document.getElementById("ai-quiz-container");

    container.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Quiz Completed! 🎉";

    const score = document.createElement("h3");
    score.textContent =
        `Your Score: ${aiQuizScore} / ${aiQuizQuestions.length}`;

    const message = document.createElement("p");
    message.textContent =
        aiQuizScore >= 4
            ? "Excellent work!"
            : "Keep practising. You can improve!";

    const retry = document.createElement("button");
    retry.textContent = "Generate Another Quiz";
    retry.onclick = generateAIQuiz;

    container.append(heading, score, message, retry);
}

// ================================
// AI FLASHCARDS GENERATOR
// ================================

let flashcards = [];
let currentFlashcard = 0;
let flashcardRevealed = false;

async function generateFlashcards() {

   const apiKey = getGeminiApiKey();
    const subject = document.getElementById("flashcard-subject").value;
    const topic = document.getElementById("flashcard-topic").value.trim();

    const status = document.getElementById("flashcard-status");
    const container = document.getElementById("flashcard-container");
    const button = document.getElementById("flashcard-btn");

    if (!apiKey) {
        status.textContent = "Enter API key in AI Tutor section.";
        return;
    }

    if (!topic) {
        status.textContent = "Please enter a topic.";
        return;
    }

    const prompt = `
Create exactly 10 educational flashcards.

Subject: ${subject}
Topic: ${topic}

Return ONLY valid JSON in this format:
{
  "flashcards": [
    {
      "question": "What is hashing?",
      "answer": "Hashing is a technique..."
    }
  ]
}

Rules:
- Exactly 10 flashcards.
- Questions should test important concepts.
- Answers should be short, clear and accurate.
- No Markdown outside JSON.
`;

    try {
        button.disabled = true;
        status.textContent = "Creating flashcards...";
        container.replaceChildren();

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    model: "gemini-3.5-flash-lite",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API request failed.");
        }

        const modelOutput = data.steps?.find(
            step => step.type === "model_output"
        );

        let result = modelOutput?.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        if (!result) {
            throw new Error("No flashcards received.");
        }

        result = result.replace(/```json|```/gi, "").trim();

        const parsed = JSON.parse(result);

        if (
            !Array.isArray(parsed.flashcards) ||
            parsed.flashcards.length !== 10 ||
            parsed.flashcards.some(card =>
                typeof card.question !== "string" ||
                typeof card.answer !== "string" ||
                !card.question.trim() ||
                !card.answer.trim()
            )
        ) {
            throw new Error("Invalid flashcard format. Please try again.");
        }

        flashcards = parsed.flashcards;
        currentFlashcard = 0;
        flashcardRevealed = false;

        status.textContent = "Flashcards generated successfully!";
        showFlashcard();

    } catch (error) {
        console.error("Flashcard Error:", error);
        status.textContent = "Something went wrong.";
        container.textContent = error.message;

    } finally {
        button.disabled = false;
    }
}


// Display current flashcard

function showFlashcard() {

    const container = document.getElementById("flashcard-container");
    container.replaceChildren();

    const card = flashcards[currentFlashcard];

    const counter = document.createElement("p");
    counter.textContent =
        `Card ${currentFlashcard + 1} of ${flashcards.length}`;

    const flashcard = document.createElement("div");
    flashcard.className = "flashcard";

    const label = document.createElement("h3");
    label.textContent = flashcardRevealed ? "Answer" : "Question";

    const content = document.createElement("p");
    content.textContent = flashcardRevealed
        ? card.answer
        : card.question;

    flashcard.append(label, content);

    flashcard.onclick = toggleFlashcard;

    const revealButton = document.createElement("button");
    revealButton.textContent = flashcardRevealed
        ? "Show Question"
        : "Reveal Answer";

    revealButton.onclick = toggleFlashcard;

    const nextButton = document.createElement("button");
    nextButton.textContent =
        currentFlashcard === flashcards.length - 1
            ? "Restart Cards"
            : "Next Card";

    nextButton.onclick = nextFlashcard;

    container.append(
        counter,
        flashcard,
        revealButton,
        nextButton
    );
}


// Reveal answer or show question

function toggleFlashcard() {
    flashcardRevealed = !flashcardRevealed;
    showFlashcard();
}


// Move to next flashcard

function nextFlashcard() {

    currentFlashcard++;

    if (currentFlashcard >= flashcards.length) {
        currentFlashcard = 0;
    }

    flashcardRevealed = false;
    showFlashcard();
}
// =================================
// AI STUDY PLANNER
// =================================

async function generateStudyPlan() {

    const apiKey = getGeminiApiKey();

    const subject = document
        .getElementById("planner-subject").value;

    const syllabus = document
        .getElementById("planner-syllabus").value.trim();

    const examDate = document
        .getElementById("planner-exam-date").value;

    const hours = Number(
        document.getElementById("planner-hours").value
    );

    const status = document.getElementById("planner-status");
    const output = document.getElementById("planner-output");
    const button = document.getElementById("generate-planner-btn");

    if (!apiKey) {
        status.textContent = "Enter your API key in AI Tutor section.";
        return;
    }

    if (!syllabus || !examDate || !hours) {
        status.textContent = "Please fill all the fields.";
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(examDate + "T00:00:00");

    if (selectedDate <= today) {
        status.textContent = "Please select a future exam date.";
        return;
    }

    if (hours < 1 || hours > 16) {
        status.textContent = "Enter study hours between 1 and 16.";
        return;
    }

    const prompt = `
You are an expert academic study planner.

Create a realistic personalized study timetable.

Subject: ${subject}
Syllabus: ${syllabus}
Exam Date: ${examDate}
Daily Available Study Hours: ${hours}

Instructions:
1. Divide the syllabus into daily study tasks.
2. Prioritize difficult and important topics.
3. Include revision sessions.
4. Include practice questions and mock tests.
5. Include short breaks.
6. Keep the daily study time within ${hours} hours.
7. Make sure all syllabus topics are covered before the exam.
8. Include a final revision plan.

Use this output structure:

STUDY PLAN OVERVIEW

DAILY TIMETABLE
For each date:
- Topics to study
- Suggested time allocation
- Practice tasks
- Revision tasks

IMPORTANT TIPS
- Give practical exam preparation tips.

Keep the plan clear, realistic and easy to follow.
Do not schedule dates after the exam date.
`;

    try {
        button.disabled = true;
        status.textContent = "Creating your personalized study plan...";
        output.textContent = "Please wait while AI prepares your timetable.";

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    model: "gemini-3.5-flash-lite",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "API request failed."
            );
        }

        const modelOutput = data.steps?.find(
            step => step.type === "model_output"
        );

        const generatedPlan = modelOutput?.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        if (!generatedPlan) {
            throw new Error("No study plan received.");
        }

        output.textContent = cleanAIResponse(generatedPlan);
        status.textContent = "Your study plan is ready!";

    } catch (error) {
        console.error("Study Planner Error:", error);

        status.textContent = "Something went wrong.";
        output.textContent = error.message;

    } finally {
        button.disabled = false;
    }
}

async function summarizeNotes() {

    const apiKey = getGeminiApiKey();

    const subject = document.getElementById("summary-subject").value;

    const material = document.getElementById("summary-input").value.trim();

    const status = document.getElementById("summary-status");
    const output = document.getElementById("summary-output");
    const button = document.getElementById("summarize-btn");

    if (!apiKey) {
        status.textContent = "Enter your Gemini API key in AI Tutor section.";
        return;
    }

    if (!material) {
        status.textContent = "Please paste your study material first.";
        return;
    }

    const prompt = `
    You are an expert academic study assistant.

    Subject: ${subject}

    Study Material:
    ${material}

    Generate a clear and student-friendly summary.

    Include:
    1. Short Summary
    2. Important Concepts
    3. Key Points
    4. Important Definitions
    5. Quick Revision Notes
    6. Five Important Exam Questions

    Use simple language.
    Keep the explanation accurate and well structured.
    Do not add information unrelated to the provided material.
    `;

    try {

        button.disabled = true;
        status.textContent = "AI is summarizing your notes...";
        output.textContent = "Please wait...";

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    model: "gemini-3.5-flash-lite",
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "API request failed.");
        }

        const modelOutput = data.steps?.find(
            step => step.type === "model_output"
        );

        const summary = modelOutput?.content
            ?.filter(item => item.type === "text")
            .map(item => item.text)
            .join("\n");

        if (!summary) {
            throw new Error("No summary received from AI.");
        }

        output.textContent = cleanAIResponse(summary);
        status.textContent = "Your summary is ready!";

    } catch (error) {

        console.error("Summarizer Error:", error);

        status.textContent = "Something went wrong.";
        output.textContent = error.message;

    } finally {
        button.disabled = false;
    }
}
function getGeminiApiKey() {
    return window.GEMINI_API_KEY || "";
}
function cleanAIResponse(text) {

    return text
        .replace(/^#{1,6}\s*/gm, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/_(.*?)_/g, "$1")
        .replace(/```[\w]*\n?/g, "")
        .replace(/```/g, "")
        .replace(/^>\s*/gm, "")
        .trim();

}
