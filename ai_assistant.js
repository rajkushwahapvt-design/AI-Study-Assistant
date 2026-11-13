/* =========================
   GLOBAL DATA
========================= */

let subjectData = {};

let completedTopics =
    JSON.parse(localStorage.getItem("completedTopics")) || [];

let quizScore =
    Number(localStorage.getItem("quizScore")) || 0;


/* =========================
   ELEMENTS
========================= */

const subjectCards = document.querySelectorAll(".subject-card");
const subjectContent = document.getElementById("subject-content");
const themeBtn = document.getElementById("theme-btn");


/* =========================
   LOAD JSON
========================= */

fetch("subjects.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Could not load subjects.json");
        }

        return response.json();
    })
    .then(function (data) {
        subjectData = data;

        console.log("Subject data loaded successfully");

        updateProgress();
    })
    .catch(function (error) {
        console.error(error);

        subjectContent.innerHTML = `
            <div class="empty-state">
                <h3>⚠️ Could not load subjects</h3>
                <p>Make sure you are using Live Server.</p>
            </div>
        `;
    });


/* =========================
   SUBJECT CARDS
========================= */

subjectCards.forEach(function (card) {
    card.addEventListener("click", function () {
        const subject = card.dataset.subject;
        showSubject(subject);
    });
});


/* =========================
   SHOW SUBJECT
========================= */

