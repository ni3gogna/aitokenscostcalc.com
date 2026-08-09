export type Provider = "openai" | "anthropic" | "google" | "xai" | "deepseek" | "mistral" | "meta";

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
  deepseek: {
    label: "DeepSeek",
    short: "DeepSeek",
    color: "#4d6bfe",
    pricingUrl: "https://api-docs.deepseek.com/quick_start/pricing",
  },
  mistral: {
    label: "Mistral AI",
    short: "Mistral",
    color: "#fa520f",
    pricingUrl: "https://mistral.ai/pricing",
  },
  meta: {
    label: "Meta Llama (via Groq)",
    short: "Llama",
    color: "#0081fb",
    pricingUrl: "https://groq.com/pricing",
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

  // DeepSeek — no first-party budget tier; V4-Flash already sits at the low end.
  { id: "deepseek-v4-pro", provider: "deepseek", name: "DeepSeek V4-Pro", tier: "flagship", inputPricePerM: 0.435, outputPricePerM: 0.87, contextWindow: 1_000_000, charsPerToken: 4 },
  { id: "deepseek-v4-flash", provider: "deepseek", name: "DeepSeek V4-Flash", tier: "budget", inputPricePerM: 0.14, outputPricePerM: 0.28, contextWindow: 1_000_000, charsPerToken: 4 },

  // Mistral
  { id: "mistral-medium-3.5", provider: "mistral", name: "Mistral Medium 3.5", tier: "flagship", inputPricePerM: 1.5, outputPricePerM: 7.5, contextWindow: 262_144, charsPerToken: 4 },
  { id: "mistral-large-3", provider: "mistral", name: "Mistral Large 3", tier: "balanced", inputPricePerM: 0.5, outputPricePerM: 1.5, contextWindow: 262_144, charsPerToken: 4 },
  { id: "mistral-small-4", provider: "mistral", name: "Mistral Small 4", tier: "budget", inputPricePerM: 0.15, outputPricePerM: 0.6, contextWindow: 128_000, charsPerToken: 4 },

  // Meta Llama — Meta retired its first-party Llama API in July 2026, so pricing
  // reflects Groq's hosted rates; other hosts (DeepInfra, Together, Bedrock) vary.
  { id: "llama-3.3-70b", provider: "meta", name: "Llama 3.3 70B", tier: "flagship", inputPricePerM: 0.59, outputPricePerM: 0.79, contextWindow: 128_000, charsPerToken: 4 },
  { id: "llama-4-scout", provider: "meta", name: "Llama 4 Scout", tier: "balanced", inputPricePerM: 0.11, outputPricePerM: 0.34, contextWindow: 128_000, charsPerToken: 4 },
  { id: "llama-3.1-8b", provider: "meta", name: "Llama 3.1 8B", tier: "budget", inputPricePerM: 0.05, outputPricePerM: 0.08, contextWindow: 128_000, charsPerToken: 4 },
];

export const PRICING_LAST_VERIFIED = "2026-08-09";

export function modelsByProvider(provider: Provider): Model[] {
  return MODELS.filter((m) => m.provider === provider);
}

export function getModel(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}
