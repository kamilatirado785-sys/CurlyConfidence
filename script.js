const quizQuestions = [
  {
    key: "pattern",
    title: "What does your hair look like?",
    help: "Choose what feels most like your hair — or pick “I’m not sure.”",
    options: [
      ["wavy","Mostly loose waves"],
      ["curly","Curls or ringlets"],
      ["coily","Very tight curls or coils"],
      ["unsure","I’m not sure"]
    ]
  },
  {
    key: "goal",
    title: "What do you want help with most?",
    help: "Pick the goal that would make your routine easier.",
    options: [
      ["detangle","Detangling"],
      ["moisture","Keeping hair moisturized"],
      ["wash","Washing and cleansing"],
      ["routine","Building a simple routine"]
    ]
  },
  {
    key: "routine",
    title: "How often do you usually care for your hair?",
    help: "There is no right or wrong answer.",
    options: [
      ["daily","A little every day"],
      ["weekly","About once a week"],
      ["sometimes","Whenever I have time"],
      ["help","I need help figuring it out"]
    ]
  },
  {
    key: "setting",
    title: "Where are you learning this routine?",
    help: "This helps us point you toward the most useful resources.",
    options: [
      ["home","At home"],
      ["hospital","During a hospital stay"],
      ["both","At home and in the hospital"],
      ["other","Somewhere else"]
    ]
  },
  {
    key: "confidence",
    title: "How confident do you feel about caring for your hair?",
    help: "Choose the answer that feels closest to you.",
    options: [
      ["confident","I feel pretty confident"],
      ["learning","I’m still learning"],
      ["support","I want a caregiver to help"],
      ["unsure","I’m not sure where to start"]
    ]
  }
];

const guideData = {
  wavy: {
    title: "Your starting point: Wavy hair",
    text: "Try gentle detangling, lightweight moisture, and simple routines that avoid unnecessary pulling. Start with the resource library and adjust based on what feels comfortable for your hair."
  },
  curly: {
    title: "Your starting point: Curly hair",
    text: "Curly hair often benefits from gentle detangling in sections, consistent moisture, and minimizing rough handling. Explore the detangling and wash-day guides first."
  },
  coily: {
    title: "Your starting point: Very curly / coily hair",
    text: "Very curly and coily hair can benefit from extra-gentle handling, sectioning, and moisture. Take your time and choose routines that feel comfortable and manageable."
  },
  unsure: {
    title: "Not sure? That’s completely okay.",
    text: "You do not have to know your hair type to start. Begin with the gentle-care resources, and use the quiz to find a simple learning path."
  }
};

const roleData = {
  kids: { target: "learn" },
  caregiver: { target: "resources" },
  staff: { target: "resources" }
};

let quizIndex = 0;
let quizAnswers = {};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function openModal(id){
  const modal = document.getElementById(id);
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id){
  const modal = document.getElementById(id);
  modal.classList.remove("open");
  document.body.style.overflow = "";
}
$$(".modal-close").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.close)));
$$(".modal").forEach(modal => modal.addEventListener("click", e => {
  if(e.target === modal) closeModal(modal.id);
}));
document.addEventListener("keydown", e => {
  if(e.key === "Escape") $$(".modal.open").forEach(m => closeModal(m.id));
});

function renderQuiz(){
  const q = quizQuestions[quizIndex];
  const pct = ((quizIndex + 1) / quizQuestions.length) * 100;
  $("#quizContent").innerHTML = `
    <div class="quiz-question">
      <span class="eyebrow">QUESTION ${quizIndex + 1} OF ${quizQuestions.length}</span>
      <div class="progress"><i style="width:${pct}%"></i></div>
      <h2 id="quizModalTitle">${q.title}</h2>
      <p>${q.help}</p>
      ${q.options.map(([value,label]) => `<button class="quiz-option" data-value="${value}" type="button">${label}</button>`).join("")}
    </div>`;
  $$(".quiz-option").forEach(btn => btn.addEventListener("click", () => {
    quizAnswers[q.key] = btn.dataset.value;
    if(quizIndex < quizQuestions.length - 1){
      quizIndex++;
      renderQuiz();
    } else {
      renderQuizResult();
    }
  }));
}

function renderQuizResult(){
  const type = quizAnswers.pattern || "unsure";
  const goal = quizAnswers.goal;
  const guide = guideData[type];
  const goalText = {
    detangle:"Start with the gentle detangling tutorial.",
    moisture:"Explore the moisture and routine guides.",
    wash:"Start with Gentle Wash Day Basics.",
    routine:"Use the resource library to build a simple routine."
  }[goal] || "Start with the gentle-care guides.";
  $("#quizContent").innerHTML = `
    <div class="quiz-result">
      <p class="eyebrow">YOUR STARTING POINT</p>
      <h2 id="quizModalTitle">${guide.title}</h2>
      <p>${guide.text}</p>
      <p><strong>${goalText}</strong></p>
      <div class="button-row">
        <button class="button primary" id="quizResources" type="button">Explore Resources</button>
        <button class="button secondary" id="quizAgain" type="button">Retake Quiz</button>
      </div>
    </div>`;
  $("#quizResources").addEventListener("click", () => {
    closeModal("quizModal");
    document.querySelector("#resources").scrollIntoView({behavior:"smooth"});
  });
  $("#quizAgain").addEventListener("click", () => {
    quizIndex = 0;
    quizAnswers = {};
    renderQuiz();
  });
}

