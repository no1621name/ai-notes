import Groq, { BadRequestError } from 'groq-sdk';

import type { AiModel, AiService, AiSettings, Completion } from '../../model/types';
import { AiServiceError } from '../../model/errors';
import { CONTEXT_PREFIX_PROMPT, DEFAULT_SYSTEM_PROMPT } from '../../config';

interface ApiErrorBody {
  error?: {
    message?: string;
  };
}

export class GroqService implements AiService {
  private readonly client: Groq;
  public readonly apiKeyRegex: RegExp = /\bgsk_[A-Za-z0-9]{52}\b/;
  public readonly serviceInfo = {
    name: 'Groq',
    link: 'https://console.groq.com',
  };

  constructor(apiKey?: string) {
    this.client = new Groq({ apiKey: apiKey || '', dangerouslyAllowBrowser: true });
  }

  public updateApiKey(apiKey?: string): void {
    this.client.apiKey = apiKey || '';
  }

  public async getModels(): Promise<AiModel[]> {
    const models = await this.client.models.list();

    return models.data.map(model => ({
      name: model.id,
      ownedBy: model.owned_by,
    }));
  }

  private createSystemPrompt(context?: string) {
    if (context) {
      return `${CONTEXT_PREFIX_PROMPT} ${context}`;
    }

    return DEFAULT_SYSTEM_PROMPT;
  }

  private handleError(error: unknown): never {
    if (error instanceof BadRequestError) {
      const body = error.error as Partial<ApiErrorBody> | undefined;
      const message = body?.error?.message;

      throw new AiServiceError(message ?? 'Request went wrong');
    }

    throw new AiServiceError(error instanceof Error ? error.message : 'Unknown error');
  }

  public async* getCompletions(userMessage: string, settings: AiSettings, context?: string, signal?: AbortSignal): AsyncIterable<Completion> {
    try {
      const stream = await this.client.chat.completions.create({
        model: settings.model || '',
        temperature: settings.temperature,
        stream: true,
        messages: [
          {
            role: 'system',
            content: this.createSystemPrompt(context),
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }, signal ? { signal } : undefined);

      for await (const chunk of stream) {
        const chunkData = chunk.choices[0];

        if (!chunkData) {
          continue;
        }

        const completion: Completion = {
          error: false,
          errorMessage: null,
          message: chunkData.delta.content,
        };

        if (chunkData.finish_reason === 'length') {
          completion.error = true;
          completion.errorMessage = 'Response too long';
        }

        yield completion;
      }
    } catch (error: unknown) {
      this.handleError(error);
    }
  }
}
