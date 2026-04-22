const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CAPTCHA_LENGTH = 6;
const REQUIRED_CLEARS = 5;
const SAVE_KEY = "ragebait_game_state_v3";
const LEGACY_SAVE_KEYS = ["ragebait_game_state_v2"];
const REWARD_CODE = "ZSWE23$$$";
const LEVEL2_REWARD_CODE = "4234234";
const LEVEL3_REWARD_CODE = "1234567890987654321";
const TESTER_PASSWORD = "VavaSteve03111130";
const RELEASE_LEVEL_CAP = 4;
const SECRET_LEVEL_TRIGGER = "45 WORDS!";
const SECRET_LEVEL_WORD = "pneumonoultramicroscopicsilicovolcanoconiosis";
const PHASE_DURATION_MS = 3000;
const LEVEL3_ESSAY = `Wax apples, also known as water apples or rose apples, are a refreshing tropical fruit enjoyed in many parts of Asia. Their smooth, shiny skin ranges in color from pale green to deep red, giving them an appealing, almost wax-like appearance. The fruit has a unique bell shape, often hollow in the center, and a crisp, juicy texture that makes it especially satisfying to eat on a hot day.

Unlike many fruits, wax apples are not overly sweet. Instead, they offer a mild, subtly sweet flavor with a hint of floral freshness. This light taste makes them a perfect snack for those who prefer something less sugary. Their high water content also makes them hydrating, which is why they are commonly eaten in warm climates.

Wax apples can be enjoyed fresh, often sliced and served chilled. In some cultures, they are sprinkled with salt, sugar, or even chili powder to enhance their flavor. Beyond their taste, they are also valued for their nutritional benefits, containing vitamins and antioxidants that support overall health.

Overall, wax apples are a simple yet delightful fruit, combining beauty, refreshment, and subtle flavor in one unique package.`;

const LEVEL2_PHASES = [
  { text: "Click the button", bg: "black", fg: "normal", expected: "click" },
  { text: "When the background is pink click the button", bg: "pink", fg: "normal", expected: "click" },
  { text: "When you see this text in blue do not click", bg: "black", fg: "blue", expected: "noclick" },
  { text: "Do not click the button", bg: "pink", fg: "normal", expected: "click" },
  { text: "If the background is green click 5 times", bg: "green", fg: "normal", expected: "click5" },
  { text: "The background has more priority than the text", bg: "pink", fg: "blue", expected: "click" },
  { text: "If you see a red background, right click the button", bg: "red", fg: "normal", expected: "rightclick" },
  { text: "Do not click", bg: "green", fg: "normal", expected: "click5" },
  { text: "Please click 5 times", bg: "red", fg: "normal", expected: "rightclick" },
  { text: "RNG Phase", bg: "black", fg: "normal", expected: "rng" }
];

const state = {
  clears: 0,
  currentCaptcha: "",
  level1Completed: false,
  level2Unlocked: false,
  level2Completed: false,
  level2Phase: 0,
  level3Unlocked: false,
  level3Completed: false,
  level3Draft: "",
  level4Unlocked: false,
  level4Completed: false,
  secretLevelCompleted: false,
  badges: {
    blue: 0,
    yellow: 0,
    green: 0,
    red: 0,
    purple: 0,
    rainbow: 0
  },
  forcedAdvancements: {},
  clearedOnce: {
    level1: false,
    level2: false,
    level3: false,
    level4: false
  }
};

let level2TimerHandle = null;
let level2TickHandle = null;
let phaseLeftClicks = 0;
let phaseRightClicks = 0;

const menuScreen = document.getElementById("menuScreen");
const level1Screen = document.getElementById("level1Screen");
const level2Screen = document.getElementById("level2Screen");
const level3Screen = document.getElementById("level3Screen");
const level4Screen = document.getElementById("level4Screen");
const secretLevelScreen = document.getElementById("secretLevelScreen");
const continueBtn = document.getElementById("continueBtn");
const toMenuFromL1Btn = document.getElementById("toMenuFromL1Btn");
const toMenuFromL2Btn = document.getElementById("toMenuFromL2Btn");
const nextLevelBtn = document.getElementById("nextLevelBtn");
const nextLevelFromL2Btn = document.getElementById("nextLevelFromL2Btn");
const testersPanel = document.getElementById("testersPanel");
const testerLevel1Btn = document.getElementById("testerLevel1Btn");
const testerLevel2Btn = document.getElementById("testerLevel2Btn");
const testerLevel3Btn = document.getElementById("testerLevel3Btn");
const testerLevel4Btn = document.getElementById("testerLevel4Btn");
const testerCompleteAllBtn = document.getElementById("testerCompleteAllBtn");
const menuLevel1Btn = document.getElementById("menuLevel1Btn");
const menuLevel2Btn = document.getElementById("menuLevel2Btn");
const menuLevel3Btn = document.getElementById("menuLevel3Btn");
const menuLevel4Btn = document.getElementById("menuLevel4Btn");
const openAdvancementsBtn = document.getElementById("openAdvancementsBtn");

const canvas = document.getElementById("captchaCanvas");
const ctx = canvas.getContext("2d");
const rewardPanel = document.getElementById("rewardPanel");
const rewardCanvas = document.getElementById("rewardCanvas");
const rewardCtx = rewardCanvas.getContext("2d");
const input = document.getElementById("captchaInput");
const submitBtn = document.getElementById("submitBtn");
const feedbackText = document.getElementById("feedbackText");
const progressText = document.getElementById("progressText");

