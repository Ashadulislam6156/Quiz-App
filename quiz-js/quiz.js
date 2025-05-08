let questions = [
    {
        numb: 1,
        question: "What is the 'brain' of the computer?",
        answer: "CPU",
        options: [
            "Mouse",
            "Keyboard",
            "CPU",
            "Monitor"
        ]
    },
    {
        numb: 2,
        question: "What does RAM stand for?",
        answer: "Random Access Memory",
        options: [
            "Rapid Access Memory",
            "Random Access Memory",
            " Read Only Memory",
            "Random Active Memory"
        ]
    },
    {
        numb: 3,
        question: "How many bytes are in 1 KB?",
        answer: "1024 bytes",
        options: [
            "512 bytes",
            "1024 bytes",
            "2048 bytes",
            "4096 bytes"
        ]
    },
    {
        numb: 4,
        question: "Which of the following is an operating system?",
        answer: "Windows",
        options: [
            "Microsoft Word",
            "Windows",
            "Google Chrome",
            "Photoshop"
        ]
    },
    {
        numb: 5,
        question: "What does 'WWW' stand for?",
        answer: "World Wide Web",
        options: [
            "World Web Wide",
            "World Wide Web",
            "Wide World Web",
            "Web World Wide"
        ]
    },
    {
        numb: 6,
        question: "Which company developed the 'PDF' format?",
        answer: "Adobe",
        options: [
            "Microsoft",
            "Apple",
            "Adobe",
            "Google"
        ]
    },
    {
        numb: 7,
        question: "What is an 'IP Address'?",
        answer: "A unique identifier for a computer on a network",
        options: [
            "The physical address of a computer",
            "A unique identifier for a computer on a network",
            "The brand name of a computer",
            "The model of a computer"
        ]
    },
    {
        numb: 8,
        question: "What does 'USB' stand for?",
        answer: "Universal Serial Bus",
        options: [
            "Universal Serial Bus",
            "Universal Serial Block",
            "United Software Bus",
            "Universal System Bus"
        ]
    },
    {
        numb: 9,
        question: "Which of these is not a web browser?",
        answer: "Microsoft Word",
        options: [
            "Google Chrome",
            "Microsoft Word",
            "Safari",
            "Mozilla Firefox"
        ]
    },
    {
        numb: 10,
        question: "What does 'HTTP' stand for?",
        answer: "Hypertext Transfer Protocol",
        options: [
            "Hypertext Transfer Protocol",
            "High Tech Text Processing",
            "Hyperlink Text Technology",
            "Hardware Test Transfer Program"
        ]
    }
];

// Quiz Configuration
const QUIZ_CONFIG = {
    timePerQuestion: 15,
    totalQuestions: questions.length,
    passingScore: 60
};

// DOM Elements
const quizMain = document.querySelector(".quiz-main-section");
const startButton = document.querySelector(".start-button button");
const quizRules = document.querySelector(".quizRules");
const QuestionsHeru = document.querySelector(".Questions-heru");
const show_optionsList = document.querySelector(".MyOptions");
const TimeCount = document.querySelector(".TimeCount .Seconds");
const TimeLine = document.querySelector(".QuestionsHeader .timeLines");
const WinnerHero = document.querySelector(".WinnerHero");
const QuizBack = document.querySelector(".QuizBack");
const ButtonExit = document.querySelector(".ExitButton");
const ButtonContinue = document.querySelector(".ContinueButton");
const PreviewBtn = document.querySelector(".PreviewBtn");
const nextBtn = document.querySelector(".nextBtn");
const submitBtn = document.querySelector(".Submit");

// Quiz State
let que_cnt = 0;
let counter;
let TimeFixedValue = QUIZ_CONFIG.timePerQuestion;
let CouneterLine;
let result = 0;
let skippedCount = 0;
let userAnswers = Array(questions.length).fill(null);

// Exit confirmation
function confirmExit() {
    if (confirm("Are you sure you want to exit the quiz? Your progress will be lost.")) {
        window.location.reload();
    }
}

