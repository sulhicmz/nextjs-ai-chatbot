import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { gateway } from '@ai-sdk/gateway';
import { isTestEnvironment } from '../constants';

// Add logging to see which provider is being used
console.log('Initializing AI provider. Test environment:', isTestEnvironment);

export const myProvider = isTestEnvironment
  ? (() => {
      console.log('Using mock models for testing');
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require('./models.mock');
      return customProvider({
        languageModels: {
          'chat-model': chatModel,
          'chat-model-reasoning': reasoningModel,
          'title-model': titleModel,
          'artifact-model': artifactModel,
        },
      });
    })()
  : (() => {
      console.log('Using AI Gateway with xAI models');
      // Check if AI_GATEWAY_API_KEY is set
      if (!process.env.AI_GATEWAY_API_KEY) {
        console.warn('AI_GATEWAY_API_KEY is not set. AI features may not work properly.');
      } else {
        console.log('AI_GATEWAY_API_KEY is set');
      }
      return customProvider({
        languageModels: {
          'chat-model': gateway.languageModel('xai/grok-2-vision-1212'),
          'chat-model-reasoning': wrapLanguageModel({
            model: gateway.languageModel('xai/grok-3-mini'),
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
          }),
          'title-model': gateway.languageModel('xai/grok-2-1212'),
          'artifact-model': gateway.languageModel('xai/grok-2-1212'),
        },
      });
    })();
