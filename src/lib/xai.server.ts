/**
 * LLM client for Coeus.
 * Prefers OpenAI when OPENAI_API_KEY is set; otherwise uses xAI when XAI_API_KEY is set.
 * Chat Completions-compatible for both.
 */
const OPENAI_BASE = "https://api.openai.com/v1";
const XAI_BASE = "https://api.x.ai/v1";

export function aiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY || process.env.XAI_API_KEY);
}

function resolveProvider(model: string): {
  base: string;
  apiKey: string;
  label: string;
  model: string;
} | null {
  const openaiKey = process.env.OPENAI_API_KEY;
  const xaiKey = process.env.XAI_API_KEY;
  const m = (model || "").toLowerCase();
  const wantsGrok = m.startsWith("grok");
  const wantsOpenAI =
    m.startsWith("gpt") || m.startsWith("o1") || m.startsWith("o3") || m.startsWith("chatgpt");

  if (wantsGrok && xaiKey) {
    return { base: XAI_BASE, apiKey: xaiKey, label: "xAI", model: model || "grok-4.5" };
  }
  if (wantsOpenAI && openaiKey) {
    return { base: OPENAI_BASE, apiKey: openaiKey, label: "OpenAI", model: model || "gpt-4o-mini" };
  }
  // Prefer OpenAI when both (or neither model prefix) and OpenAI key is present.
  if (openaiKey) {
    const fallback = wantsGrok ? "gpt-4o-mini" : model && !wantsGrok ? model : "gpt-4o-mini";
    return { base: OPENAI_BASE, apiKey: openaiKey, label: "OpenAI", model: fallback };
  }
  if (xaiKey) {
    const fallback = wantsOpenAI ? "grok-4.5" : model || "grok-4.5";
    return { base: XAI_BASE, apiKey: xaiKey, label: "xAI", model: fallback };
  }
  return null;
}

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatResult =
  | {
      ok: true;
      text: string;
      model: string;
      input_tokens: number;
      output_tokens: number;
      cost_cents: number;
    }
  | { ok: false; error: string };

function estimateCents(model: string, input: number, output: number) {
  const rates: Record<string, { in: number; out: number }> = {
    "gpt-4o-mini": { in: 0.15, out: 0.6 },
    "gpt-4o": { in: 2.5, out: 10 },
    "gpt-4.1-mini": { in: 0.4, out: 1.6 },
    "grok-4.5": { in: 3, out: 15 },
    "grok-4.7": { in: 2, out: 6 },
  };
  const r = rates[model] ?? { in: 1, out: 3 };
  return Math.max(0, (input / 1_000_000) * r.in * 100 + (output / 1_000_000) * r.out * 100);
}

export async function grokChat(opts: {
  model: string;
  messages: ChatMessage[];
  max_tokens: number;
  temperature?: number;
}): Promise<ChatResult> {
  const provider = resolveProvider(opts.model);
  if (!provider) {
    return {
      ok: false,
      error: "AI is not available. Set OPENAI_API_KEY or XAI_API_KEY in the environment.",
    };
  }

  const tryModel = async (model: string) => {
    const res = await fetch(`${provider.base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: opts.messages,
        max_tokens: opts.max_tokens,
        temperature: opts.temperature ?? 0.2,
      }),
    });
    return res;
  };

  let model = provider.model;
  let res = await tryModel(model);
  // Common fallbacks if the selected model id is not available on the account
  if (!res.ok && res.status === 404) {
    const fallback = provider.label === "OpenAI" ? "gpt-4o-mini" : "grok-4.5";
    if (model !== fallback) {
      model = fallback;
      res = await tryModel(model);
    }
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      ok: false,
      error: `${provider.label} API error ${res.status}${body ? `: ${body.slice(0, 220)}` : ""}`,
    };
  }
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };
  const text = json.choices?.[0]?.message?.content?.trim() ?? "";
  const input = json.usage?.prompt_tokens ?? 0;
  const output = json.usage?.completion_tokens ?? 0;
  return {
    ok: true,
    text,
    model: `${provider.label}:${model}`,
    input_tokens: input,
    output_tokens: output,
    cost_cents: estimateCents(model, input, output),
  };
}

export async function grokTts(
  text: string,
  voice = "alloy",
): Promise<{ ok: true; mime: string; b64: string } | { ok: false; error: string }> {
  // Prefer OpenAI TTS when available; xAI TTS only with XAI_API_KEY.
  const openaiKey = process.env.OPENAI_API_KEY;
  const xaiKey = process.env.XAI_API_KEY;
  const clipped = text.slice(0, 900);

  if (openaiKey) {
    const res = await fetch(`${OPENAI_BASE}/audio/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        input: clipped,
        voice: voice === "eve" ? "alloy" : voice,
      }),
    });
    if (!res.ok) {
      // Fallback to tts-1 if mini-tts unavailable
      const res2 = await fetch(`${OPENAI_BASE}/audio/speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({ model: "tts-1", input: clipped, voice: "alloy" }),
      });
      if (!res2.ok) return { ok: false, error: `OpenAI Voice API error ${res2.status}` };
      const buf = Buffer.from(await res2.arrayBuffer());
      return {
        ok: true,
        mime: res2.headers.get("content-type") || "audio/mpeg",
        b64: buf.toString("base64"),
      };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: true,
      mime: res.headers.get("content-type") || "audio/mpeg",
      b64: buf.toString("base64"),
    };
  }

  if (xaiKey) {
    const res = await fetch(`${XAI_BASE}/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${xaiKey}`,
      },
      body: JSON.stringify({ text: clipped, voice_id: voice, language: "en" }),
    });
    if (!res.ok) return { ok: false, error: `Voice API error ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: true,
      mime: res.headers.get("content-type") || "audio/mpeg",
      b64: buf.toString("base64"),
    };
  }

  return { ok: false, error: "Voice is not available. Set OPENAI_API_KEY or XAI_API_KEY." };
}