function showSubject(subject) {

    const data = subjectData[subject];

    if (!data) {
        return;
    }

    subjectContent.innerHTML = `

        <h2>${subject}</h2>

        <p>${data.description}</p>

        <h3>📚 Topics</h3>

        <div class="topic-list">

            ${data.topics.map(function (topic, index) {

                const topicId = `${subject}-${topic.name}`;

                const isCompleted =
                    completedTopics.includes(topicId);

                return `

                    <div
                        class="topic-card"
                        onclick="openTopic('${subject}', ${index})"
                    >

                        <h4>${topic.name}</h4>

                        <p>
                            ${isCompleted ? "✓ Completed" : "Learn →"}
                        </p>

                    </div>

                `;

            }).join("")}

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


/* =========================
   CHECK PRACTICE ANSWER
========================= */

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

function completeTopic(subject, index) {

    const topic = subjectData[subject].topics[index];

    const topicId = `${subject}-${topic.name}`;

    if (!completedTopics.includes(topicId)) {
        completedTopics.push(topicId);
    }

    localStorage.setItem(
        "completedTopics",
        JSON.stringify(completedTopics)
    );

    const button = document.getElementById("complete-btn");

    button.textContent = "✓ Completed";
    button.disabled = true;

    updateProgress();
}


/* =========================
   CALCULATE PROGRESS
========================= */

function getTotalTopics() {

    let total = 0;

    Object.values(subjectData).forEach(function (subject) {
        total += subject.topics.length;
    });

    return total;
}


/* =========================
   UPDATE PROGRESS
========================= */

function updateProgress() {

    if (Object.keys(subjectData).length === 0) {
        return;
    }

    const total = getTotalTopics();

    const completed = completedTopics.length;

    const remaining = total - completed;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);


    /* Progress */

    document.getElementById("progress-percent").textContent =
        `${percentage}%`;

    document.getElementById("progress-fill").style.width =
        `${percentage}%`;

    document.getElementById("progress-text").textContent =
        `${completed} / ${total} Topics Completed`;


    /* Stats */

    document.getElementById("completed-count").textContent =
        completed;

    document.getElementById("remaining-count").textContent =
        remaining;

    document.getElementById("progress-score").textContent =
        `${quizScore}%`;


    /* Dashboard */

    document.getElementById("dashboard-completed").textContent =
        completed;

    document.getElementById("dashboard-progress").textContent =
        `${percentage}%`;

    document.getElementById("dashboard-score").textContent =
        `${quizScore}%`;

    updateRecommendation(percentage);
}


/* =========================
   AI RECOMMENDATION
========================= */

function updateRecommendation(percentage) {

    const title = document.getElementById("recommendation-title");

    const text = document.getElementById("recommendation-text");

    if (percentage === 0) {

        title.textContent = "Start with Arrays 🚀";

        text.textContent =
            "Begin your journey by learning the fundamentals of DSA.";

    } else if (percentage < 30) {

        title.textContent = "Keep building your foundation 📚";

        text.textContent =
            "Complete a few more topics to build a strong foundation.";

    } else if (percentage < 70) {

        title.textContent = "You're making good progress 🔥";

        text.textContent =
            "Keep practicing and complete the remaining topics.";

    } else {

        title.textContent = "Excellent progress! 🚀";

        text.textContent =
            "You are doing great. Start revising advanced concepts.";
    }
}
/* =========================
   NORMAL QUIZ
========================= */

const questions = [

    {
        question: "What is an array?",
        options: [
            "Data Structure",
            "Linear Data Structure",
            "Non-Linear Data Structure",
            "None"
        ],
        answer: "Linear Data Structure"
    },

    {
        question: "Which language is commonly used in AI?",
        options: ["Python", "HTML", "CSS", "SQL"],
        answer: "Python"
    },

    {
        question: "Which data structure follows LIFO?",
        options: ["Queue", "Stack", "Array", "Graph"],
        answer: "Stack"
    },

    {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Tree", "Queue", "Graph"],
        answer: "Queue"
    },

    {
        question: "Which search algorithm requires a sorted array?",
        options: ["Linear Search", "Binary Search", "DFS", "BFS"],
        answer: "Binary Search"
    },

    {
        question: "Which language is mainly used for web page structure?",
        options: ["Python", "HTML", "SQL", "C++"],
        answer: "HTML"
    },

    {
        question: "Which SQL command is used to retrieve data?",
        options: ["INSERT", "DELETE", "SELECT", "UPDATE"],
        answer: "SELECT"
    },

    {
        question: "How many layers are in the OSI model?",
        options: ["5", "6", "7", "8"],
        answer: "7"
    },

    {
        question: "Which OS component manages processes?",
        options: [
            "Operating System",
            "Browser",
            "Compiler",
            "Database"
        ],
        answer: "Operating System"
    },

    {
        question: "What does CPU stand for?",
        options: [
            "Central Processing Unit",
            "Computer Processing Utility",
            "Central Program Unit",
            "Control Processing Unit"
        ],
        answer: "Central Processing Unit"
    }

];


let currentQuestion = 0;
let currentScore = 0;


const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question-text");
const options = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const scoreText = document.getElementById("score");


/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    const question = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    questionText.textContent = question.question;

    options.innerHTML = "";

    question.options.forEach(function (option) {

        const label = document.createElement("label");

        label.innerHTML = `
            <input
                type="radio"
                name="answer"
                value="${option}"
            >
            ${option}
        `;

        options.appendChild(label);

    });

    nextBtn.textContent = "Next Question →";
    nextBtn.style.display = "inline-block";
}


/* Start Quiz */

showQuestion();


/* =========================
   NEXT QUESTION
========================= */

nextBtn.addEventListener("click", function () {

    const selected = document.querySelector(
        'input[name="answer"]:checked'
    );

    if (!selected) {
        alert("Please select an answer!");
        return;
    }

    const correct = questions[currentQuestion].answer;

    const labels = document.querySelectorAll("#options label");

    labels.forEach(function (label) {

        const input = label.querySelector("input");

        input.disabled = true;

        if (input.value === correct) {

            label.style.background = "#166534";
            label.style.borderColor = "#22c55e";
            label.style.color = "white";

        }

        if (input.checked && input.value !== correct) {

            label.style.background = "#991b1b";
            label.style.borderColor = "#ef4444";
            label.style.color = "white";

        }

    });


    if (selected.value === correct) {
        currentScore++;
    }

    scoreText.textContent = `Score: ${currentScore}`;

    nextBtn.textContent = "Please wait...";

    nextBtn.disabled = true;

    setTimeout(function () {

        currentQuestion++;

        if (currentQuestion < questions.length) {

            showQuestion();

            nextBtn.disabled = false;

        } else {

            finishQuiz();

        }

    }, 800);

});


/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {

    const percentage = Math.round(
        (currentScore / questions.length) * 100
    );

    quizScore = percentage;

    localStorage.setItem("quizScore", quizScore);

    questionNumber.textContent = "🎉 Quiz Completed!";

    questionText.textContent =
        `Your final score is ${currentScore}/${questions.length}`;

    options.innerHTML = `
        <div class="quiz-result">

            <h2>${currentScore} / ${questions.length}</h2>

            <p>Your Score: ${percentage}%</p>

        </div>
    `;

    nextBtn.style.display = "none";

    updateProgress();

}


/* =========================
   THEME
========================= */

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {

        themeBtn.textContent = "🌙 Dark";

    } else {

        themeBtn.textContent = "☀️ Light";

    }

});


/* =========================
   RESET PROGRESS
========================= */

document.getElementById("reset-progress").addEventListener(
    "click",
    function () {

        const confirmReset = confirm(
            "Are you sure you want to reset your progress?"
        );

        if (!confirmReset) {
            return;
        }

        completedTopics = [];

        quizScore = 0;

        localStorage.removeItem("completedTopics");

        localStorage.removeItem("quizScore");

        updateProgress();

        alert("Progress has been reset!");

    }
);


/* =========================
   STUDY STREAK
========================= */

let streak =
    Number(localStorage.getItem("streak")) || 0;

let lastStudyDate =
    localStorage.getItem("lastStudyDate") || "";


function updateStreak() {

    const today = new Date().toDateString();

    if (!lastStudyDate) {

        streak = 1;

        lastStudyDate = today;

    } else if (lastStudyDate !== today) {

        const lastDate = new Date(lastStudyDate);

        const currentDate = new Date(today);

        const difference = Math.floor(
            (currentDate - lastDate) / (1000 * 60 * 60 * 24)
        );

        if (difference === 1) {

            streak++;

        } else if (difference > 1) {

            streak = 1;

        }

        lastStudyDate = today;

    }

    localStorage.setItem("streak", streak);

    localStorage.setItem("lastStudyDate", lastStudyDate);

    const streakElement = document.getElementById("streak-count");

    if (streakElement) {
        streakElement.textContent = streak;
    }

}


/* Update streak when page loads */

updateStreak();

/* =================================
   SHARED AI BACKEND CONNECTION
================================= */

const AI_BACKEND_URL =
    "https://ai-study-assistant-23tf.onrender.com";


async function generateWithAI(prompt) {

    const response = await fetch(
        `${AI_BACKEND_URL}/api/generate`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                prompt: prompt
            })
        }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {

        throw new Error(
            data.error ||
            data.message ||
            `AI backend request failed (HTTP ${response.status}).`
        );

    }

    const generatedText =
        data.text ??
        data.response ??
        data.generatedText ??
        data.answer ??
        data.result;

    if (
        typeof generatedText !== "string" ||
        !generatedText.trim()
    ) {

        throw new Error(
            data.message ||
            "Backend responded, but no generated text was found."
        );

    }

    return generatedText.trim();

}
// =================================
// AI RESPONSE RENDERER
// =================================

function renderAIResponse(text) {

    if (!text) return "";

    // Escape HTML for security
    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const lines = text.split(/\r?\n/);

    let html = "";
    let inList = false;

    for (let line of lines) {

        line = line.trim();

        if (!line) {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            continue;
        }

        let safeLine = escapeHTML(line);

        // Bold text
        safeLine = safeLine.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );

        // Inline code
        safeLine = safeLine.replace(
            /`(.*?)`/g,
            "<code>$1</code>"
        );

        // Headings
        if (/^#{1,3}\s/.test(line)) {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            const heading = safeLine.replace(/^#{1,3}\s/, "");

            html += `<h3>${heading}</h3>`;

        }

        // Bullet points
        else if (/^[-*]\s/.test(line)) {

            if (!inList) {
                html += "<ul>";
                inList = true;
            }

            html += `<li>${safeLine.replace(/^[-*]\s/, "")}</li>`;

        }

        // Normal paragraphs
        else {

            if (inList) {
                html += "</ul>";
                inList = false;
            }

            html += `<p>${safeLine}</p>`;

        }

    }

    if (inList) {
        html += "</ul>";
    }

    return html;
}


/* =================================
   AI STUDY TUTOR
================================= */

async function askStudyTutor() {

    const subject = document
        .getElementById("tutor-subject")
        .value;

    const question = document
        .getElementById("tutor-question")
        .value.trim();

    const status = document.getElementById("tutor-status");

    const answerBox = document.getElementById("tutor-answer");

    const askButton = document.getElementById("ask-tutor-btn");


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


        const generatedText = await generateWithAI(prompt);


        answerBox.innerHTML = renderAIResponse(generatedText);

        status.textContent = "Explanation generated successfully!";


    } catch (error) {

        console.error("Gemini API Error:", error);

        status.textContent = "Something went wrong.";

        answerBox.textContent = error.message;


    } finally {

        askButton.disabled = false;

    }

}


/* =================================
   AI NOTES GENERATOR
================================= */

async function generateAINotes() {

    const subject = document
        .getElementById("notes-subject")
        .value;

    const topic = document
        .getElementById("notes-topic")
        .value.trim();


    const status = document.getElementById("notes-status");

    const output = document.getElementById("notes-output");

    const button = document.getElementById("generate-notes-btn");


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


        const generatedText = await generateWithAI(prompt);


        output.innerHTML = renderAIResponse(generatedText);

        status.textContent = "Notes generated successfully!";


    } catch (error) {

        console.error(error);

        status.textContent = "Something went wrong.";

        output.textContent = error.message;


    } finally {

        button.disabled = false;

    }

}
/* =================================
   AI QUIZ GENERATOR
================================= */

let aiQuizQuestions = [];
let aiQuizIndex = 0;
let aiQuizScore = 0;
let aiQuizAnswered = false;


/* GENERATE AI QUIZ */

async function generateAIQuiz() {

    const subject = document
        .getElementById("ai-quiz-subject")
        .value;

    const topic = document
        .getElementById("ai-quiz-topic")
        .value.trim();

    const status = document.getElementById("ai-quiz-status");

    const container = document.getElementById("ai-quiz-container");

    const button = document.getElementById("generate-ai-quiz");


    if (!topic) {

        status.textContent = "Please enter a topic.";

        return;

    }


    const prompt = `

Generate exactly 5 multiple-choice questions for college students.

Subject: ${subject}
Topic: ${topic}

Return ONLY valid JSON. Do not include markdown or explanations outside JSON.

Use this exact format:

{
    "questions": [
        {
            "question": "Question text",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "answer": 0,
            "explanation": "Explanation of the correct answer"
        }
    ]
}

Rules:
- Generate exactly 5 questions.
- Every question must have exactly 4 options.
- The answer must be a zero-based index: 0, 1, 2, or 3.
- Provide a clear explanation.
- Questions must be relevant to the given subject and topic.

`;


    try {

        button.disabled = true;

        status.textContent = "Generating your AI quiz...";

        container.innerHTML = "Please wait...";


        const response = await generateWithAI(prompt);


        const cleanedResponse = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        const parsedData = JSON.parse(cleanedResponse);

        const questions = parsedData.questions;


        if (!Array.isArray(questions) || questions.length !== 5) {

            throw new Error("AI did not generate exactly 5 questions.");

        }


        for (const question of questions) {

            if (
                typeof question.question !== "string" ||
                !Array.isArray(question.options) ||
                question.options.length !== 4 ||
                !Number.isInteger(question.answer) ||
                question.answer < 0 ||
                question.answer > 3 ||
                typeof question.explanation !== "string"
            ) {

                throw new Error("AI generated an invalid question format.");

            }

        }


        aiQuizQuestions = questions;

        aiQuizIndex = 0;

        aiQuizScore = 0;

        aiQuizAnswered = false;


        status.textContent = "Your AI quiz is ready!";

        showAIQuizQuestion();


    } catch (error) {

        console.error("AI Quiz Error:", error);

        status.textContent = "Unable to generate quiz.";

        container.textContent = error.message;


    } finally {

        button.disabled = false;

    }

}


/* SHOW CURRENT QUESTION */

function showAIQuizQuestion() {

    const container = document.getElementById("ai-quiz-container");

    const question = aiQuizQuestions[aiQuizIndex];


    if (!question) return;


    aiQuizAnswered = false;


    container.innerHTML = `

        <div class="ai-quiz-question">

            <h3>
                Question ${aiQuizIndex + 1} / ${aiQuizQuestions.length}
            </h3>

            <h4>${question.question}</h4>

            <div class="ai-quiz-options">

                ${question.options.map((option, index) => `

                    <button
                        type="button"
                        class="ai-quiz-option"
                        onclick="checkAIQuizAnswer(${index})"
                    >
                        ${option}
                    </button>

                `).join("")}

            </div>

            <div id="ai-quiz-feedback"></div>

            <button
                type="button"
                id="next-ai-quiz-btn"
                onclick="nextAIQuizQuestion()"
                style="display:none;"
            >
                ${aiQuizIndex === aiQuizQuestions.length - 1
                    ? "See Result"
                    : "Next Question"}
            </button>

        </div>

    `;

}


/* CHECK ANSWER */

function checkAIQuizAnswer(selectedIndex) {

    if (aiQuizAnswered) return;


    const question = aiQuizQuestions[aiQuizIndex];

    const feedback = document.getElementById("ai-quiz-feedback");

    const options = document.querySelectorAll(".ai-quiz-option");

    const nextButton = document.getElementById("next-ai-quiz-btn");


    aiQuizAnswered = true;


    options.forEach((button, index) => {

        button.disabled = true;

        if (index === question.answer) {

            button.style.border = "2px solid green";

        }

        if (
            index === selectedIndex &&
            selectedIndex !== question.answer
        ) {

            button.style.border = "2px solid red";

        }

    });


    if (selectedIndex === question.answer) {

        aiQuizScore++;

        feedback.textContent = "Correct! " + question.explanation;

    } else {

        feedback.textContent =
            "Incorrect. Correct answer: " +
            question.options[question.answer] +
            ". " +
            question.explanation;

    }


    nextButton.style.display = "block";

}


/* NEXT QUESTION */

function nextAIQuizQuestion() {

    if (!aiQuizAnswered) return;


    aiQuizIndex++;


    if (aiQuizIndex < aiQuizQuestions.length) {

        showAIQuizQuestion();

    } else {

        showAIQuizResult();

    }

}


/* SHOW FINAL RESULT */

function showAIQuizResult() {

    const container = document.getElementById("ai-quiz-container");

    const percentage = Math.round(
        (aiQuizScore / aiQuizQuestions.length) * 100
    );


    container.innerHTML = `

        <div class="ai-quiz-result">

            <h2>Quiz Completed!</h2>

            <h3>
                Your Score: ${aiQuizScore} / ${aiQuizQuestions.length}
            </h3>

            <h3>
                Percentage: ${percentage}%
            </h3>

            <button
                type="button"
                onclick="generateAIQuiz()"
            >
                Try Another Quiz
            </button>

        </div>

    `;

}


/* =================================
   AI FLASHCARDS GENERATOR
================================= */

let flashcards = [];

let currentFlashcardIndex = 0;

let isFlashcardFlipped = false;


/* GENERATE FLASHCARDS */

async function generateFlashcards() {

    const subject = document
        .getElementById("flashcard-subject")
        .value;

    const topic = document
        .getElementById("flashcard-topic")
        .value.trim();

    const status = document.getElementById("flashcard-status");

    const container = document.getElementById("flashcard-container");

    const button = document.getElementById("flashcard-btn");


    if (!topic) {

        status.textContent = "Please enter a topic.";

        return;

    }


    const prompt = `

Generate exactly 10 educational flashcards.

Subject: ${subject}
Topic: ${topic}

Return ONLY valid JSON in this format:

{
    "flashcards": [
        {
            "question": "Question or concept",
            "answer": "Clear and simple answer"
        }
    ]
}

Rules:
- Generate exactly 10 flashcards.
- Every flashcard must have a question and answer.
- Keep answers simple, accurate and useful for revision.
- Do not include markdown outside JSON.

`;


    try {

        button.disabled = true;

        status.textContent = "Generating flashcards...";

        container.textContent = "Please wait...";


        const response = await generateWithAI(prompt);


        const cleanedResponse = response
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        const parsedData = JSON.parse(cleanedResponse);

        const generatedCards = parsedData.flashcards;


        if (
            !Array.isArray(generatedCards) ||
            generatedCards.length !== 10
        ) {

            throw new Error("AI did not generate exactly 10 flashcards.");

        }


        for (const card of generatedCards) {

            if (
                typeof card.question !== "string" ||
                typeof card.answer !== "string" ||
                !card.question.trim() ||
                !card.answer.trim()
            ) {

                throw new Error("AI generated an invalid flashcard.");

            }

        }


        flashcards = generatedCards;

        currentFlashcardIndex = 0;

        isFlashcardFlipped = false;


        status.textContent = "10 flashcards generated successfully!";

        showFlashcard();


    } catch (error) {

        console.error("Flashcard Error:", error);

        status.textContent = "Unable to generate flashcards.";

        container.textContent = error.message;


    } finally {

        button.disabled = false;

    }

}


/* SHOW FLASHCARD */

function showFlashcard() {

    const container = document.getElementById("flashcard-container");

    if (flashcards.length === 0) return;


    const card = flashcards[currentFlashcardIndex];


    container.innerHTML = `

        <div class="flashcard">

            <p>
                Card ${currentFlashcardIndex + 1} / ${flashcards.length}
            </p>

            <div
                class="flashcard-content"
                onclick="toggleFlashcard()"
            >

                <h3>
                    ${isFlashcardFlipped ? "Answer" : "Question"}
                </h3>

                <p>
                    ${isFlashcardFlipped ? card.answer : card.question}
                </p>

                <small>Click to flip</small>

            </div>

            <div class="flashcard-controls">

                <button
                    type="button"
                    onclick="previousFlashcard()"
                    ${currentFlashcardIndex === 0 ? "disabled" : ""}
                >
                    Previous
                </button>

                <button
                    type="button"
                    onclick="nextFlashcard()"
                    ${currentFlashcardIndex === flashcards.length - 1
                        ? "disabled"
                        : ""}
                >
                    Next
                </button>

            </div>

        </div>

    `;

}


/* FLIP FLASHCARD */

function toggleFlashcard() {

    isFlashcardFlipped = !isFlashcardFlipped;

    showFlashcard();

}


/* NEXT FLASHCARD */

function nextFlashcard() {

    if (currentFlashcardIndex < flashcards.length - 1) {

        currentFlashcardIndex++;

        isFlashcardFlipped = false;

        showFlashcard();

    }

}


/* PREVIOUS FLASHCARD */

function previousFlashcard() {

    if (currentFlashcardIndex > 0) {

        currentFlashcardIndex--;

        isFlashcardFlipped = false;

        showFlashcard();

    }

}
/* =================================
   AI STUDY PLANNER
================================= */

async function generateStudyPlan() {

    const subject = document.getElementById("planner-subject").value;
    const syllabus = document.getElementById("planner-syllabus").value.trim();
    const examDate = document.getElementById("planner-exam-date").value;
    const hours = Number(document.getElementById("planner-hours").value);

    const status = document.getElementById("planner-status");
    const output = document.getElementById("planner-output");
    const button = document.getElementById("generate-planner-btn");

    if (!syllabus || !examDate || !hours) {
        status.textContent = "Please fill all fields.";
        return;
    }

    const selectedDate = new Date(examDate + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        status.textContent = "Please select a future exam date.";
        return;
    }

    if (hours < 1 || hours > 16) {
        status.textContent = "Daily study hours must be between 1 and 16.";
        return;
    }

    const prompt = `
You are an expert academic study planner.

Subject: ${subject}
Syllabus: ${syllabus}
Exam date: ${examDate}
Available study hours per day: ${hours}

Create a practical study plan until the exam date.

Include:
1. Topic-wise daily schedule.
2. Revision sessions.
3. Practice questions and mock tests.
4. Breaks and buffer time.
5. Final revision strategy.

Keep the plan realistic and easy to follow.
Use clear headings and bullet points.
`;

    try {

        button.disabled = true;
        status.textContent = "Creating your study plan...";
        output.textContent = "Please wait...";

        const generatedText = await generateWithAI(prompt);

        output.innerHTML = renderAIResponse(generatedText);
        status.textContent = "Study plan generated successfully!";

    } catch (error) {

        console.error("Study Planner Error:", error);
        status.textContent = "Unable to generate study plan.";
        output.textContent = error.message;

    } finally {

        button.disabled = false;

    }
}


/* =================================
   AI NOTES SUMMARIZER
================================= */

async function summarizeNotes() {

    const subject = document.getElementById("summary-subject").value;
    const notes = document.getElementById("summary-input").value.trim();

    const status = document.getElementById("summary-status");
    const output = document.getElementById("summary-output");
    const button = document.getElementById("summarize-btn");

    if (!notes) {
        status.textContent = "Please enter your notes first.";
        return;
    }

    const prompt = `
You are an expert study notes summarizer.

Subject: ${subject}

Original notes:
${notes}

Summarize these notes without changing their meaning.

Include:
1. Short summary.
2. Important definitions.
3. Key concepts.
4. Important formulas (if any).
5. Important exam points.

Use simple language and bullet points.
Do not add unrelated information.
`;

    try {

        button.disabled = true;
        status.textContent = "Summarizing your notes...";
        output.textContent = "Please wait...";

        const generatedText = await generateWithAI(prompt);

        output.innerHTML = renderAIResponse(generatedText);
        status.textContent = "Notes summarized successfully!";

    } catch (error) {

        console.error("Summarizer Error:", error);
        status.textContent = "Unable to summarize notes.";
        output.textContent = error.message;

    } finally {

        button.disabled = false;

    }
}


/* =================================
   AI RESPONSE CLEANER
================================= */

function cleanAIResponse(text) {

    if (typeof text !== "string") {
        return "";
    }

    return text
        .replace(/```html/gi, "")
        .replace(/```javascript/gi, "")
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

}


/* =================================
   CONNECT FUNCTIONS TO HTML
================================= */

// AI Features

window.askStudyTutor = askStudyTutor;
window.generateAINotes = generateAINotes;
window.generateAIQuiz = generateAIQuiz;
window.generateFlashcards = generateFlashcards;
window.generateStudyPlan = generateStudyPlan;
window.summarizeNotes = summarizeNotes;

// Existing study features

window.openTopic = openTopic;
window.showSubject = showSubject;
window.checkPracticeAnswer = checkPracticeAnswer;
window.completeTopic = completeTopic;

// Quiz and flashcard features

window.showAIQuizQuestion = showAIQuizQuestion;
window.checkAIQuizAnswer = checkAIQuizAnswer;
window.nextAIQuizQuestion = nextAIQuizQuestion;
window.showAIQuizResult = showAIQuizResult;

window.showFlashcard = showFlashcard;
window.toggleFlashcard = toggleFlashcard;
window.nextFlashcard = nextFlashcard;
window.previousFlashcard = previousFlashcard;

console.log("AI Study Assistant functions connected successfully!");
