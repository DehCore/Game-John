const startBtn = document.getElementById("startBtn");
const menu = document.getElementById("menu");
const quiz = document.getElementById("quiz");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const result = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const timerElement = document.getElementById("timer");

let currentQuestion = 0;
let score = 0;
let timeLeft = 20;
let timer;

const questions = [
  {
    question: "Qual carro o Dominic Toretto dirige em Velozes e Furiosos 1?",
    answers: ["Toyota Supra", "Dodge Charger 1970", "Nissan Skyline", "Mazda RX-7"],
    correct: 1
  },
  {
    question: "Qual carro é o famoso 'Herbie' dos filmes da Disney?",
    answers: ["Fiat 500", "VW Fusca", "Mini Cooper", "Chevy Camaro"],
    correct: 1
  },
  {
    question: "No jogo Need for Speed: Most Wanted (2005), qual é o carro principal?",
    answers: ["Toyota Supra", "BMW M3 GTR", "Mazda RX-8", "Ford Mustang"],
    correct: 1
  },
  {
    question: "Qual é o carro falante da série Knight Rider?",
    answers: ["Pontiac Firebird Trans Am", "Chevrolet Corvette", "Ford Mustang", "Dodge Viper"],
    correct: 0
  },
  {
    question: "No filme 'De Volta para o Futuro', qual carro é a máquina do tempo?",
    answers: ["Chevrolet Camaro", "DeLorean DMC-12", "Ferrari 308", "Porsche 911"],
    correct: 1
  },
  {
    question: "Qual é o carro do Batman em 'The Dark Knight'?",
    answers: ["Batmóvel Tumbler", "Lamborghini Aventador", "Batmobile clássico", "Bugatti Chiron"],
    correct: 0
  },
  {
    question: "No game GTA V, qual carro lembra a Lamborghini Aventador?",
    answers: ["Adder", "Zentorno", "Entity XF", "Infernus"],
    correct: 1
  },
  {
    question: "No filme 'Cars' da Pixar, qual é o nome do protagonista?",
    answers: ["Mate", "Doc Hudson", "Relâmpago McQueen", "Sally"],
    correct: 2
  },
  {
    question: "Em 'Transformers', qual carro é o Bumblebee?",
    answers: ["Chevrolet Camaro", "Ford Mustang", "Dodge Charger", "VW Fusca"],
    correct: 0
  },
  {
    question: "No filme 'Mad Max: Estrada da Fúria', qual carro é o Interceptor de Max?",
    answers: ["Ford Falcon XB", "Chevy Impala", "Dodge Challenger", "Pontiac GTO"],
    correct: 0
  }
];

// iniciar quiz
startBtn.addEventListener("click", () => {
  menu.classList.add("hidden");
  quiz.classList.remove("hidden");
  showQuestion();
});

// mostrar pergunta
function showQuestion() {
  resetState();
  timeLeft = 20;
  timerElement.innerText = `⏱ Tempo: ${timeLeft}`;
  startTimer();

  let q = questions[currentQuestion];
  questionElement.innerText = q.question;

  q.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.addEventListener("click", () => selectAnswer(index));
    answersElement.appendChild(button);
  });
}

// reset
function resetState() {
  clearInterval(timer);
  nextBtn.classList.add("hidden");
  answersElement.innerHTML = "";
}

// selecionar resposta
function selectAnswer(index) {
  clearInterval(timer);
  const q = questions[currentQuestion];
  const buttons = answersElement.querySelectorAll("button");

  buttons.forEach((btn, i) => {
    if (i === q.correct) {
      btn.classList.add("correct");
    }
    if (i === index && i !== q.correct) {
      btn.classList.add("wrong");
    }
    btn.disabled = true;
  });

  if (index === q.correct) {
    score++;
  }
  nextBtn.classList.remove("hidden");
}

// timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `⏱ Tempo: ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(-1); // não respondeu
    }
  }, 1000);
}

// próxima
nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
});

// fim
function endQuiz() {
  quiz.classList.add("hidden");
  result.classList.remove("hidden");
  scoreText.innerText = `Você acertou ${score} de ${questions.length} perguntas!`;
}