// Social sharing functions
function shareOnWhatsApp() {
    const score = document.querySelector("#resultTag").textContent;
    const text = `I scored ${score} in the Quiz App! Can you beat my score?`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareOnFacebook() {
    const score = document.querySelector("#resultTag").textContent;
    const text = `I scored ${score} in the Quiz App! Can you beat my score?`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareOnInstagram() {
    alert("Please take a screenshot of your score and share it on Instagram!");
}

// Reload on back from result
QuizBack.onclick = () => window.location.reload();

// Start quiz
startButton.onclick = () => {
    quizMain.style.display = "none";
    quizRules.classList.add("activeQuizRules");
};

// Exit from rules
ButtonExit.onclick = () => {
    quizMain.style.display = "block";
    quizRules.classList.remove("activeQuizRules");
};

// Continue to questions
ButtonContinue.onclick = () => {
    atCounterTime(TimeFixedValue);
    TimeCounterLine(0);
    quizRules.style.display = "none";
    QuestionsHeru.classList.add("activeQuestionsHeru");
    showQuestions(que_cnt);
    nextBtn.style.display = "none";
};

// Next question
nextBtn.onclick = () => {
    clearInterval(counter);
    clearInterval(CouneterLine);
    atCounterTime(TimeFixedValue);
    TimeCounterLine(0);

    if (que_cnt < questions.length - 1) {
        que_cnt++;
        showQuestions(que_cnt);
        nextBtn.style.display = "none";
    }

    submitBtn.style.display = que_cnt === questions.length - 1 ? "block" : "none";
};

// Preview to rules
PreviewBtn.onclick = () => {
    clearInterval(counter);
    clearInterval(CouneterLine);
    if (que_cnt === 0) {
        QuestionsHeru.classList.remove("activeQuestionsHeru");
        quizRules.style.display = "block";
    }
};

// Submit & show result
submitBtn.onclick = () => {
    QuestionsHeru.style.display = "none";
    WinnerHero.classList.add("WinnerHeroActive");

    const total = questions.length;
    const percentage = Math.round((result / total) * 100);
    const grade = getGrade(percentage);

    const resultTag = document.querySelector("#resultTag");
    if (resultTag) {
        resultTag.innerHTML = ` ${percentage}% (${grade})`;
    }

    updateWinnerStats(total, result, skippedCount);
};

// Get grade based on percentage
function getGrade(percentage) {
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
}

// Update winner stats
function updateWinnerStats(total, correct, skipped) {
    const stats = document.querySelector(".WinnerStats");
    if (stats) {
        stats.innerHTML = `
            <p>Total Questions: <span>${total}</span></p>
            <p>Correct Answers: <span>${correct}</span></p>
            <p>Wrong Answers: <span>${total - correct - skipped}</span></p>
            <p>Skipped Questions: <span>${skipped}</span></p>
        `;
    }
}

// Show a question
function showQuestions(index) {
    const show_text = document.querySelector(".section .text-head");
    const queNumberCnt = document.querySelector(".que-footer #queNum");
    const question = questions[index];

    show_text.innerHTML = `<span>${question.numb}. ${question.question}</span>`;

    const rightIcon = `<div class="RightIcon" style="padding-right: 15px; color:green; font-size: 25px;">
        <i class="fa-solid fa-check"></i></div>`;
    const wrongIcon = `<div class="RightIcon" style="padding-right: 15px; color:red; font-size: 25px;">
        <i class="fa-solid fa-xmark"></i></div>`;

    show_optionsList.innerHTML = question.options.map(option => {
        let selectedClass = '';
        let icon = '';
        const userAns = userAnswers[index];

        if (userAns !== null) {
            if (option === question.answer && userAns !== question.answer) {
                selectedClass = 'AnsRight';
                icon = rightIcon;
            } else if (option === userAns) {
                selectedClass = userAns === question.answer ? 'AnsRight' : 'AnsWrong';
                icon = userAns === question.answer ? rightIcon : wrongIcon;
            }
        }

        return `<div class="options ${selectedClass}"><span>${option}</span>${icon}</div>`;
    }).join("");

    queNumberCnt.innerHTML = `${question.numb} of ${questions.length} Questions`;

    const options = show_optionsList.querySelectorAll(".options");
    options.forEach(option => {
        option.setAttribute("onclick", "OptionSelected(this)");
        option.style.pointerEvents = userAnswers[index] !== null ? "none" : "auto";
    });
}

// Handle user option selection
function OptionSelected(answer) {
    clearInterval(counter);
    clearInterval(CouneterLine);

    const userAns = answer.textContent.trim();
    userAnswers[que_cnt] = userAns;
    const correctAns = questions[que_cnt].answer;
    const Alloption = show_optionsList.children.length;

    const rightIcon = `<div class="RightIcon" style="padding-right: 15px; color:green; font-size: 25px;">
        <i class="fa-solid fa-check"></i></div>`;
    const wrongIcon = `<div class="RightIcon" style="padding-right: 15px; color:red; font-size: 25px;">
        <i class="fa-solid fa-xmark"></i></div>`;

    if (userAns === correctAns) {
        answer.classList.add("AnsRight");
        answer.insertAdjacentHTML("beforeend", rightIcon);
        result += 1;
    } else {
        answer.classList.add("AnsWrong");
        answer.insertAdjacentHTML("beforeend", wrongIcon);
        for (let i = 0; i < Alloption; i++) {
            if (show_optionsList.children[i].textContent.trim() === correctAns) {
                show_optionsList.children[i].classList.add("AnsRight");
                show_optionsList.children[i].insertAdjacentHTML("beforeend", rightIcon);
            }
        }
    }

    for (let i = 0; i < Alloption; i++) {
        show_optionsList.children[i].style.pointerEvents = "none";
    }

    PreviewBtn.style.display = "none";
    nextBtn.style.display = que_cnt === questions.length - 1 ? "none" : "block";
    submitBtn.style.display = que_cnt === questions.length - 1 ? "block" : "none";
}

// Timer countdown
function atCounterTime(time) {
    counter = setInterval(() => {
        TimeCount.textContent = time < 10 ? `0${time}` : time;
        time--;

        if (time < 0) {
            clearInterval(counter);
            TimeCount.textContent = "00";

            if (userAnswers[que_cnt] === null) {
                skippedCount++;

                const correctAns = questions[que_cnt].answer;
                const Alloption = show_optionsList.children.length;

                for (let i = 0; i < Alloption; i++) {
                    let optionText = show_optionsList.children[i].textContent.trim();

                    if (optionText === correctAns) {
                        show_optionsList.children[i].classList.add("AnsRight");
                        show_optionsList.children[i].insertAdjacentHTML("beforeend",
                            `<div class="RightIcon" style="padding-right: 15px; color:green; font-size: 25px;">
                                <i class="fa-solid fa-check"></i></div>`);
                    }

                    show_optionsList.children[i].style.pointerEvents = "none";
                }

                PreviewBtn.style.display = "none";
                nextBtn.style.display = que_cnt === questions.length - 1 ? "none" : "block";
                submitBtn.style.display = que_cnt === questions.length - 1 ? "block" : "none";
            }
        }
    }, 1000);
}

// Timeline animation
function TimeCounterLine(startVal) {
    let time2 = startVal;
    CouneterLine = setInterval(() => {
        time2 += 1;
        TimeLine.style.width = time2 + "px";
        if (time2 > 319) clearInterval(CouneterLine);
    }, 50);
}
