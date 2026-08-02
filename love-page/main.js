/*
 * Template by Peace-full (https://github.com/Peace-full) -MIT licensed.
 * If you reuse or remix this page, please keep this credit.
 * The tree animation (tree.js) is adapted from AJLoveChina/LoveTree
 * (https://github.com/AJLoveChina/LoveTree) -see THIRD_PARTY_NOTICES.md.
 */
"use strict";

/* =========================================================================
   TEMPLATE SETTINGS -edit these and nothing else is needed to go live
   ========================================================================= */

// CHANGE THIS: your anniversary or relationship start date (YYYY-MM-DD)
const START_DATE = new Date("2024-01-01T00:00:00");

// MUSIC: put your song files in the music/ folder, then list them here
// Credits: "music/music1.mp3" -"Electric Guitar Love Emotional Type Trap
// Beat (prod by onesevenbeatxs)" by onesevenbeatxs -royalty-free via
// Pixabay Music (Pixabay Content License). See THIRD_PARTY_NOTICES.md.
const PLAYLIST = [
  // Supported: .mp3, .ogg, .wav, .m4a
  // "music/Your Song 1.mp3",
  "music/music1.mp3",
];

// MESSAGE BOX: how "Send" delivers messages to YOUR phone.
// Pick ONE mode:
//   "cloudflare"  → through your Cloudflare Worker (recommended -the most
//                   flexible; also lets you add Telegram + email at once).
//                   Deploy workers/worker.js first, then paste the URL below.
//   "discord"     → straight to a Discord webhook (no server needed).
//   "telegram"    → straight to Telegram via a bot (no server needed).
//   "formsubmit"  → straight to your EMAIL via formsubmit.co (no server needed).
//   "off"         → sending disabled; visitors just see the success animation.
const MESSAGE_BACKEND = {
  mode: "off",

  cloudflare: {
    workerUrl: "https://your-worker.your-subdomain.workers.dev/send",
  },

  discord: {
    webhookUrl: "YOUR_DISCORD_WEBHOOK_URL",
  },

  telegram: {
    botToken: "YOUR_BOT_TOKEN",
    chatId: "YOUR_CHAT_ID",
  },

  formsubmit: {
    email: "you@example.com",
  },
};

/* =========================================================================
   END OF SETTINGS -everything below is the actual code
   ========================================================================= */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let currentTrack = 0;
let musicStarted = false;
let musicStarting = false;

window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 1500);
});

function initFloatingHearts() {
  if (REDUCED_MOTION) return;
  const container = document.getElementById("floatingHearts");
  const emojis = ["💕", "💖", "💗", "💌", "✨", "🌸", "🌷"];
  for (let i = 0; i < 16; i++) {
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = (Math.random() * 12 + 11) + "px";
    h.style.animationDuration = (Math.random() * 20 + 15) + "s";
    h.style.animationDelay = Math.random() * 20 + "s";
    container.appendChild(h);
  }
}

function initParticles() {
  if (REDUCED_MOTION) return;
  const container = document.getElementById("particles");
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.width = p.style.height = (Math.random() * 4 + 2) + "px";
    p.style.animationDuration = (Math.random() * 15 + 10) + "s";
    p.style.animationDelay = Math.random() * 15 + "s";
    container.appendChild(p);
  }
}

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.prototype.indexOf.call(reveals, entry.target);
        entry.target.style.transitionDelay = Math.min(index * 45, 400) + "ms";
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

function calculateDays() {
  const today = new Date();
  const diffTime = Math.abs(today - START_DATE);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const el = document.getElementById("daysCount");
  let current = 0;
  const increment = Math.ceil(diffDays / 60);
  const timer = setInterval(() => {
    current += increment;
    if (current >= diffDays) { current = diffDays; clearInterval(timer); }
    el.textContent = current.toLocaleString();
  }, 30);
}

