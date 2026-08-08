export type Provider = "openai" | "anthropic" | "google" | "xai";

export type Tier = "flagship" | "balanced" | "budget";

export interface Model {
  id: string;
  provider: Provider;
  name: string;
  tier: Tier;
  /** USD per 1,000,000 input tokens */
  inputPricePerM: number;
  /** USD per 1,000,000 output tokens */
  outputPricePerM: number;
  /** Context window, in tokens */
  contextWindow: number;
  /** Roughly how many characters map to one token, used for the approximate tokenizer */
  charsPerToken: number;
}

export const PROVIDERS: Record<
  Provider,
  { label: string; short: string; color: string; pricingUrl: string }
> = {
  openai: {
    label: "OpenAI GPT",
    short: "GPT",
    color: "#10a37f",
    pricingUrl: "https://openai.com/api/pricing/",
  },
  anthropic: {
    label: "Anthropic Claude",
    short: "Claude",
    color: "#d97757",
    pricingUrl: "https://www.anthropic.com/pricing#api",
  },
  google: {
    label: "Google Gemini",
    short: "Gemini",
    color: "#4285f4",
    pricingUrl: "https://ai.google.dev/gemini-api/docs/pricing",
  },
  xai: {
    label: "xAI Grok",
    short: "Grok",
    color: "#7928ca",
    pricingUrl: "https://docs.x.ai/docs/models",
  },
};

/**
 * Curated flagship / balanced / budget tier per provider, kept intentionally
 * small (vs. a 30+ model spreadsheet) so the comparison stays readable.
 * Prices are USD per 1M tokens; verify against each provider's pricing page,
 * linked above, before making budget decisions.
 */
export const MODELS: Model[] = [
  // OpenAI
  { id: "gpt-5.5", provider: "openai", name: "GPT-5.5", tier: "flagship", inputPricePerM: 5.0, outputPricePerM: 30.0, contextWindow: 270_000, charsPerToken: 4 },
  { id: "gpt-5.4", provider: "openai", name: "GPT-5.4", tier: "balanced", inputPricePerM: 2.5, outputPricePerM: 15.0, contextWindow: 270_000, charsPerToken: 4 },
  { id: "gpt-5.4-nano", provider: "openai", name: "GPT-5.4 nano", tier: "budget", inputPricePerM: 0.2, outputPricePerM: 1.25, contextWindow: 270_000, charsPerToken: 4 },

  // Anthropic
  { id: "claude-opus-4.8", provider: "anthropic", name: "Claude Opus 4.8", tier: "flagship", inputPricePerM: 5.0, outputPricePerM: 25.0, contextWindow: 1_000_000, charsPerToken: 3.5 },
  { id: "claude-sonnet-4.6", provider: "anthropic", name: "Claude Sonnet 4.6", tier: "balanced", inputPricePerM: 3.0, outputPricePerM: 15.0, contextWindow: 1_000_000, charsPerToken: 3.5 },
  { id: "claude-haiku-4.5", provider: "anthropic", name: "Claude Haiku 4.5", tier: "budget", inputPricePerM: 1.0, outputPricePerM: 5.0, contextWindow: 200_000, charsPerToken: 3.5 },

  // Google
  { id: "gemini-3.1-pro", provider: "google", name: "Gemini 3.1 Pro", tier: "flagship", inputPricePerM: 2.0, outputPricePerM: 12.0, contextWindow: 2_000_000, charsPerToken: 4 },
  { id: "gemini-3.5-flash", provider: "google", name: "Gemini 3.5 Flash", tier: "balanced", inputPricePerM: 1.5, outputPricePerM: 9.0, contextWindow: 1_000_000, charsPerToken: 4 },
  { id: "gemini-3.1-flash-lite", provider: "google", name: "Gemini 3.1 Flash-Lite", tier: "budget", inputPricePerM: 0.25, outputPricePerM: 1.5, contextWindow: 1_000_000, charsPerToken: 4 },

  // xAI
  { id: "grok-4.5", provider: "xai", name: "Grok 4.5", tier: "flagship", inputPricePerM: 2.0, outputPricePerM: 6.0, contextWindow: 500_000, charsPerToken: 4 },
  { id: "grok-4.3", provider: "xai", name: "Grok 4.3", tier: "balanced", inputPricePerM: 1.25, outputPricePerM: 2.5, contextWindow: 1_000_000, charsPerToken: 4 },
  { id: "grok-4.1-fast", provider: "xai", name: "Grok 4.1 Fast", tier: "budget", inputPricePerM: 0.2, outputPricePerM: 0.5, contextWindow: 2_000_000, charsPerToken: 4 },
];

export const PRICING_LAST_VERIFIED = "2026-08-07";

export function modelsByProvider(provider: Provider): Model[] {
  return MODELS.filter((m) => m.provider === provider);
}

export function getModel(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}
