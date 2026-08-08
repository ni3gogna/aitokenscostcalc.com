import type { Model } from "../data/models";

export interface ModelCost {
  model: Model;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  fitsContext: boolean;
}

export function calculateCost(
  model: Model,
  inputTokens: number,
  outputTokens: number,
): ModelCost {
  const inputCost = (inputTokens / 1_000_000) * model.inputPricePerM;
  const outputCost = (outputTokens / 1_000_000) * model.outputPricePerM;
  return {
    model,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    fitsContext: inputTokens <= model.contextWindow,
  };
}

export function rankByCost(costs: ModelCost[]): ModelCost[] {
  return [...costs].sort((a, b) => {
    if (a.fitsContext !== b.fitsContext) return a.fitsContext ? -1 : 1;
    return a.totalCost - b.totalCost;
  });
}

export function formatUsd(amount: number): string {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) {
    return `$${amount.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}`;
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