const phasePanel = document.getElementById("phasePanel");
const level2Progress = document.getElementById("level2Progress");
const phaseInstruction = document.getElementById("phaseInstruction");
const phaseTimer = document.getElementById("phaseTimer");
const phaseActionBtn = document.getElementById("phaseActionBtn");
const level2Feedback = document.getElementById("level2Feedback");
const essayPrompt = document.getElementById("essayPrompt");
const essayInput = document.getElementById("essayInput");
const essaySubmitBtn = document.getElementById("essaySubmitBtn");
const level3Feedback = document.getElementById("level3Feedback");
const toMenuFromL3Btn = document.getElementById("toMenuFromL3Btn");
const nextLevelFromL3Btn = document.getElementById("nextLevelFromL3Btn");
const rngRollBtn = document.getElementById("rngRollBtn");
const level4UpgradeText = document.getElementById("level4UpgradeText");
const level4Feedback = document.getElementById("level4Feedback");
const toMenuFromL4Btn = document.getElementById("toMenuFromL4Btn");
const secretWordInput = document.getElementById("secretWordInput");
const secretWordSubmitBtn = document.getElementById("secretWordSubmitBtn");
const secretLevelFeedback = document.getElementById("secretLevelFeedback");
const toMenuFromSecretBtn = document.getElementById("toMenuFromSecretBtn");
const badgeBlueCount = document.getElementById("badgeBlueCount");
const badgeYellowCount = document.getElementById("badgeYellowCount");
const badgeGreenCount = document.getElementById("badgeGreenCount");
const badgeRedCount = document.getElementById("badgeRedCount");
const badgePurpleCount = document.getElementById("badgePurpleCount");
const advancementsScreen = document.getElementById("advancementsScreen");
const advancementList = document.getElementById("advancementList");
const toMenuFromAdvancementsBtn = document.getElementById("toMenuFromAdvancementsBtn");

function saveState() {
  const raw = JSON.stringify(state);
  try {
    localStorage.setItem(SAVE_KEY, raw);
    for (let i = 0; i < LEGACY_SAVE_KEYS.length; i += 1) {
      localStorage.setItem(LEGACY_SAVE_KEYS[i], raw);
    }
  } catch {
    // Ignore storage failures; game remains playable for this session.
  }
}

function loadState() {
  const storageKeys = [SAVE_KEY, ...LEGACY_SAVE_KEYS];
  let parsed = null;
  let loadedFromKey = "";

  for (let i = 0; i < storageKeys.length; i += 1) {
    try {
      const raw = localStorage.getItem(storageKeys[i]);
      if (!raw) continue;
      parsed = JSON.parse(raw);
      loadedFromKey = storageKeys[i];
      break;
    } catch {
      // Skip broken JSON in this key and keep trying others.
    }
  }

  if (!parsed) return false;
  try {
    if (Number.isInteger(parsed.clears)) state.clears = Math.max(0, Math.min(REQUIRED_CLEARS, parsed.clears));
    if (typeof parsed.currentCaptcha === "string" && parsed.currentCaptcha.length === CAPTCHA_LENGTH) state.currentCaptcha = parsed.currentCaptcha;
    state.level1Completed = Boolean(parsed.level1Completed || parsed.completed || state.clears >= REQUIRED_CLEARS);
    state.level2Unlocked = Boolean(parsed.level2Unlocked || state.level1Completed);
    state.level2Completed = Boolean(parsed.level2Completed);
    state.level3Unlocked = Boolean(parsed.level3Unlocked || state.level2Completed);
    state.level3Completed = Boolean(parsed.level3Completed);
    state.level4Unlocked = Boolean(parsed.level4Unlocked || state.level3Completed);
    state.level4Completed = Boolean(parsed.level4Completed);
    state.secretLevelCompleted = Boolean(parsed.secretLevelCompleted);
    if (typeof parsed.level3Draft === "string") state.level3Draft = parsed.level3Draft;
    if (parsed.badges && typeof parsed.badges === "object") {
      state.badges.blue = Number.isInteger(parsed.badges.blue) ? Math.max(0, parsed.badges.blue) : 0;
      state.badges.yellow = Number.isInteger(parsed.badges.yellow) ? Math.max(0, parsed.badges.yellow) : 0;
      state.badges.green = Number.isInteger(parsed.badges.green) ? Math.max(0, parsed.badges.green) : 0;
      state.badges.red = Number.isInteger(parsed.badges.red) ? Math.max(0, parsed.badges.red) : 0;
      state.badges.purple = Number.isInteger(parsed.badges.purple) ? Math.max(0, parsed.badges.purple) : 0;
      state.badges.rainbow = Number.isInteger(parsed.badges.rainbow) ? Math.max(0, parsed.badges.rainbow) : 0;
    }
    if (parsed.forcedAdvancements && typeof parsed.forcedAdvancements === "object") {
      state.forcedAdvancements = { ...parsed.forcedAdvancements };
    }
    if (parsed.clearedOnce && typeof parsed.clearedOnce === "object") {
      state.clearedOnce.level1 = Boolean(parsed.clearedOnce.level1);
      state.clearedOnce.level2 = Boolean(parsed.clearedOnce.level2);
      state.clearedOnce.level3 = Boolean(parsed.clearedOnce.level3);
      state.clearedOnce.level4 = Boolean(parsed.clearedOnce.level4);
    }
    if (Number.isInteger(parsed.level2Phase)) {
      state.level2Phase = Math.max(0, Math.min(LEVEL2_PHASES.length - 1, parsed.level2Phase));
    }
    state.clearedOnce.level1 = state.clearedOnce.level1 || state.level1Completed;
    state.clearedOnce.level2 = state.clearedOnce.level2 || state.level2Completed;
    state.clearedOnce.level3 = state.clearedOnce.level3 || state.level3Completed;
    state.clearedOnce.level4 = state.clearedOnce.level4 || state.level4Completed;

    if (loadedFromKey && loadedFromKey !== SAVE_KEY) saveState();
    return true;
  } catch {
    return false;
  }
}

