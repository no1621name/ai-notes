export interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  created_at: Date;
}

export type SavedPromptPayload = Pick<SavedPrompt, 'name' | 'prompt'>;

export interface AiSettings {
  apiKey?: string;
  model?: string;
  temperature: number;
}

export interface AiModel {
  name: string;
  ownedBy: string;
}

export interface Completion {
  message?: string | null;
  error: boolean;
  errorMessage?: string | null;
}

interface ServiceInfo {
  name: string;
  link: string;
}

export interface AiService {
  readonly apiKeyRegex: RegExp;
  readonly serviceInfo?: ServiceInfo;
  getModels: () => Promise<AiModel[]>;
  getCompletions: (userMessage: string, settings: Omit<AiSettings, 'apiKey'>, context?: string, signal?: AbortSignal) => AsyncIterable<Completion>;
  updateApiKey: (apiKey: string) => void;
}