function updateDetailedTime() {
  const startMs = START_DATE.getTime();
  const now = Date.now();
  const diff = now - startMs;

  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;

  const totalSeconds = Math.floor(diff / 1000);
  const todaySeconds = totalSeconds % secondsPerDay;
  const days = Math.floor(totalSeconds / secondsPerDay);
  const hours = Math.floor(todaySeconds / secondsPerHour);
  const minutes = Math.floor((todaySeconds % secondsPerHour) / secondsPerMinute);
  const seconds = todaySeconds % secondsPerMinute;

  document.getElementById("tDays").textContent = String(days);
  document.getElementById("tHours").textContent = String(hours).padStart(2, "0");
  document.getElementById("tMinutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("tSeconds").textContent = String(seconds).padStart(2, "0");
}

function charDelay(char, base) {
  if ("…".includes(char)) return base * 12;
  if ("。！？.!?".includes(char)) return base * 10;
  if ("，、；：,;:".includes(char)) return base * 5;
  return base + Math.random() * base * 0.5;
}

let isLetterVisible = false;
let typewriterFinished = false;

async function typewriter(el, speed = 70) {
  el.style.display = "block";
  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.textContent = "_";

  const lines = [];
  const paragraphs = el.querySelectorAll("p");
  for (const p of paragraphs) {
    lines.push({ p, html: p.innerHTML, text: p.textContent });
    p.innerHTML = "";
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const wrapper = document.createElement("span");
    line.p.appendChild(wrapper);
    line.p.appendChild(cursor);

    for (const char of line.text) {
      while (!isLetterVisible) {
        await new Promise(r => setTimeout(r, 200));
      }

      wrapper.textContent += char;
      await new Promise(r => setTimeout(r, charDelay(char, speed)));
    }

    wrapper.innerHTML = line.html;
    if (i < lines.length - 1) {
      await new Promise(r => setTimeout(r, speed * 8));
    }
  }

  cursor.classList.add("typewriter-cursor--done");
  await new Promise(r => setTimeout(r, 3600));
  cursor.remove();

  typewriterFinished = true;
}

let typewriterRunning = false;
async function runTypewriter() {
  if (typewriterRunning) return;
  typewriterRunning = true;
  const letter = document.getElementById("loveLetter");
  try {
    await typewriter(letter, 70);
  } finally {
    typewriterRunning = false;
  }
}

function replayTypewriter() {
  if (typewriterRunning) return;
  typewriterFinished = false;
  runTypewriter();
}

function showLove() {
  const msg = document.getElementById("loveMessage");
  msg.style.display = "block";
  createHeartBurst();
  fireConfetti();
}

function showHug() {
  const msg = document.getElementById("hugMessage");
  msg.style.display = "block";
  setTimeout(() => { msg.style.display = "none"; }, 3000);
  fireConfetti();
}

/* -------- music -------- */

function initMusicSystem() {
  const audio = document.getElementById("bgMusic");
  const disc = document.getElementById("musicDisc");
  const info = document.getElementById("discInfo");

  if (disc) {
    disc.addEventListener("click", toggleMusic);
    disc.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMusic(); }
    });
  }

  if (!audio || PLAYLIST.length === 0) return;

  function getTrackName(path) {
    return path.replace("music/", "").replace(".mp3", "").replace(/_/g, " ");
  }

  function loadTrack(index, silent) {
    currentTrack = index % PLAYLIST.length;
    audio.src = PLAYLIST[currentTrack];
    audio.load();
    if (info && !silent) {
      info.textContent = `♪ ${getTrackName(PLAYLIST[currentTrack])}`;
    }
  }

  let userPaused = false;
  let pausedByBackground = false;
  let resumeAfterBackground = null;

  function setPlayingUI() {
    disc.classList.add("spinning");
    disc.classList.remove("paused", "attention");
    if (info) info.textContent = `♪ ${getTrackName(PLAYLIST[currentTrack])}`;
  }

  function setPausedUI() {
    disc.classList.remove("spinning", "attention");
    disc.classList.add("paused");
    if (info) info.textContent = "paused 💕";
  }

  function clearBackgroundResume() {
    if (resumeAfterBackground) {
      document.removeEventListener("pointerdown", resumeAfterBackground);
      resumeAfterBackground = null;
    }
  }

  function startMusic() {
    if (musicStarted || musicStarting) return;
    musicStarting = true;
    loadTrack(0, true);
    audio.play().then(() => {
      musicStarted = true;
      musicStarting = false;
      setPlayingUI();
    }).catch(() => {
      if (!musicStarted) {
        musicStarting = false;
      }
    });
  }

  function toggleMusic() {
    if (!musicStarted) {
      startMusic();
      return;
    }
    if (audio.paused) {
      clearBackgroundResume();
      userPaused = false;
      pausedByBackground = false;
      audio.play().catch(() => {});
      setPlayingUI();
    } else {
      audio.pause();
      userPaused = true;
      pausedByBackground = false;
      setPausedUI();
    }
  }

  audio.onended = () => {
    if (PLAYLIST.length === 1) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    loadTrack(currentTrack + 1);
    if (musicStarted) {
      audio.play().catch(() => {});
    }
  };

  let errorStreak = 0;
  audio.onerror = () => {
    errorStreak++;
    if (PLAYLIST.length <= 1 || errorStreak >= PLAYLIST.length * 2) {
      if (info) info.textContent = "no music files found 🎵";
      disc.style.opacity = "0.5";
      return;
    }
    loadTrack(currentTrack + 1);
    if (musicStarted) audio.play().catch(() => {});
  };

  function pauseForBackground() {
    if (!musicStarted || audio.paused || userPaused) return;
    audio.pause();
    pausedByBackground = true;
    setPausedUI();
    if (!resumeAfterBackground) {
      resumeAfterBackground = () => {
        if (!pausedByBackground) return;
        pausedByBackground = false;
        resumeAfterBackground = null;
        audio.play().then(() => {
          setPlayingUI();
        }).catch(() => {});
      };
      document.addEventListener("pointerdown", resumeAfterBackground, { once: true, passive: true });
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseForBackground();
  });

  window.addEventListener("pagehide", pauseForBackground);

  document.addEventListener("pointerdown", () => {
    if (musicStarted) return;
    musicStarting = false;
    startMusic();
  }, { once: true, passive: true });

  startMusic();

  setTimeout(() => {
    if (!musicStarted) {
      disc.classList.add("attention");
      if (info) info.textContent = "tap to start 💕";
    }
  }, 5000);
}