$("#quizStart").addEventListener("click", () => {
  quizIndex = 0;
  quizAnswers = {};
  openModal("quizModal");
  renderQuiz();
});

$$(".hair-card").forEach(card => card.addEventListener("click", () => {
  const data = guideData[card.dataset.type];
  $("#hairGuide").innerHTML = `<h3>${data.title}</h3><p>${data.text}</p><a class="button primary" href="#resources">See Resources</a>`;
  $("#hairGuide").classList.remove("hidden");
  $("#hairGuide").scrollIntoView({behavior:"smooth", block:"center"});
}));

$$(".role-card").forEach(card => card.addEventListener("click", () => {
  const target = roleData[card.dataset.target]?.target || "resources";
  document.getElementById(target).scrollIntoView({behavior:"smooth"});
}));

$("#resourceSearch").addEventListener("input", e => {
  const query = e.target.value.trim().toLowerCase();
  let visible = 0;
  $$(".resource-card").forEach(card => {
    const match = card.dataset.search.includes(query);
    card.style.display = match ? "" : "none";
    if(match) visible++;
  });
  $("#noResults").classList.toggle("hidden", visible !== 0);
});

function showContent(title, type="guide"){
  const body = type === "video"
    ? `<p class="eyebrow">VIDEO PLACEHOLDER</p><h2 id="contentModalTitle">${title}</h2><div class="video-placeholder" style="min-height:260px">ADD MY VIDEO HERE</div><p>Replace this placeholder with your own tutorial video URL when you are ready. The card and modal are already wired up.</p>`
    : `<p class="eyebrow">CURRYCONFIDENCE GUIDE</p><h2 id="contentModalTitle">${title}</h2><p>This guide can become one of your full educational pages. Keep the information simple, supportive, and appropriate for kids, caregivers, and healthcare staff.</p><ul><li>Start with a familiar routine.</li><li>Use gentle handling and avoid unnecessary pulling.</li><li>Ask the child what feels comfortable.</li><li>Use the resource library for step-by-step support.</li></ul>`;
  $("#contentModalBody").innerHTML = body;
  openModal("contentModal");
}
$$(".guide-btn").forEach(btn => btn.addEventListener("click", () => showContent(btn.dataset.title, "guide")));

$("#gameOpen").addEventListener("click", () => {
  $("#contentModalBody").innerHTML = `
    <p class="eyebrow">PLAY & LEARN</p>
    <h2 id="contentModalTitle">Build My Curl Routine</h2>
    <p>Tap the steps in the order you would use them. Try to build a gentle routine!</p>
    <div class="game-list" id="gameList">
      <button class="game-step" data-step="1">1. Gently detangle</button>
      <button class="game-step" data-step="2">2. Add your care product</button>
      <button class="game-step" data-step="3">3. Style gently</button>
    </div>
    <p id="gameMessage"><strong>Choose the first step.</strong></p>`;
  openModal("contentModal");
  let next = 1;
  $$(".game-step").forEach(btn => btn.addEventListener("click", () => {
    if(Number(btn.dataset.step) === next){
      btn.classList.add("selected");
      next++;
      $("#gameMessage").innerHTML = next === 4
        ? "<strong>Great job!</strong> You built a gentle routine."
        : `<strong>Nice!</strong> Now choose step ${next}.`;
    } else {
      $("#gameMessage").innerHTML = "<strong>Try again.</strong> Think about what should happen first.";
    }
  }));
});

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const subject = encodeURIComponent(`CurlyConfidence inquiry: ${form.get("interest")}`);
  const body = encodeURIComponent(
    `Name: ${form.get("name")}\nEmail: ${form.get("email")}\nInterest: ${form.get("interest")}\n\n${form.get("message")}`
  );
  // Replace the placeholder address below before launch.
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});

const menuToggle = $(".menu-toggle");
const nav = $(".nav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
$$(".nav a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

let language = "en";
$("#languageToggle").addEventListener("click", () => {
  language = language === "en" ? "es" : "en";
  $$("[data-en]").forEach(el => {
    el.textContent = el.dataset[language];
  });
  $("#languageToggle").textContent = language === "en" ? "ES" : "EN";
  $("#resourceSearch").placeholder = $("#resourceSearch").dataset[`placeholder${language === "en" ? "En" : "Es"}`];
  document.documentElement.lang = language;
});

$$(".nav a").forEach(link => link.addEventListener("click", () => {
  $$(".nav a").forEach(a => a.classList.remove("active"));
  link.classList.add("active");
}));