function showScreen(screenId) {
  stopLevel2Phase();
  menuScreen.classList.add("hidden");
  level1Screen.classList.add("hidden");
  level2Screen.classList.add("hidden");
  level3Screen.classList.add("hidden");
  level4Screen.classList.add("hidden");
  secretLevelScreen.classList.add("hidden");
  advancementsScreen.classList.add("hidden");
  if (screenId === "menu") menuScreen.classList.remove("hidden");
  if (screenId === "level1") level1Screen.classList.remove("hidden");
  if (screenId === "level2") level2Screen.classList.remove("hidden");
  if (screenId === "level3") level3Screen.classList.remove("hidden");
  if (screenId === "level4") level4Screen.classList.remove("hidden");
  if (screenId === "secret") secretLevelScreen.classList.remove("hidden");
  if (screenId === "advancements") advancementsScreen.classList.remove("hidden");
  if (screenId === "menu") refreshMenuPanels();
}

function continueGame() {
  if (state.level4Unlocked) {
    showScreen("level4");
    setupLevel4View();
  } else if (state.level3Unlocked) {
    showScreen("level3");
    setupLevel3View();
  } else if (state.level2Unlocked) {
    showScreen("level2");
    startLevel2();
  } else {
    showScreen("level1");
    setupLevel1View();
  }
}

function unlockTestersPanel() {
  testersPanel.classList.remove("hidden");
}

function isLevelSelectable(level) {
  if (level === 1) return true;
  if (level === 2) return state.clearedOnce.level1;
  if (level === 3) return state.clearedOnce.level2;
  if (level === 4) return state.clearedOnce.level3;
  return false;
}

function refreshMenuPanels() {
  const menuButtons = [
    { btn: menuLevel1Btn, selectable: isLevelSelectable(1) },
    { btn: menuLevel2Btn, selectable: isLevelSelectable(2) },
    { btn: menuLevel3Btn, selectable: isLevelSelectable(3) },
    { btn: menuLevel4Btn, selectable: isLevelSelectable(4) }
  ];
  for (let i = 0; i < menuButtons.length; i += 1) {
    const { btn, selectable } = menuButtons[i];
    btn.disabled = !selectable;
    btn.classList.toggle("level-available", selectable);
    btn.classList.toggle("level-locked", !selectable);
  }
}

function goToLevelFromTester(level) {
  if (level >= 2) state.level2Unlocked = true;
  if (level >= 3) state.level3Unlocked = true;
  if (level >= 4) state.level4Unlocked = true;
  saveState();

  if (level === 1) {
    showScreen("level1");
    setupLevel1View();
    return;
  }
  if (level === 2) {
    showScreen("level2");
    startLevel2();
    return;
  }
  if (level === 3) {
    showScreen("level3");
    setupLevel3View();
    return;
  }
  showScreen("level4");
  setupLevel4View();
}

function completeAllLevelsFromTester() {
  state.level1Completed = true;
  state.level2Unlocked = true;
  state.level2Completed = true;
  state.level3Unlocked = true;
  state.level3Completed = true;
  state.level4Unlocked = true;
  state.level4Completed = true;
  state.clearedOnce.level1 = true;
  state.clearedOnce.level2 = true;
  state.clearedOnce.level3 = true;
  state.clearedOnce.level4 = true;
  state.clears = REQUIRED_CLEARS;
  if (!state.currentCaptcha) state.currentCaptcha = randomCaptcha();
  saveState();
  refreshMenuPanels();
}

function goToLevelFromMenu(level) {
  if (!isLevelSelectable(level)) return;
  if (level === 1) {
    state.clears = 0;
    state.currentCaptcha = randomCaptcha();
    state.level1Completed = false;
    state.level2Unlocked = false;
    state.level2Completed = false;
    state.level2Phase = 0;
    saveState();
    showScreen("level1");
    setupLevel1View();
    return;
  }
  if (level === 2) {
    state.level2Unlocked = true;
    state.level2Completed = false;
    state.level2Phase = 0;
    state.level3Unlocked = false;
    state.level3Completed = false;
    saveState();
    showScreen("level2");
    startLevel2();
    return;
  }
  if (level === 3) {
    state.level2Unlocked = true;
    state.level3Unlocked = true;
    state.level3Completed = false;
    state.level3Draft = "";
    state.level4Unlocked = false;
    state.level4Completed = false;
    saveState();
    showScreen("level3");
    setupLevel3View();
    return;
  }
  state.level2Unlocked = true;
  state.level3Unlocked = true;
  state.level4Unlocked = true;
  state.level4Completed = false;
  state.badges.blue = 0;
  state.badges.yellow = 0;
  state.badges.green = 0;
  state.badges.red = 0;
  state.badges.purple = 0;
  state.badges.rainbow = 0;
  saveState();
  showScreen("level4");
  setupLevel4View();
}

function getAdvancements() {
  const advancements = [
    { id: "captchaReader", name: "Captcha Reader", done: state.clearedOnce.level1 },
    { id: "wise", name: "WISE", done: state.clearedOnce.level2 },
    { id: "durableTypist", name: "Durable Typist", done: state.clearedOnce.level3 },
    { id: "rngBegginer", name: "RNG begginer", done: state.clearedOnce.level4 }
  ];

  if (RELEASE_LEVEL_CAP <= 4) {
    advancements.push({
      id: "prereleaseCompleter",
      name: "Prerelease completer",
      done: state.clearedOnce.level1 && state.clearedOnce.level2 && state.clearedOnce.level3 && state.clearedOnce.level4
    });
  }

  advancements.push({
    id: "rngApprentice",
    name: "RNG Apprentice",
    done: state.badges.rainbow > 0
  });
  advancements.push({
    id: "doctor",
    name: "Are you a doctor?",
    done: state.secretLevelCompleted
  });

  for (let i = 0; i < advancements.length; i += 1) {
    if (state.forcedAdvancements[advancements[i].id]) advancements[i].done = true;
  }
  return advancements;
}

