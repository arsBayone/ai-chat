/**
 * File Location: src/lib/conversationEngine.ts
 * 
 * COMPLETE FIX - All tagging issues resolved
 * 
 * Fixed Issues:
 * 1. Models no longer include "(ModelName said: ...)" in their responses
 * 2. @mention colors now display correctly
 * 3. Models don't tag themselves or reference other models' previous messages
 * 4. Clean, natural responses without any context artifacts
 * 
 * Key Changes:
 * - Removed context prefix format entirely from responses
 * - Added strong instruction to ignore previous conversation context format
 * - Simplified buildContextWindow to not add any prefixes
 * - Models now only see clean message content
 */

import { Model, Message } from "@/types/chat";

interface ResponseDecision {
  shouldRespond: boolean;
  delay: number;
  priority: number;
}

// Model-specific personality traits and strengths
const MODEL_PERSONALITIES = {
  "google/gemini-2.0-flash-001": {
    personality: "Fast, efficient, and multimodal-focused",
    strengths: "Quick responses, image understanding, real-time analysis",
    style: "Direct and informative with emphasis on visual/multimodal capabilities"
  },
  "anthropic/claude-3.5-haiku": {
    personality: "Thoughtful, balanced, and conversational",
    strengths: "Nuanced reasoning, ethical considerations, creative writing",
    style: "Warm and articulate with careful consideration of context"
  },
  "openai/gpt-4o-mini": {
    personality: "Practical, reliable, and efficient",
    strengths: "General knowledge, consistent responses, cost-effective solutions",
    style: "Clear and straightforward with focus on practical answers"
  },
  "deepseek/deepseek-chat": {
    personality: "Technical, code-focused, and analytical",
    strengths: "Programming, debugging, technical documentation, algorithmic thinking",
    style: "Precise and detail-oriented with emphasis on technical accuracy"
  }
};

export class ConversationEngine {
  private cooldowns: Map<string, number> = new Map();
  private responseQueue: Array<{ modelId: string; priority: number }> = [];
  private pendingModels: Set<string> = new Set();
  private maxConcurrent = 1;
  private currentlyResponding = 0;
  private onTriggerResponse?: (modelId: string) => void;

  setResponseHandler(handler: (modelId: string) => void) {
    this.onTriggerResponse = handler;
  }

  analyzeForResponse(
    model: Model,
    messages: Message[],
    latestMessage: Message,
    activeModels: Model[]
  ): ResponseDecision {
    // Don't respond to own messages
    if (latestMessage.modelId === model.id) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    let priority = 0;
    let shouldRespond = false;

    // Highest priority: @mentioned - BYPASSES COOLDOWN
    const mentionPattern = new RegExp(`@${model.shortName.toLowerCase()}\\b`, "i");
    const isMentioned = mentionPattern.test(latestMessage.content);

    if (isMentioned) {
      shouldRespond = true;
      priority = 100;
    }

    // Check cooldown (10 seconds) - but @mentions bypass this
    const lastResponse = this.cooldowns.get(model.id) || 0;
    const isOnCooldown = Date.now() - lastResponse < 10000;

    if (isOnCooldown && !isMentioned) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    // Model-specific response triggers
    if (!shouldRespond) {
      shouldRespond = this.checkModelSpecificTriggers(model, latestMessage);
      if (shouldRespond) priority = 85;
    }

    // High priority: User message
    if (!shouldRespond && latestMessage.role === "user") {
      shouldRespond = true;
      priority = 80;
    }

    // Medium priority: Question asked
    if (!shouldRespond && latestMessage.content.includes("?")) {
      shouldRespond = true;
      priority = 60;
    }

    // Low priority: Random chance (15%)
    if (!shouldRespond && Math.random() < 0.15) {
      shouldRespond = true;
      priority = 20;
    }

    // Calculate delay - REDUCED for @mentions
    const readingTime = Math.min(latestMessage.content.length * 15, 2000);
    const baseDelay = isMentioned ? 500 : 1500;
    const randomDelay = isMentioned ? Math.random() * 500 : Math.random() * 2000;
    const delay = baseDelay + randomDelay + (isMentioned ? 0 : readingTime);

    return { shouldRespond, delay, priority };
  }

