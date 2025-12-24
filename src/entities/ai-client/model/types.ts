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

export interface AiService {
  readonly apiKeyRegex: RegExp;
  getModels: () => Promise<AiModel[]>;
  getCompletions: (userMessage: string, settings: Omit<AiSettings, 'apiKey'>) => AsyncIterable<Completion>;
  updateApiKey: (apiKey: string) => void;
}