function setupAdvancementsView() {
  const advancements = getAdvancements();
  const testerUnlocked = !testersPanel.classList.contains("hidden");
  advancementList.innerHTML = "";
  for (let i = 0; i < advancements.length; i += 1) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = `${advancements[i].name} - ${advancements[i].done ? "Unlocked" : "Locked"}`;
    text.style.color = advancements[i].done ? "#9ee1a4" : "#9a9a9a";
    if (testerUnlocked) {
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = Boolean(state.forcedAdvancements[advancements[i].id]);
      check.style.marginRight = "8px";
      check.addEventListener("change", () => {
        state.forcedAdvancements[advancements[i].id] = check.checked;
        saveState();
        setupAdvancementsView();
      });
      item.appendChild(check);
    }
    item.appendChild(text);
    advancementList.appendChild(item);
  }
}

function tryOpenTesterPanelByHotkey(event) {
  if (event.key !== "\\") return;
  const tagName = event.target && event.target.tagName ? event.target.tagName : "";
  if (tagName === "INPUT" || tagName === "TEXTAREA" || event.target?.isContentEditable) return;
  event.preventDefault();
  const typed = window.prompt("Enter testers password:");
  if (typed === TESTER_PASSWORD) {
    unlockTestersPanel();
  }
}

function randomLetter() {
  const idx = Math.floor(Math.random() * ALPHABET.length);
  return ALPHABET[idx];
}

function randomCaptcha() {
  let text = "";
  for (let i = 0; i < CAPTCHA_LENGTH; i += 1) text += randomLetter();
  return text;
}

function updateProgress() {
  progressText.textContent = `Progress: ${state.clears} / ${REQUIRED_CLEARS} clears`;
}

function drawCaptcha(text) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 12; i += 1) {
    ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3 + 0.1})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  const horizontalPadding = 64;
  const spacing = (canvas.width - horizontalPadding * 2) / text.length;
  for (let i = 1; i < text.length; i += 1) {
    const separatorX = horizontalPadding + i * spacing;
    ctx.beginPath();
    ctx.moveTo(separatorX, 18);
    ctx.lineTo(separatorX, canvas.height - 18);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const x = horizontalPadding + i * spacing + spacing / 2 + Math.random() * 4 - 2;
    const y = 88 + Math.random() * 14;
    const rot = (Math.random() - 0.5) * 0.32;
    const scaleX = 1 + (Math.random() - 0.5) * 0.22;
    const scaleY = 1 + (Math.random() - 0.5) * 0.22;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scaleX, scaleY);
    drawSymbolForLetter(char);
    ctx.restore();
  }
}

function regenerateCaptcha(msg, ok = false) {
  state.currentCaptcha = randomCaptcha();
  drawCaptcha(state.currentCaptcha);
  feedbackText.textContent = msg;
  feedbackText.style.color = ok ? "#8cff8c" : "#ff9f9f";
  input.value = "";
  saveState();
}

function setupLevel1View() {
  const hadCaptcha = Boolean(state.currentCaptcha);
  updateProgress();
  nextLevelBtn.classList.toggle("hidden", !state.level1Completed);
  if (!state.currentCaptcha) {
    state.currentCaptcha = randomCaptcha();
    saveState();
  }
  drawCaptcha(state.currentCaptcha);
  if (state.level1Completed) {
    input.disabled = true;
    submitBtn.disabled = true;
    feedbackText.style.color = "#7fffa5";
    feedbackText.textContent = "Level 1 cleared. Continue to Level 2.";
    showRewardCode();
  } else {
    input.disabled = false;
    submitBtn.disabled = false;
    rewardPanel.classList.add("hidden");
    feedbackText.style.color = "#9fd4ff";
    feedbackText.textContent = hadCaptcha ? "Progress restored after reload." : "Decode and enter the captcha.";
  }
}

function restartFromBeginning(message = "Failed. Restarting from the beginning.") {
  stopLevel2Phase();
  state.clears = 0;
  state.currentCaptcha = randomCaptcha();
  state.level1Completed = false;
  state.level2Unlocked = false;
  state.level2Completed = false;
  state.level2Phase = 0;
  state.level3Unlocked = false;
  state.level3Completed = false;
  state.level3Draft = "";
  state.level4Unlocked = false;
  state.level4Completed = false;
  state.badges.blue = 0;
  state.badges.yellow = 0;
  state.badges.green = 0;
  state.badges.red = 0;
  state.badges.purple = 0;
  state.badges.rainbow = 0;
  saveState();

  setupLevel1View();
  showScreen("menu");
  level2Feedback.style.color = "#ffb1b1";
  level2Feedback.textContent = message;
}

function resetLevel1ProgressOnly() {
  state.clears = 0;
  state.currentCaptcha = randomCaptcha();
  state.level1Completed = false;
  state.level2Unlocked = false;
  state.level2Completed = false;
  state.level2Phase = 0;
  saveState();
  updateProgress();
  drawCaptcha(state.currentCaptcha);
  rewardPanel.classList.add("hidden");
  nextLevelBtn.classList.add("hidden");
  feedbackText.style.color = "#ff9f9f";
  feedbackText.textContent = "Wrong answer. Level 1 progress reset.";
}

