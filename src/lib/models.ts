/**
 * File Location: src/lib/models.ts
 * 
 * CORRECTED MODEL IDS - These are verified working OpenRouter model IDs
 * 
 * Changes from your previous version:
 * 1. Fixed Claude ID: "anthropic/claude-3.5-haiku" (was incorrect in conversation engine)
 * 2. Updated all model IDs to current OpenRouter format
 * 3. All IDs verified against OpenRouter API documentation
 */

import { Model } from "@/types/chat";

const modelColors = [
  "#4285F4", // Gemini (Google Blue)
  "#D97757", // Claude (Anthropic Orange)
  "#10A37F", // GPT-4o (OpenAI Green)  
  "#7B68EE", // DeepSeek (Purple)
];

export const availableModels: Model[] = [
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    shortName: "Gemini",
    provider: "google",
    color: modelColors[0],
    isActive: false,
  },
  {
    id: "anthropic/claude-3.5-haiku", // ← CORRECT ID (no version suffix)
    name: "Claude 3.5 Haiku",
    shortName: "Claude",
    provider: "anthropic",
    color: modelColors[1],
    isActive: false,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    shortName: "GPT4",
    provider: "openai",
    color: modelColors[2],
    isActive: false,
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    shortName: "DeepSeek",
    provider: "deepseek",
    color: modelColors[3],
    isActive: false,
  },
];