/* -------- message delivery (the "Send" box + tag taps) -------- */

function postJSON(url, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).finally(() => clearTimeout(timer));
}

function deliverMessage(text) {
  const cfg = MESSAGE_BACKEND;
  switch (cfg.mode) {
    case "cloudflare":
      return postJSON(cfg.cloudflare.workerUrl, { message: text });
    case "discord":
      return postJSON(cfg.discord.webhookUrl, { content: text });
    case "telegram":
      return postJSON(`https://api.telegram.org/bot${cfg.telegram.botToken}/sendMessage`, {
        chat_id: cfg.telegram.chatId,
        text,
      });
    case "formsubmit":
      return postJSON(`https://formsubmit.co/ajax/${cfg.formsubmit.email}`, {
        _subject: "💌 New message from your website",
        message: text,
      });
    default:
      // mode "off" pretend success, show the fun animation only
      return Promise.resolve({ ok: true });
  }
}

function notifyTagTapped(tagText) {
  return deliverMessage(`💝 They tapped a reason they adore you:\n\n"${tagText}"\n\n${new Date().toLocaleString()}`);
}

/* -------- "reasons" tags -------- */

function popTag(el) {
  el.classList.remove("tag-pop");
  void el.offsetWidth; // restart the animation
  el.classList.add("tag-pop");
  createMiniHeart(el);
  notifyTagTapped(el.textContent.trim()).catch(console.error);
}

function triggerSecretEasterEgg() {
  const egg = document.getElementById("secretEgg");
  if (egg && !egg.classList.contains("show")) {
    egg.classList.add("show");
    fireConfetti();
    createHeartBurst();
    setTimeout(() => {
      egg.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }
}

function initTags() {
  const tagsBox = document.getElementById("tagsBox");
  if (!tagsBox) return;
  tagsBox.addEventListener("click", (e) => {
    const tag = e.target.closest(".tag");
    if (!tag) return;
    popTag(tag);
    if (tag.dataset.easter === "secret") triggerSecretEasterEgg();
  });
  tagsBox.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tag = e.target.closest(".tag");
    if (!tag) return;
    e.preventDefault();
    tag.click();
  });
}

/* -------- Footer hidden easter eggs -------- */