function completeLevel1() {
  state.level1Completed = true;
  state.level2Unlocked = true;
  state.clearedOnce.level1 = true;
  input.disabled = true;
  submitBtn.disabled = true;
  feedbackText.style.color = "#7fffa5";
  feedbackText.textContent = "Reward unlocked. Go to Fishing World, then click Next Level.";
  nextLevelBtn.classList.remove("hidden");
  showRewardCode();
  saveState();
}

function checkAnswer(event) {
  if (event && typeof event.button === "number" && event.button !== 0) return;
  if (input.disabled) return;
  const attempt = input.value.trim();
  if (attempt.length !== CAPTCHA_LENGTH) {
    feedbackText.style.color = "#ffb070";
    feedbackText.textContent = `Need exactly ${CAPTCHA_LENGTH} characters.`;
    return;
  }

  if (attempt.toUpperCase() === state.currentCaptcha) {
    state.clears += 1;
    updateProgress();
    if (state.clears >= REQUIRED_CLEARS) {
      completeLevel1();
      return;
    }
    regenerateCaptcha("Correct. New demon captcha generated.", true);
    return;
  }
  resetLevel1ProgressOnly();
  showScreen("menu");
}

function getPhasePalette(bgKey) {
  if (bgKey === "pink") return { bg: "#ff93c0", text: "#101010" };
  if (bgKey === "green") return { bg: "#39b26b", text: "#09150f" };
  if (bgKey === "red") return { bg: "#cf3232", text: "#fff1f1" };
  return { bg: "#111111", text: "#f7f7f7" };
}

function startLevel2() {
  if (!state.level2Unlocked) return;
  nextLevelFromL2Btn.classList.toggle("hidden", !state.level2Completed);
  if (state.level2Completed) {
    level2Progress.textContent = "Phase 10 / 10";
    phaseInstruction.textContent = "Level 2 cleared.";
    phaseTimer.textContent = "Done";
    level2Feedback.style.color = "#7fffa5";
    level2Feedback.textContent = `Level 2 cleared. Reward code: ${LEVEL2_REWARD_CODE}`;
    phaseActionBtn.disabled = true;
    return;
  }
  startLevel2Phase(state.level2Phase);
}

function stopLevel2Phase() {
  if (level2TimerHandle) clearTimeout(level2TimerHandle);
  if (level2TickHandle) clearInterval(level2TickHandle);
  level2TimerHandle = null;
  level2TickHandle = null;
}

function startLevel2Phase(index) {
  stopLevel2Phase();
  phaseLeftClicks = 0;
  phaseRightClicks = 0;
  state.level2Phase = index;
  saveState();

  const phase = LEVEL2_PHASES[index];
  const palette = getPhasePalette(phase.bg);
  phasePanel.style.background = palette.bg;
  phaseInstruction.style.color = phase.fg === "blue" ? "#2379ff" : palette.text;
  level2Progress.textContent = `Phase ${index + 1} / ${LEVEL2_PHASES.length}`;
  phaseInstruction.textContent = phase.text;
  level2Feedback.textContent = "";
  phaseActionBtn.disabled = false;

  const startAt = Date.now();
  phaseTimer.textContent = `${(PHASE_DURATION_MS / 1000).toFixed(1)}s`;
  level2TickHandle = setInterval(() => {
    const elapsed = Date.now() - startAt;
    const left = Math.max(0, (PHASE_DURATION_MS - elapsed) / 1000);
    phaseTimer.textContent = `${left.toFixed(1)}s`;
  }, 100);

  level2TimerHandle = setTimeout(() => {
    evaluateLevel2Phase(phase);
  }, PHASE_DURATION_MS);
}

function evaluateLevel2Phase(phase) {
  stopLevel2Phase();
  phaseActionBtn.disabled = true;
  let passed = false;

  if (phase.expected === "click") passed = phaseLeftClicks >= 1 && phaseRightClicks === 0;
  if (phase.expected === "noclick") passed = phaseLeftClicks === 0 && phaseRightClicks === 0;
  if (phase.expected === "click5") passed = phaseLeftClicks === 5 && phaseRightClicks === 0;
  if (phase.expected === "rightclick") passed = phaseRightClicks >= 1;
  if (phase.expected === "rng") passed = Math.random() >= 0.5;

  if (!passed) {
    restartFromBeginning("Phase failed. You restarted from the beginning.");
    return;
  }

  if (state.level2Phase >= LEVEL2_PHASES.length - 1) {
    state.level2Completed = true;
    state.level3Unlocked = true;
    state.clearedOnce.level2 = true;
    saveState();
    level2Feedback.style.color = "#7fffa5";
    level2Feedback.textContent = `Level 2 complete. Reward code: ${LEVEL2_REWARD_CODE}`;
    nextLevelFromL2Btn.classList.remove("hidden");
    phaseTimer.textContent = "Done";
    return;
  }

  state.level2Phase += 1;
  saveState();
  level2Feedback.style.color = "#a6e3ff";
  level2Feedback.textContent = "Phase clear.";
  setTimeout(() => startLevel2Phase(state.level2Phase), 700);
}

function setupLevel3View() {
  essayPrompt.textContent = LEVEL3_ESSAY;
  essayInput.value = state.level3Draft;
  essayInput.disabled = state.level3Completed;
  essaySubmitBtn.disabled = state.level3Completed;
  if (state.level3Completed) {
    level3Feedback.style.color = "#7fffa5";
    level3Feedback.textContent = `Level 3 complete. Reward code: ${LEVEL3_REWARD_CODE}`;
    nextLevelFromL3Btn.classList.remove("hidden");
  } else {
    level3Feedback.style.color = "#9fd4ff";
    level3Feedback.textContent = "Type the essay exactly and submit.";
    nextLevelFromL3Btn.classList.add("hidden");
  }
}

