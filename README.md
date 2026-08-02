# 💌 Special Occasion / Love Page -Free Template

A romantic, animated one-page website you can send to someone special.
Includes a growing love tree, a typewriter love letter, a photo + video
gallery, background music, floating hearts, confetti, hidden easter
eggs, and a **secret message box** that delivers messages straight to
your phone (Discord, Telegram, email, or via a free Cloudflare Worker).

Everything is plain HTML + CSS + JavaScript -no frameworks, no
accounts needed to run it.

**Preview:** https://peace-full.github.io/love-page
---

## Hosting it online (free)

- **Cloudflare Pages** (easiest): https://pages.cloudflare.com → drag the
  whole folder in → you get a free `https://your-name.pages.dev` link.
- **GitHub Pages**: push this folder to a GitHub repo → Settings →
  Pages → deploy from the repo.
- **Netlify Drop**: https://app.netlify.com/drop → drag the folder in.
- Any other static hosting also works -no build step, no server needed.

---

## 🛠️ Do you need coding skills?

**A little.** The 90% case is just swapping files and text:

- **Photos + videos** → drop them into `photos/` and follow
  `photos/put-files-here.txt`.
- **Music** → drop songs into `music/` and follow
  `music/put-files-here.txt`.
- **Dates, names, the letter, the story** → open `index.html` and look
  for the lines starting with `<!--CHANGE THIS` -every editable spot
  is marked. Also open `main.js` for the date, playlist, and message
  box settings.

**A little HTML knowledge helps** for: adding new sections, styling
changes, or setting up the message box.

**Stuck? Use AI.** Copy any file into ChatGPT / Claude / Gemini and ask
for what you want.
---

## 📁 What each file does

| File | What it is | You usually edit it to change... |
|------|-----------|----------------------------------|
| `index.html` | The page itself (all sections, photos, video) | titles, dates, names, the letter, photos |
| `main.js` | Music player, counters, message box, easter eggs | the date, the playlist, message delivery |
| `style.css` | All the styling | colors, fonts, layout |
| `tree.js` | The growing tree animation | tree shape (or nothing -works as-is) |
| `workers/worker.js` | Optional Cloudflare Worker | only if you want the message box |
| `photos/`, `music/` | Your media | photos, videos, songs |

---

## 🎯 Quick customization checklist

1. `index.html` → title tag, header, and every `<!--CHANGE THIS` line.
2. `main.js` → `START_DATE` (the day counter + timer count from this).
3. `main.js` → `PLAYLIST` (songs).
4. `photos/` → your photos + `vid1.mp4`.
5. `main.js` → `MESSAGE_BACKEND` (see below).
6. `tree.js` → `memorialDate` (same date as step 2).
7. Test locally, then upload the whole folder.

> The card with the 💬❤️📞 icons (right of the timeline on desktop) is a
> free-form note -give it a title and write any little message to your
> love there.

---

## 📨 The secret message box -pick a delivery channel

When a visitor types in the "Send me a secret message" box (or taps a
"reasons" tag), the message can be delivered to you. Set `mode` in
`main.js → MESSAGE_BACKEND` to one of these:

| Mode | Where messages go | Server needed? | Setup effort |
|------|-------------------|----------------|--------------|
| `cloudflare` ⭐ | Discord + Telegram + email -all at once | Free Cloudflare Worker (~2 min) | Medium|
| `discord` | Your Discord server | No | Easy - create a webhook|
| `telegram` | Your Telegram | No | Easy - BotFather + get chat id |
| `formsubmit` | Your email | No | Easiest - just your email |
| `off` | Nowhere (animation only) | No | Nothing |

### Option A -Cloudflare Worker (recommended)

1. Deploy `workers/worker.js` (step-by-step instructions are at the top
   of that file -it takes ~2 minutes, no coding).