let footerTapCount = 0;
let footerTimer = null;
function initFooterEasterEgg() {
  const footer = document.getElementById("footerHearts");
  if (!footer) return;
  const trigger = () => {
    footerTapCount++;
    if (footerTimer) clearTimeout(footerTimer);
    footerTimer = setTimeout(() => { footerTapCount = 0; }, 3000);
    if (footerTapCount === 5) {
      footerTapCount = 0;
      const egg = document.createElement("div");
      egg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(255,253,248,0.97);padding:30px;border-radius:18px;z-index:10000;text-align:center;box-shadow:0 20px 60px rgba(60,40,25,0.25);border:2px solid rgba(150,64,79,0.25);max-width:320px;animation:eggReveal 0.6s cubic-bezier(0.34,1.56,0.64,1);";
      egg.innerHTML = `
        <div style="font-size:40px;margin-bottom:12px;">💕🎀💕</div>
        <div style="font-family:'Caveat',cursive;font-size:24px;color:#96404f;line-height:1.5;">
          You found my secret message...<br>
          [your hidden words here] 🌙💗
        </div>
        <div style="font-size:30px;margin-top:12px;">💝 💖 💗</div>
        <button onclick="this.parentElement.remove()" style="margin-top:16px;padding:10px 24px;border:none;border-radius:12px;background:#c15b6b;color:white;font-family:'Caveat',cursive;font-weight:700;font-size:18px;cursor:pointer;">close 💕</button>
      `;
      document.body.appendChild(egg);
      fireConfetti();
      createHeartBurst();
    }
  };
  footer.addEventListener("click", trigger);
  footer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      trigger();
    }
  });
}

/* -------- little visual helpers -------- */

function createMiniHeart(el) {
  if (REDUCED_MOTION) return;
  const rect = el.getBoundingClientRect();
  const h = document.createElement("div");
  h.textContent = "💕";
  h.style.cssText = "position:fixed;left:" + (rect.left + rect.width/2) + "px;top:" + rect.top + "px;font-size:18px;pointer-events:none;z-index:9998;transition:all 0.8s ease-out;";
  document.body.appendChild(h);
  requestAnimationFrame(() => { h.style.transform = "translateY(-60px) scale(0)"; h.style.opacity = "0"; });
  setTimeout(() => h.remove(), 800);
}

function createHeartBurst() {
  if (REDUCED_MOTION) return;
  for (let i = 0; i < 14; i++) {
    const h = document.createElement("div");
    h.className = "heart-burst";
    h.textContent = ["💕","💖","💗","💝","💘","🎀"][Math.floor(Math.random()*6)];
    h.style.left = "50%";
    h.style.top = "50%";
    document.body.appendChild(h);
    requestAnimationFrame(() => {
      const angle = (Math.PI * 2 * i) / 14;
      const dist = 90 + Math.random() * 110;
      h.style.transform = "translate(" + Math.cos(angle)*dist + "px, " + Math.sin(angle)*dist + "px) scale(0)";
      h.style.opacity = "0";
    });
    setTimeout(() => h.remove(), 1000);
  }
}