function submitEssay() {
  const typed = essayInput.value;
  state.level3Draft = typed;
  saveState();

  if (typed === SECRET_LEVEL_TRIGGER) {
    showScreen("secret");
    setupSecretLevelView();
    return;
  }

  const similarity = getTextSimilarity(typed, LEVEL3_ESSAY);
  if (similarity >= 0.95) {
    state.level3Completed = true;
    state.level4Unlocked = true;
    state.clearedOnce.level3 = true;
    saveState();
    essayInput.disabled = true;
    essaySubmitBtn.disabled = true;
    nextLevelFromL3Btn.classList.remove("hidden");
    level3Feedback.style.color = "#7fffa5";
    level3Feedback.textContent = `Level 3 complete. Accuracy: ${(similarity * 100).toFixed(1)}%. Reward code: ${LEVEL3_REWARD_CODE}`;
    return;
  }

  level3Feedback.style.color = "#ffb070";
  level3Feedback.textContent = `Something is incorrect. Accuracy: ${(similarity * 100).toFixed(1)}% (need 95%)`;
}

function blockLevel3Clipboard(event) {
  event.preventDefault();
}

function setupSecretLevelView() {
  secretWordInput.value = "";
  secretWordInput.disabled = state.secretLevelCompleted;
  secretWordSubmitBtn.disabled = state.secretLevelCompleted;
  if (state.secretLevelCompleted) {
    secretLevelFeedback.style.color = "#7fffa5";
    secretLevelFeedback.textContent = "Secret level complete. Advancement unlocked: Are you a doctor?";
    return;
  }
  secretLevelFeedback.style.color = "#9fd4ff";
  secretLevelFeedback.textContent = "Spell it perfectly to pass.";
}

function submitSecretWord() {
  if (state.secretLevelCompleted) return;
  const typed = secretWordInput.value.trim();
  if (typed === SECRET_LEVEL_WORD) {
    state.secretLevelCompleted = true;
    saveState();
    setupSecretLevelView();
    return;
  }
  secretLevelFeedback.style.color = "#ff9f9f";
  secretLevelFeedback.textContent = "Incorrect spelling. Try again.";
}

function getLevel4RollsPerClick() {
  if (state.badges.red > 0) return 20;
  if (state.badges.green > 0) return 5;
  if (state.badges.yellow > 0) return 2;
  return 1;
}

function getBadgeByRoll() {
  if (Math.floor(Math.random() * 100000) === 0) return "rainbow";
  if (Math.floor(Math.random() * 1000) === 0) return "purple";
  if (Math.floor(Math.random() * 300) === 0) return "red";
  if (Math.floor(Math.random() * 50) === 0) return "green";
  if (Math.floor(Math.random() * 10) === 0) return "yellow";
  return "blue";
}

function badgeLabel(badge) {
  if (badge === "rainbow") return "";
  if (badge === "purple") return "Purple";
  if (badge === "red") return "Red";
  if (badge === "green") return "Green";
  if (badge === "yellow") return "Yellow";
  return "Blue";
}

function setupLevel4View() {
  if (!state.level4Unlocked) return;
  badgeBlueCount.textContent = String(state.badges.blue);
  badgeYellowCount.textContent = String(state.badges.yellow);
  badgeGreenCount.textContent = String(state.badges.green);
  badgeRedCount.textContent = String(state.badges.red);
  badgePurpleCount.textContent = String(state.badges.purple);

  if (state.level4Completed) {
    rngRollBtn.disabled = true;
    level4UpgradeText.textContent = "Current button: Purple tier (you won)";
    level4Feedback.style.color = "#d7a7ff";
    level4Feedback.textContent = "Level 4 complete. You got a purple badge and beat RNG chaos.";
    return;
  }

  rngRollBtn.disabled = false;
  level4UpgradeText.textContent = `Current button: ${getLevel4RollsPerClick()} badge(s) per click`;
  level4Feedback.style.color = "#9fd4ff";
  level4Feedback.textContent = "Click ROLL BADGES and pray.";
}

function rollLevel4Badges() {
  if (state.level4Completed || !state.level4Unlocked) return;
  const rolls = getLevel4RollsPerClick();
  const got = [];

  for (let i = 0; i < rolls; i += 1) {
    const badge = getBadgeByRoll();
    state.badges[badge] += 1;
    if (badge !== "rainbow") got.push(badgeLabel(badge));
  }

  if (state.badges.purple > 0 || state.badges.rainbow > 0) {
    state.level4Completed = true;
    state.clearedOnce.level4 = true;
    saveState();
    setupLevel4View();
    level4Feedback.style.color = "#d7a7ff";
    level4Feedback.textContent = `You rolled: ${got.join(", ")}. A winning badge was unlocked. You win Level 4!`;
    return;
  }

  saveState();
  setupLevel4View();
  level4Feedback.style.color = "#a6e3ff";
  level4Feedback.textContent = `You rolled: ${got.join(", ")}.`;
}

function getTextSimilarity(a, b) {
  if (a === b) return 1;
  if (!a.length && !b.length) return 1;
  const distance = getLevenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.max(0, 1 - distance / maxLen);
}