2. In the Worker's Settings add any of these variables:
   `DISCORD_WEBHOOK_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
   `RESEND_API_KEY` + `EMAIL_TO` (Resend is for email; free tier is fine).
3. Copy your Worker URL into `main.js`:

```js
cloudflare: { workerUrl: "https://your-worker.your-subdomain.workers.dev/send" }
```

The Worker forwards every message to **all** configured channels.
Your webhook URL / bot token never ends up in the website's source.

### Option B -Discord webhook (no server)

In your Discord server: Server Settings → Integrations → Webhooks →
Create Webhook → copy the URL, then in `main.js`:

```js
discord: { webhookUrl: "https://discord.com/api/webhooks/..." }
```

Messages appear in your server's channel. ⚠️ Anyone with the page source
can see this URL and post to your channel -fine for personal use, but
know that the worker option keeps secrets hidden.

### Option C -Telegram (no server)

1. Message `@BotFather` → `/newbot` → copy the token.
2. Message your new bot once, then message `@userinfobot` to get your
   chat ID (or use `@RawDataBot`).
3. In `main.js`:

```js
telegram: { botToken: "123456:ABC-...", chatId: "123456789" }
```

Same privacy note as Discord.

### Option D -Email via FormSubmit (no server, no signup)

```js
formsubmit: { email: "you@example.com" }
```

That's it -messages arrive as emails. (Free tier adds a one-time
"click to confirm" email on the first message.)

---

## 🎬 Video support

- The "Our Memories" section has a big video tile that plays a muted,
  looping clip -drop `vid1.mp4` (or `.webm`, keep it <10MB) into
  `photos/` and it works automatically. The tile starts playing when it
  scrolls into view.
- Autoplay respects mobile browser rules (muted + loop + playsinline,
  so it works on iPhones/Androids).
- You can add more videos, duplicate a tile in `index.html`, copy the
  `.video-tile` class, and point the `<video>` tag at your file.

---

## 🎵 Media credits (royalty-free)

The bundled music, photos and video are royalty-free under the
**Pixabay Content License** (https://pixabay.com/service/license-summary/)
:

| File | Credit |
|------|--------|
| `music/music1.mp3` | "Electric Guitar Love Emotional Type Trap Beat" by **onesevenbeatxs** -https://pixabay.com/music/search/onesevenbeatxs/ |
| `photos/vid1.mp4` | Couple in nature -https://pixabay.com/videos/couple-love-together-nature-lovers-243647/ |
| `photos/pic1.jpg` | Wedding beach couple -https://pixabay.com/photos/wedding-beach-young-couple-couple-1745240/ |
| `photos/pic2.jpg` | Couple illustration -https://pixabay.com/illustrations/couple-loving-sweet-lover-7259663/ |
| `photos/pic3.jpg` | Couple fun -https://pixabay.com/photos/couple-fun-love-play-smile-lovers-6589451/ |
| `photos/pic4.jpg` | Couple love kiss -https://pixabay.com/photos/couple-love-kiss-romantic-6706278/ |
| `photos/pic5.jpg` | Couple sunset silhouette -https://pixabay.com/photos/couple-sunset-silhouette-romance-6372387/ |

Full details in `THIRD_PARTY_NOTICES.md`. Replace these files with your
own photos/videos whenever you like -just keep the same filenames.

---

## ✨ Hidden easter eggs (keep or change)

- **Reasons tag with `data-easter="secret"`** → opens a secret message
  box with confetti when tapped. Edit the text in `index.html`
  (`id="secretEgg"`).
- **Tap the hearts in the footer 5 times** → secret popup. Edit the
  text in `main.js` (`initFooterEasterEgg`).
- **Type a word from `SECRET_WORDS` in the message box** (default:
  "love you", "forever", "always"...) → heart explosion. Edit the list
  at the top of `main.js`.

---

## ⚠️ Please read

- **License**: this template is MIT licensed (see `LICENSE`). Anyone may
  use, modify, and share it freely please keep the footer credit line
  and file headers (`template by Peace-full 💗`) when you remix it.
- **Tree animation credit**: the love-tree in `tree.js` is adapted from
  the open-source project **LoveTree** by 霸都丶傲天 (AJLoveChina):
  https://github.com/AJLoveChina/LoveTree see `THIRD_PARTY_NOTICES.md`.
  Please keep that attribution in `tree.js` too.
- **Don't redistribute copyrighted music** with the page (see
  `music/put-files-here.txt` for free sources).
- Don't include other people's photos/videos without permission.
- The "days counter" starts from the date in `main.js` (`START_DATE`)
  -the tree's date (`tree.js`) should match if you use it.

---

Made with ❤️ by [Peace-full](https://github.com/Peace-full) go make someone's day. 🌷

Love-tree animation adapted from [LoveTree](https://github.com/AJLoveChina/LoveTree) by 霸都丶傲天 (AJLoveChina).
