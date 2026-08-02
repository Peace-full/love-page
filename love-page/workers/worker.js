/**
 * 💌 Cloudflare Worker -the delivery relay for the "Send me a secret message"
 * box (and the tag-tap notifications).
 *
 * This Worker receives messages from your website and forwards them to
 * EVERY channel you configure below -Discord, Telegram, and/or email.
 * No server of your own is needed; Cloudflare runs this for free.
 *
 * ─── HOW TO DEPLOY (about 2 minutes, no coding) ─────────────────────────
 * 1. Go to https://dash.cloudflare.com → Workers & Pages → Create → Worker
 * 2. Give it a name (e.g. "love-messages") and hit Deploy
 * 3. Click "Edit code", delete everything, paste this whole file, Save & Deploy
 * 4. Click "Settings" → "Variables and Secrets" and add the ones you want:
 *
 *    DISCORD_WEBHOOK_URL   → your Discord webhook URL (create in Discord:
 *                            Server Settings → Integrations → Webhooks)
 *    TELEGRAM_BOT_TOKEN    → from @BotFather on Telegram
 *    TELEGRAM_CHAT_ID      → from @userinfobot (or message your bot first)
 *    RESEND_API_KEY        → from https://resend.com (free tier) for email
 *    EMAIL_TO              → the email address messages should go to
 *
 * 5. Done! Copy your Worker URL (e.g. https://love-messages.NAME.workers.dev)
 *    into main.js → MESSAGE_BACKEND.cloudflare.workerUrl (add /send at the end)
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    // Browser pre-flight check (the page calls this Worker from a different domain)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "only POST is allowed" }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "body must be valid JSON" }, 400);
    }

    const message = String(payload.message || payload.content || "").trim();
    if (!message) {
      return json({ ok: false, error: "message is required" }, 400);
    }

    const results = [];

    if (env.DISCORD_WEBHOOK_URL) {
      results.push(await sendToDiscord(env.DISCORD_WEBHOOK_URL, message));
    }

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      results.push(await sendToTelegram(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, message));
    }

    if (env.RESEND_API_KEY && env.EMAIL_TO) {
      results.push(await sendEmail(env.RESEND_API_KEY, env.EMAIL_TO, message));
    }

    const anyConfigured = results.length > 0;
    const allOk = anyConfigured && results.every((r) => r.ok);

    return json(
      {
        ok: allOk,
        note: anyConfigured
          ? "sent to all configured channels"
          : "no channels configured -add DISCORD_WEBHOOK_URL, TELEGRAM_*, or RESEND_API_KEY in Worker settings",
        results,
      },
      allOk ? 200 : 500
    );
  },
};

async function sendToDiscord(webhookUrl, message) {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    return { channel: "discord", ok: res.ok, status: res.status };
  } catch (err) {
    return { channel: "discord", ok: false, error: String(err) };
  }
}

async function sendToTelegram(botToken, chatId, message) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message }),
    });
    return { channel: "telegram", ok: res.ok, status: res.status };
  } catch (err) {
    return { channel: "telegram", ok: false, error: String(err) };
  }
}

async function sendEmail(resendApiKey, to, message) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Your Website <onboarding@resend.dev>", // change to your verified sender domain
        to: [to],
        subject: "💌 New message from your website",
        text: message,
      }),
    });
    return { channel: "email", ok: res.ok, status: res.status };
  } catch (err) {
    return { channel: "email", ok: false, error: String(err) };
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