function getLevenshteinDistance(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  let prev = new Array(cols);
  let curr = new Array(cols);

  for (let j = 0; j < cols; j += 1) prev[j] = j;

  for (let i = 1; i < rows; i += 1) {
    curr[0] = i;
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[cols - 1];
}

function showRewardCode() {
  rewardPanel.classList.remove("hidden");
  drawRewardCode(REWARD_CODE);
}

function drawRewardCode(text) {
  rewardCtx.clearRect(0, 0, rewardCanvas.width, rewardCanvas.height);
  rewardCtx.fillStyle = "#ffffff";
  rewardCtx.fillRect(0, 0, rewardCanvas.width, rewardCanvas.height);
  const padding = 30;
  const spacing = (rewardCanvas.width - padding * 2) / text.length;
  for (let i = 1; i < text.length; i += 1) {
    const separatorX = padding + i * spacing;
    rewardCtx.beginPath();
    rewardCtx.moveTo(separatorX, 16);
    rewardCtx.lineTo(separatorX, rewardCanvas.height - 16);
    rewardCtx.strokeStyle = "rgba(0, 0, 0, 0.18)";
    rewardCtx.lineWidth = 2;
    rewardCtx.stroke();
  }
  for (let i = 0; i < text.length; i += 1) {
    const x = padding + i * spacing + spacing / 2;
    const y = rewardCanvas.height / 2;
    rewardCtx.save();
    rewardCtx.translate(x, y);
    rewardCtx.scale(0.78, 0.78);
    drawRewardGlyph(text[i]);
    rewardCtx.restore();
  }
}

function drawRewardGlyph(char) {
  if (char === "Z") {
    strokeShapeReward([[0, -30], [28, -8], [18, 28], [-18, 28], [-28, -8]]);
    strokeShapeReward([[0, -14], [8, 2], [24, 4], [12, 16], [16, 32], [0, 22], [-16, 32], [-12, 16], [-24, 4], [-8, 2]]);
    return;
  }
  if (char === "S") return strokeShapeReward([[-6, -34], [16, -8], [6, -8], [20, 30], [-14, -2], [-4, -2]]);
  if (char === "W") {
    strokeShapeReward([[0, -32], [10, -8], [34, -8], [14, 8], [22, 30], [0, 16], [-22, 30], [-14, 8], [-34, -8], [-10, -8]]);
    strokeShapeReward([[-30, -2], [0, -2], [0, -10], [24, 0], [0, 10], [0, 2], [-30, 2]]);
    return;
  }
  if (char === "E") {
    rewardCtx.beginPath();
    rewardCtx.ellipse(0, 0, 20, 44, 0, 0, Math.PI * 2);
    rewardCtx.strokeStyle = "#000";
    rewardCtx.lineWidth = 4;
    rewardCtx.stroke();
    return;
  }
  if (char === "2") return strokeShapeReward([[-20, -24], [10, -24], [22, -10], [16, 2], [-18, 24], [24, 24]], false);
  if (char === "3") return strokeShapeReward([[-16, -24], [12, -24], [22, -10], [8, 0], [22, 10], [12, 24], [-16, 24]], false);
  if (char === "$") {
    strokeShapeReward([[0, -26], [0, 26]], false);
    strokeShapeReward([[16, -16], [-8, -20], [-16, -6], [10, 2], [16, 16], [-8, 20], [-16, 18]], false);
  }
}

function strokeShapeReward(points, close = true) {
  rewardCtx.beginPath();
  rewardCtx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) rewardCtx.lineTo(points[i][0], points[i][1]);
  if (close) rewardCtx.closePath();
  rewardCtx.strokeStyle = "#000";
  rewardCtx.lineWidth = 4;
  rewardCtx.stroke();
}

function drawSymbolForLetter(letter) {
  switch (letter) {
    case "A": return drawRect(34, 20);
    case "B": return drawDiamond(36);
    case "C": return drawRect(18, 44);
    case "D": return drawCircle(20);
    case "E": return drawVerticalOval(20, 44);
    case "F": return drawRightTriangle(40, "bl");
    case "G": return drawRightTriangle(40, "br");
    case "H": return drawRightTriangle(40, "tl");
    case "I": return drawRightTriangle(40, "tr");
    case "J": return drawTriangleUp(40);
    case "K": return drawStarOfDavid(42);
    case "L": return drawHexagon(22);
    case "M": return drawArrow("right");
    case "N": return drawArrow("left");
    case "O": return drawArrow("up");
    case "P": return drawArrow("down");
    case "Q": return drawFourPointStar(22);
    case "R": return drawJaggedStar(22);
    case "S": return drawLightning();
    case "T": return drawSkewedQuad();
    case "U": return drawOvalWithSquare();
    case "V": return drawBoltV();
    case "W": return drawStarWithArrow();
    case "X": return drawHexWithCloud();
    case "Y": return drawHourglass();
    case "Z": return drawPentagonWithStar();
    default: return drawRect(24, 24);
  }
}

function strokeShape(points, close = true) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  if (close) ctx.closePath();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawRect(w, h) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.strokeRect(-w / 2, -h / 2, w, h);
}

