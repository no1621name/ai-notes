import Groq from 'groq-sdk';

import type { AiModel, AiService, AiSettings, Completion } from '../../model/types';

export class GroqService implements AiService {
  private readonly client: Groq;
  public readonly apiKeyRegex: RegExp = /\bgsk_[A-Za-z0-9]{52}\b/;

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

  public async* getCompletions(userMessage: string, settings: AiSettings): AsyncIterable<Completion> {
    const stream = await this.client.chat.completions.create({
      model: settings.model || '',
      temperature: settings.temperature,
      stream: true,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    for await (const chunk of stream) {
      const chunkData = chunk.choices[0];
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
  }
}
