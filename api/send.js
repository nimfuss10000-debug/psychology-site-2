export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, topic } = req.body || {};

    if (!name || !phone || !topic) {
      return res.status(400).json({ ok: false, error: 'Missing fields' });
    }

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: 'Server misconfigured' });
    }

    const text = `
💬 Нова заявка:
👤 Ім’я: ${name}
📱 Контакт: ${phone}
📝 Запит: ${topic}
`;

    const tgResp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });

    if (!tgResp.ok) {
      const err = await tgResp.text();
      return res.status(502).json({ ok: false, error: `Telegram error: ${err}` });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