function drawCircle(r) {
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawVerticalOval(rx, ry) {
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawDiamond(size) { strokeShape([[0, -size], [size, 0], [0, size], [-size, 0]]); }
function drawTriangleUp(size) { strokeShape([[0, -size], [size, size], [-size, size]]); }
function drawRightTriangle(size, corner) {
  if (corner === "bl") return strokeShape([[-size, size], [-size, -size], [size, size]]);
  if (corner === "br") return strokeShape([[size, size], [-size, size], [size, -size]]);
  if (corner === "tl") return strokeShape([[-size, -size], [size, -size], [-size, size]]);
  return strokeShape([[size, -size], [-size, -size], [size, size]]);
}

function drawHexagon(r) {
  const points = [];
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    points.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  strokeShape(points);
}

function drawArrow(direction) {
  let pts;
  if (direction === "right") pts = [[-32, -10], [6, -10], [6, -22], [34, 0], [6, 22], [6, 10], [-32, 10]];
  else if (direction === "left") pts = [[32, -10], [-6, -10], [-6, -22], [-34, 0], [-6, 22], [-6, 10], [32, 10]];
  else if (direction === "up") pts = [[-10, 32], [-10, -6], [-22, -6], [0, -34], [22, -6], [10, -6], [10, 32]];
  else pts = [[-10, -32], [-10, 6], [-22, 6], [0, 34], [22, 6], [10, 6], [10, -32]];
  strokeShape(pts);
}

function drawFourPointStar(r) { strokeShape([[0, -r], [10, -10], [r, 0], [10, 10], [0, r], [-10, 10], [-r, 0], [-10, -10]]); }
function drawJaggedStar(r) { strokeShape([[0, -r], [10, -12], [24, -12], [14, 2], [20, 16], [4, 14], [0, 24], [-4, 14], [-20, 16], [-14, 2], [-24, -12], [-10, -12]]); }
function drawLightning() { strokeShape([[-6, -34], [16, -8], [6, -8], [20, 30], [-14, -2], [-4, -2]]); }
function drawSkewedQuad() { strokeShape([[-24, -20], [14, -30], [14, 20], [-24, 30]]); }
function drawOvalWithSquare() { drawVerticalOval(26, 40); drawRect(26, 26); }
function drawBoltV() { strokeShape([[-22, -24], [28, -30], [8, 8], [24, 8], [-12, 30], [0, -2], [-26, -2]]); }
function drawStarOfDavid(size) {
  strokeShape([[0, -size], [size * 0.85, size * 0.5], [-size * 0.85, size * 0.5]]);
  strokeShape([[0, size], [size * 0.85, -size * 0.5], [-size * 0.85, -size * 0.5]]);
}
function drawStarWithArrow() {
  strokeShape([[0, -32], [10, -8], [34, -8], [14, 8], [22, 30], [0, 16], [-22, 30], [-14, 8], [-34, -8], [-10, -8]]);
  strokeShape([[-30, -2], [0, -2], [0, -10], [24, 0], [0, 10], [0, 2], [-30, 2]]);
}
function drawHexWithCloud() {
  drawHexagon(28);
  ctx.beginPath();
  ctx.moveTo(-14, 8);
  ctx.bezierCurveTo(-24, 8, -24, -6, -10, -6);
  ctx.bezierCurveTo(-8, -16, 6, -16, 8, -8);
  ctx.bezierCurveTo(18, -8, 22, 2, 14, 8);
  ctx.closePath();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
}
function drawHourglass() {
  strokeShape([[0, -34], [16, 0], [0, 34], [-16, 0]]);
  strokeShape([[-28, 34], [28, 34], [0, -34]]);
}
function drawPentagonWithStar() {
  strokeShape([[0, -30], [28, -8], [18, 28], [-18, 28], [-28, -8]]);
  strokeShape([[0, -14], [8, 2], [24, 4], [12, 16], [16, 32], [0, 22], [-16, 32], [-12, 16], [-24, 4], [-8, 2]]);
}

submitBtn.addEventListener("click", checkAnswer);
submitBtn.addEventListener("auxclick", (event) => {
  event.preventDefault();
});
submitBtn.addEventListener("mousedown", (event) => {
  if (event.button !== 0) event.preventDefault();
});
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkAnswer();
});
continueBtn.addEventListener("click", continueGame);
toMenuFromL1Btn.addEventListener("click", () => showScreen("menu"));
toMenuFromL2Btn.addEventListener("click", () => showScreen("menu"));
nextLevelBtn.addEventListener("click", () => {
  showScreen("level2");
  startLevel2();
});
nextLevelFromL2Btn.addEventListener("click", () => {
  showScreen("level3");
  setupLevel3View();
});
toMenuFromL3Btn.addEventListener("click", () => showScreen("menu"));
nextLevelFromL3Btn.addEventListener("click", () => {
  showScreen("level4");
  setupLevel4View();
});
essaySubmitBtn.addEventListener("click", submitEssay);
essayInput.addEventListener("input", () => {
  state.level3Draft = essayInput.value;
  saveState();
});
essayInput.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && (event.key === "v" || event.key === "c" || event.key === "x")) {
    event.preventDefault();
  }
});
["copy", "cut", "paste", "drop"].forEach((name) => {
  level3Screen.addEventListener(name, blockLevel3Clipboard);
});
level3Screen.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
phaseActionBtn.addEventListener("click", () => { phaseLeftClicks += 1; });
phaseActionBtn.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  phaseRightClicks += 1;
});
rngRollBtn.addEventListener("click", rollLevel4Badges);
toMenuFromL4Btn.addEventListener("click", () => showScreen("menu"));
toMenuFromSecretBtn.addEventListener("click", () => showScreen("menu"));
secretWordSubmitBtn.addEventListener("click", submitSecretWord);
secretWordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitSecretWord();
});
menuLevel1Btn.addEventListener("click", () => goToLevelFromMenu(1));
menuLevel2Btn.addEventListener("click", () => goToLevelFromMenu(2));
menuLevel3Btn.addEventListener("click", () => goToLevelFromMenu(3));
menuLevel4Btn.addEventListener("click", () => goToLevelFromMenu(4));
openAdvancementsBtn.addEventListener("click", () => {
  setupAdvancementsView();
  showScreen("advancements");
});
toMenuFromAdvancementsBtn.addEventListener("click", () => showScreen("menu"));
testerLevel1Btn.addEventListener("click", () => goToLevelFromTester(1));
testerLevel2Btn.addEventListener("click", () => goToLevelFromTester(2));
testerLevel3Btn.addEventListener("click", () => goToLevelFromTester(3));
testerLevel4Btn.addEventListener("click", () => goToLevelFromTester(4));
testerCompleteAllBtn.addEventListener("click", completeAllLevelsFromTester);
document.addEventListener("keydown", tryOpenTesterPanelByHotkey);

loadState();
showScreen("menu");
setupLevel1View();
setupLevel3View();
setupLevel4View();
setupSecretLevelView();
setupAdvancementsView();
