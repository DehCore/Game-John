// ====== ELEMENTOS ======
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const infoBtn = document.getElementById("infoBtn");
const info = document.getElementById("info");
const infoBackBtn = document.getElementById("infoBackBtn");

const quiz = document.getElementById("quiz");
const timerEl = document.getElementById("timer");
const qIndexEl = document.getElementById("qIndex");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const infoBox = document.getElementById("infoBox");
const nextBtn = document.getElementById("nextBtn");

const result = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const restartBtn = document.getElementById("restartBtn");

// ====== ESTADO ======
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 20;
let timer = null;
const MAX_QUESTIONS = 10;

// ====== PERGUNTAS (sem imagens) ======
const ALL_QUESTIONS = [
  {
    question: "Em 'De Volta para o Futuro', qual é o carro que vira máquina do tempo?",
    answers: ["Pontiac Firebird", "DeLorean DMC-12", "Aston Martin DB5", "Ford Mustang"],
    correct: 1,
    info: "O DeLorean DMC-12, com portas asa-de-gaivota, virou a máquina do tempo do Dr. Brown e do Marty."
  },
  {
    question: "Qual muscle car o Dominic Toretto usa em vários filmes de 'Velozes e Furiosos'?",
    answers: ["Dodge Charger 1970", "Chevrolet Camaro 1969", "Ford Mustang 1967", "Plymouth Barracuda 1971"],
    correct: 0,
    info: "O Dodge Charger R/T 1970 é o clássico do Toretto: V8 nervoso e visual icônico."
  },
  {
    question: "Qual carro laranja do Brian O'Conner ficou famoso no primeiro 'Velozes e Furiosos'?",
    answers: ["Mazda RX-7", "Nissan Skyline R34", "Toyota Supra MK4", "Honda S2000"],
    correct: 2,
    info: "O Toyota Supra MK4 de Brian marcou a era do tuning dos anos 2000."
  },
  {
    question: "No jogo 'Need for Speed: Most Wanted' (2005), qual é o carro principal do protagonista?",
    answers: ["BMW M3 GTR", "Mitsubishi Lancer Evo", "Subaru Impreza WRX", "Mazda RX-8"],
    correct: 0,
    info: "A BMW M3 GTR E46 com livery branco/azul é um dos carros mais amados da franquia."
  },
  {
    question: "Qual modelo é o KITT, o carro falante de 'Knight Rider'?",
    answers: ["Pontiac Firebird Trans Am", "Chevrolet Corvette", "Dodge Viper", "Ford GT"],
    correct: 0,
    info: "O KITT é um Pontiac Firebird Trans Am modificado, com alta tecnologia e a luz vermelha frontal."
  },
  {
    question: "Em 'The Dark Knight', como é chamado o Batmóvel usado pelo Batman?",
    answers: ["Tumbler", "Interceptor", "Mach 5", "Speeder"],
    correct: 0,
    info: "O Tumbler é um Batmóvel estilo tanque, rápido e resistente, da trilogia do Nolan."
  },
  {
    question: "Em 'Transformers', Bumblebee se transforma em qual carro moderno?",
    answers: ["Chevrolet Camaro", "Dodge Challenger", "Ford Mustang", "Nissan GT-R"],
    correct: 0,
    info: "O Bumblebee popularizou o Camaro moderno, aparecendo em várias gerações."
  },
  {
    question: "Qual é o carro Interceptor do Max em 'Mad Max'?",
    answers: ["Ford Falcon XB", "Pontiac GTO", "Chevy Impala", "Plymouth Road Runner"],
    correct: 0,
    info: "O 'Pursuit Special' é um Ford Falcon XB modificado, símbolo do mundo pós-apocalíptico."
  },
  {
    question: "Qual clássico da Aston Martin é famoso nos filmes de James Bond?",
    answers: ["DB9", "DB11", "DB5", "Vantage"],
    correct: 2,
    info: "O Aston Martin DB5 ficou eternizado desde 'Goldfinger' pela elegância e gadgets."
  },
  {
    question: "No filme 'The Italian Job' (Uma Saída de Mestre), qual carro é usado na fuga?",
    answers: ["Audi TT", "VW Golf GTI", "Mini Cooper", "Renault Clio V6"],
    correct: 2,
    info: "Os Mini Coopers fazem fugas coreografadas por túneis e escadas, mostrando agilidade urbana."
  }
];

// ====== UTIL ======
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function resetTimer(){
  clearInterval(timer);
  timeLeft = 20;
  timerEl.textContent = `⏱ ${timeLeft}`;
  timer = setInterval(()=>{
    timeLeft--;
    timerEl.textContent = `⏱ ${timeLeft}`;
    if(timeLeft <= 0){
      clearInterval(timer);
      lockAnswers(-1); // estourou o tempo
    }
  },1000);
}

function clearNode(node){
  while(node.firstChild) node.removeChild(node.firstChild);
}

// ====== FLUXO ======
function startGame(){
  const pool = [...ALL_QUESTIONS];
  shuffle(pool);
  questions = pool.slice(0, MAX_QUESTIONS);
  currentQuestionIndex = 0;
  score = 0;

  menu.classList.add("hidden");
  info.classList.add("hidden");
  result.classList.add("hidden");
  quiz.classList.remove("hidden");
  infoBox.classList.add("hidden");
  nextBtn.classList.add("hidden");

  renderQuestion();
}

function renderQuestion(){
  clearInterval(timer);
  infoBox.classList.add("hidden");
  nextBtn.classList.add("hidden");
  clearNode(answersEl);

  const q = questions[currentQuestionIndex];
  qIndexEl.textContent = (currentQuestionIndex+1).toString();
  questionEl.textContent = q.question;

  q.answers.forEach((txt, idx)=>{
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = txt;
    btn.addEventListener("click", ()=>handleAnswer(idx));
    answersEl.appendChild(btn);
  });

  resetTimer();
}

function handleAnswer(index){
  clearInterval(timer);
  lockAnswers(index);
}

function lockAnswers(selectedIndex){
  const q = questions[currentQuestionIndex];
  const buttons = answersEl.querySelectorAll(".answer");

  buttons.forEach((btn, i)=>{
    if(i === q.correct) btn.classList.add("correct");
    if(selectedIndex === i && i !== q.correct) btn.classList.add("wrong");
    btn.disabled = true;
  });

  if(selectedIndex === q.correct){
    score++;
    infoBox.textContent = q.info;
    infoBox.classList.remove("hidden");
  }

  nextBtn.classList.remove("hidden");
}

function nextQuestion(){
  currentQuestionIndex++;
  if(currentQuestionIndex < questions.length){
    renderQuestion();
  }else{
    endGame();
  }
}

function endGame(){
  quiz.classList.add("hidden");
  result.classList.remove("hidden");
  scoreText.textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
}

// ====== NAVEGAÇÃO ======
startBtn.addEventListener("click", startGame);

infoBtn.addEventListener("click", ()=>{
  menu.classList.add("hidden");
  info.classList.remove("hidden");
});

infoBackBtn.addEventListener("click", ()=>{
  info.classList.add("hidden");
  menu.classList.remove("hidden");
});

nextBtn.addEventListener("click", nextQuestion);

restartBtn.addEventListener("click", ()=>{
  startGame();
});