function fireConfetti() {
  if (REDUCED_MOTION) return;
  const colors = ["#c15b6b","#ecc3ca","#e9b98c","#d3a04e","#a99ac4","#9fb093","#8ea7c2","#96404f"];
  for (let i = 0; i < 45; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.width = (Math.random() * 7 + 4) + "px";
    c.style.height = (Math.random() * 7 + 4) + "px";
    c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    c.style.animation = "confettiFall " + (Math.random() * 2 + 2) + "s linear forwards";
    c.style.animationDelay = Math.random() * 0.5 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/* gentle drifting orbs + scroll parallax, driven in one rAF loop */
function initOrbMotion() {
  if (REDUCED_MOTION) return;
  const orbs = [...document.querySelectorAll(".orb")];
  if (!orbs.length) return;
  const start = Date.now();
  let lastY = 0;
  function tick() {
    const t = (Date.now() - start) / 1000;
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const amp = 16 + i * 9;
      const speed = 0.16 + i * 0.05;
      const phase = i * 1.8;
      const dx = Math.sin(t * speed + phase) * amp;
      const dy = Math.cos(t * speed * 0.75 + phase) * amp * 0.6 + y * (0.05 + i * 0.035);
      orb.style.transform = "translate3d(" + dx + "px, " + dy + "px, 0)";
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* little hearts that follow the cursor on desktop */
function initHeartTrail() {
  if (REDUCED_MOTION) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  const emojis = ["💕", "💗", "🌷", "✨"];
  let last = 0;
  document.addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - last < 90) return;
    last = now;
    const h = document.createElement("span");
    h.className = "trail-heart";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = e.clientX + "px";
    h.style.top = e.clientY + "px";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }, { passive: true });
}

/* CHANGE THIS: words that make the page explode with hearts when typed
   in the secret message box */
const SECRET_WORDS = ["love you", "forever", "always", "miss you", "i love you"];

function checkSecretKeywords(msg) {
  const lower = msg.toLowerCase();
  const match = SECRET_WORDS.find(k => lower.includes(k));
  if (match) {
    setTimeout(() => {
      fireConfetti();
      createHeartBurst();
      const flashMsg = document.createElement("div");
      flashMsg.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:40px;z-index:10001;pointer-events:none;animation:eggReveal 1.5s ease-out forwards;text-align:center;font-family:'Caveat',cursive;color:#96404f;";
      flashMsg.innerHTML = "💕 right back at you! 💕";
      document.body.appendChild(flashMsg);
      setTimeout(() => flashMsg.remove(), 2000);
    }, 500);
  }
}

async function sendMessage() {
  const textarea = document.getElementById("secretMsg");
  const status = document.getElementById("msgStatus");
  const msg = textarea.value.trim();

  if (!msg) {
    status.textContent = "💭 type something first, silly!";
    status.className = "msg-status error";
    return;
  }

  checkSecretKeywords(msg);

  status.textContent = "📡 sending...";
  status.className = "msg-status sending";

  try {
    const response = await deliverMessage(`💌 New message from your website!\n\n${msg}\n\n${new Date().toLocaleString()}`);

    if (response.ok) {
      status.textContent = MESSAGE_BACKEND.mode === "off"
        ? "✅ done! (pick a delivery channel in main.js to get it on your phone)"
        : "✅ message delivered!";
      status.className = "msg-status success";
      textarea.value = "";
      fireConfetti();
      createHeartBurst();
    } else {
      throw new Error("HTTP " + response.status);
    }
  } catch (err) {
    const aborted = err && err.name === "AbortError";
    status.textContent = aborted
      ? "⏱️ taking too long - check your webhook/token, then try again!"
      : /^HTTP \d+$/.test(String(err.message))
        ? `❌ failed (HTTP ${String(err.message).slice(5)}) - check the URL/token in main.js`
        : "❌ failed to send. try again!";
    status.className = "msg-status error";
    console.error(err);
  }
}

/* -------- autoplay for video tiles (muted loop clips) -------- */

function initVideoTiles() {
  document.querySelectorAll(".video-tile video").forEach((video) => {
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    video.addEventListener("click", () => {
      if (video.paused) video.play().catch(() => {});
    });
    video.addEventListener("loadeddata", tryPlay);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tryPlay();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    observer.observe(video);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initFloatingHearts();
  initParticles();
  initScrollReveal();
  calculateDays();
  updateDetailedTime();
  setInterval(updateDetailedTime, 1000);
  initVideoTiles();

  const letterEl = document.getElementById("loveLetter");
  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isLetterVisible = entry.isIntersecting;
      if (isLetterVisible && !typewriterRunning && !typewriterFinished) {
        runTypewriter();
      }
    });
  }, { threshold: 0.2 });

  if (letterEl) letterObserver.observe(letterEl);

  const replayBtn = document.getElementById("replayBtn");
  if (replayBtn) replayBtn.addEventListener("click", replayTypewriter);

  const treeBtn = document.getElementById("treeTriggerBtn");
  if (treeBtn) treeBtn.addEventListener("click", triggerTreeGrowth);

  const loveBtn = document.getElementById("loveBtn");
  if (loveBtn) loveBtn.addEventListener("click", showLove);

  const hugBtn = document.getElementById("hugBtn");
  if (hugBtn) hugBtn.addEventListener("click", showHug);

  const sendBtn = document.getElementById("sendBtn");
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);

  const msgBox = document.getElementById("secretMsg");
  if (msgBox) {
    msgBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  initTags();
  initFooterEasterEgg();
  initMusicSystem();
  initOrbMotion();
  initHeartTrail();
});
