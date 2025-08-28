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
const homeBtn = document.getElementById("homeBtn");

// ====== ESTADO ======
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 20;
let timer = null;
const MAX_QUESTIONS = 10;

// ====== PERGUNTAS ======
const ALL_QUESTIONS = [
  // Filmes
  { question:"Em 'De Volta para o Futuro', qual é o carro que vira máquina do tempo?",
    answers:["Pontiac Firebird","DeLorean DMC-12","Aston Martin DB5","Ford Mustang"],
    correct:1, info:"O DeLorean DMC-12 virou a máquina do tempo do Dr. Brown e Marty." },
  { question:"Qual muscle car é o mais famoso do Dominic Toretto?",
    answers:["Chevrolet Camaro 1969","Dodge Charger 1970","Ford Mustang 1967","Nissan Skyline R34"],
    correct:1, info:"O Dodge Charger R/T 1970 é o símbolo do Toretto." },
  { question:"No filme 'Transformers', Bumblebee é qual carro?",
    answers:["Chevrolet Camaro","Ford Mustang","Toyota Supra","Mazda RX-7"],
    correct:0, info:"Bumblebee foi representado como um Camaro moderno." },
  { question:"Qual carro clássico do 007 James Bond é mais famoso?",
    answers:["Jaguar E-Type","Aston Martin DB5","Rolls-Royce Phantom","Bentley Continental"],
    correct:1, info:"O Aston Martin DB5 é o carro mais icônico do James Bond." },
  { question:"Em 'Mad Max', qual é o carro Interceptor do protagonista?",
    answers:["Pontiac GTO","Ford Falcon XB","Chevy Impala","Dodge Challenger"],
    correct:1, info:"O Ford Falcon XB modificado é o Interceptor do Mad Max." },

  // Desenhos
  { question:"Qual é o protagonista carro de 'Carros' (Pixar)?",
    answers:["Mate","Relâmpago McQueen","Doc Hudson","Sally Carrera"],
    correct:1, info:"Relâmpago McQueen é o astro corredor da franquia 'Carros'." },
  { question:"No desenho 'Corrida Maluca', qual é o vilão?",
    answers:["Dick Vigarista","Professor Aéreo","Barão Vermelho","Capitão Caverna"],
    correct:0, info:"Dick Vigarista e Mutley sempre trapaceiam na corrida." },
  { question:"Qual é o carro do Speed Racer?",
    answers:["Mach 5","Batmóvel","Thunderbird","Hot Rod"],
    correct:0, info:"O Mach 5 é o icônico carro cheio de gadgets do Speed Racer." },
  { question:"Nos quadrinhos da Turma da Mônica, quem adora inventar carros?",
    answers:["Cebolinha","Cascão","Anjinho","Franjinha"],
    correct:3, info:"Franjinha é o cientista que cria invenções e carros malucos." },
  { question:"Em 'Hot Wheels Battle Force 5', quem é o líder da equipe?",
    answers:["Vert Wheeler","Sherman Cortez","Zoom Takazumi","Agura Ibaden"],
    correct:0, info:"Vert Wheeler é o piloto principal da série Hot Wheels." },
];

// ====== UTIL ======
function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

function resetTimer(){
  clearInterval(timer);
  timeLeft=20;
  timerEl.textContent=`⏱ ${timeLeft}`;
  timer=setInterval(()=>{
    timeLeft--;
    timerEl.textContent=`⏱ ${timeLeft}`;
    if(timeLeft<=0){ clearInterval(timer); lockAnswers(-1); }
  },1000);
}

function clearNode(node){ while(node.firstChild) node.removeChild(node.firstChild); }

// ====== FLUXO ======
function startGame(){
  const pool=[...ALL_QUESTIONS];
  shuffle(pool);
  questions=pool.slice(0,MAX_QUESTIONS);
  currentQuestionIndex=0;
  score=0;

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

  const q=questions[currentQuestionIndex];
  qIndexEl.textContent=(currentQuestionIndex+1);
  questionEl.textContent=q.question;

  q.answers.forEach((txt,idx)=>{
    const btn=document.createElement("button");
    btn.className="answer";
    btn.textContent=txt;
    btn.addEventListener("click",()=>handleAnswer(idx));
    answersEl.appendChild(btn);
  });

  resetTimer();
}

function handleAnswer(index){ clearInterval(timer); lockAnswers(index); }

function lockAnswers(selectedIndex){
  const q=questions[currentQuestionIndex];
  const buttons=answersEl.querySelectorAll(".answer");

  buttons.forEach((btn,i)=>{
    if(i===q.correct) btn.classList.add("correct");
    if(selectedIndex===i && i!==q.correct) btn.classList.add("wrong");
    btn.disabled=true;
  });

  if(selectedIndex===q.correct){
    score++;
    infoBox.textContent=q.info;
    infoBox.classList.remove("hidden");
  }
  nextBtn.classList.remove("hidden");
}

function nextQuestion(){
  currentQuestionIndex++;
  if(currentQuestionIndex<questions.length){ renderQuestion(); }
  else{ endGame(); }
}

function endGame(){
  quiz.classList.add("hidden");
  result.classList.remove("hidden");
  scoreText.textContent=`Você acertou ${score} de ${questions.length} perguntas!`;
}

// ====== NAVEGAÇÃO ======
startBtn.addEventListener("click",startGame);
infoBtn.addEventListener("click",()=>{ menu.classList.add("hidden"); info.classList.remove("hidden"); });
infoBackBtn.addEventListener("click",()=>{ info.classList.add("hidden"); menu.classList.remove("hidden"); });
nextBtn.addEventListener("click",nextQuestion);
restartBtn.addEventListener("click",startGame);

// BOTÃO “VOLTAR AO INÍCIO” AJUSTADO
homeBtn.addEventListener("click", () => {
  result.classList.add("hidden"); // esconde o resultado
  menu.classList.remove("hidden"); // mostra o menu inicial
});
