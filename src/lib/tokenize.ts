import type { Model } from "../data/models";

interface GptEncoder {
  encode: (text: string) => number[];
}

let gptEncoder: GptEncoder | null = null;
let gptEncoderPromise: Promise<GptEncoder> | null = null;

/** Lazily loads the o200k_base rank data (~2MB) only when a GPT count is actually requested. */
async function loadGptEncoder(): Promise<GptEncoder> {
  if (gptEncoder) return gptEncoder;
  if (!gptEncoderPromise) {
    gptEncoderPromise = (async () => {
      const [{ Tiktoken }, { default: o200k }] = await Promise.all([
        import("js-tiktoken"),
        import("js-tiktoken/ranks/o200k_base"),
      ]);
      gptEncoder = new Tiktoken(o200k);
      return gptEncoder;
    })();
  }
  return gptEncoderPromise;
}

/**
 * Approximates BPE-style sub-word splitting: words split into ~charsPerToken
 * chunks, punctuation/symbols each count as their own token. This is closer
 * to real tokenizer behavior than a flat characters/4 estimate, though it
 * is still an approximation for providers with no public JS tokenizer.
 */
function approximateTokenCount(text: string, charsPerToken: number): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const chunks = trimmed.match(/[\p{L}\p{N}']+|[^\s\p{L}\p{N}']/gu) ?? [];
  let count = 0;
  for (const chunk of chunks) {
    if (/^[\p{L}\p{N}']+$/u.test(chunk)) {
      count += Math.max(1, Math.ceil(chunk.length / charsPerToken));
    } else {
      count += 1;
    }
  }
  return count;
}

export interface TokenCountResult {
  count: number;
  /** True when this came from a real tokenizer rather than a heuristic. */
  exact: boolean;
}

/**
 * Counts tokens for the given text against a specific model's tokenizer.
 * OpenAI models get an exact tiktoken (o200k_base) count; every other
 * provider falls back to the sub-word approximation, since none of them
 * ship a public JS tokenizer.
 */
export async function countTokens(text: string, model: Model): Promise<TokenCountResult> {
  if (!text.trim()) return { count: 0, exact: model.provider === "openai" };

  if (model.provider === "openai") {
    try {
      const enc = await loadGptEncoder();
      if (enc) return { count: enc.encode(text).length, exact: true };
    } catch {
      // fall through to the approximation if the encoder fails to load (e.g. offline)
    }
  }

  return { count: approximateTokenCount(text, model.charsPerToken), exact: false };
}

/** Universal words → tokens conversion (~0.75 words per token), used when the user enters a word count directly. */
export function tokensFromWordCount(words: number): number {
  return Math.round(words / 0.75);
}

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