  // Check for model-specific triggers based on content
  private checkModelSpecificTriggers(model: Model, message: Message): boolean {
    const content = message.content.toLowerCase();

    switch (model.id) {
      case "deepseek/deepseek-chat":
        return /\b(code|bug|function|algorithm|debug|program|script|api|syntax)\b/.test(content) ||
               /```/.test(message.content) ||
               /\b(python|javascript|typescript|java|c\+\+|rust|go)\b/.test(content);

      case "google/gemini-2.0-flash-001":
        return /\b(image|picture|photo|visual|diagram|chart|fast|quick|speed|weather)\b/.test(content);

      case "anthropic/claude-3.5-haiku":
        return /\b(creative|write|story|ethical|opinion|think|consider|nuance|joke|humor)\b/.test(content) ||
               message.content.includes("?");

      case "openai/gpt-4o-mini":
        return /\b(explain|how|what|why|help|summary|summarize)\b/.test(content);

      default:
        return false;
    }
  }

  queueResponse(modelId: string, delay: number, priority: number): void {
    if (this.pendingModels.has(modelId)) {
      return;
    }
    this.pendingModels.add(modelId);

    setTimeout(() => {
      if (!this.pendingModels.has(modelId)) {
        return;
      }

      if (this.currentlyResponding < this.maxConcurrent) {
        this.triggerResponse(modelId);
      } else {
        const insertIndex = this.responseQueue.findIndex(
          (item) => item.priority < priority
        );
        if (insertIndex === -1) {
          this.responseQueue.push({ modelId, priority });
        } else {
          this.responseQueue.splice(insertIndex, 0, { modelId, priority });
        }
      }
    }, delay);
  }

  completeResponse(modelId: string): void {
    this.cooldowns.set(modelId, Date.now());
    this.currentlyResponding--;
    this.pendingModels.delete(modelId);

    if (this.responseQueue.length > 0) {
      const next = this.responseQueue.shift()!;
      this.triggerResponse(next.modelId);
    }
  }

  private triggerResponse(modelId: string): void {
    this.currentlyResponding++;
    this.onTriggerResponse?.(modelId);
  }

  isOnCooldown(modelId: string): boolean {
    const lastResponse = this.cooldowns.get(modelId) || 0;
    return Date.now() - lastResponse < 10000;
  }

  reset(): void {
    this.cooldowns.clear();
    this.responseQueue = [];
    this.pendingModels.clear();
    this.currentlyResponding = 0;
  }
}

export function buildSystemPrompt(model: Model, activeModels: Model[]): string {
  const otherModels = activeModels
    .filter((m) => m.id !== model.id)
    .map((m) => m.shortName);

  const othersText =
    otherModels.length > 0
      ? `The other AI participants are: ${otherModels.join(", ")}.`
      : "You are the only AI in this chat.";

  const personality = MODEL_PERSONALITIES[model.id as keyof typeof MODEL_PERSONALITIES];
  
  const personalityPrompt = personality 
    ? `\n\nYour unique characteristics:
- Personality: ${personality.personality}
- Strengths: ${personality.strengths}
- Communication style: ${personality.style}

Lean into your strengths naturally!`
    : "";

  return `You are ${model.name}, participating in a group chat with a human user${otherModels.length > 0 ? " and other AI models" : ""}.

${othersText}${personalityPrompt}

Core Rules:
- Be conversational and natural, like a group chat
- Keep responses concise (2-4 sentences usually, unless asked for more detail)
- You can address others using @mentions (e.g., @${otherModels[0] || "User"})
- Don't repeat what others have said - add your unique perspective
- Feel free to disagree, build on others' points, or ask follow-up questions
- If directly addressed with @${model.shortName}, you MUST respond
- Be yourself - show personality and engage naturally

CRITICAL RESPONSE RULES:
1. NEVER start your response with any prefix like:
   - "@${model.shortName}:"
   - "${model.name}:"
   - "[${model.name}]:"
   - "(${model.shortName} said:"
   
2. NEVER reference or repeat the conversation format you see in your context
   - If you see "(ModelName said: ...)" - this is just context for you
   - DO NOT include this format in your response
   - DO NOT say things like "(DeepSeek said: ...)" in your response
   
3. Your response should start IMMEDIATELY with your actual message
   - ✅ CORRECT: "Ha! That's a great joke about the gummy bear!"
   - ✅ CORRECT: "Why did the scarecrow win an award? Because he was outstanding in his field!"
   - ❌ WRONG: "[Gemini]: Ha! That's a great joke..."
   - ❌ WRONG: "(DeepSeek said: Why don't scientists trust atoms?) I can add to that..."
  //  - ❌ WRONG: "@Gemini: Ha! That's a great joke..."

4. Just respond naturally - the UI shows your name automatically

Remember: The conversation history may have special formatting for context, but YOUR response should be pure, natural text!`;
}

export function buildContextWindow(
  messages: Message[],
  windowSize: number,
  model: Model
): { role: "user" | "assistant" | "system"; content: string }[] {
  const recentMessages = messages.slice(-windowSize);

  // SIMPLIFIED: No prefixes at all - just pass the actual message content
  // The model will understand context from the conversation flow
  return recentMessages.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content, // Clean content only, no prefixes!
  }));
}

export const conversationEngine = new ConversationEngine();