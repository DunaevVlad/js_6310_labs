import { jest } from '@jest/globals';

// Mock everything first
jest.unstable_mockModule('dotenv', () => ({
  config: jest.fn()
}));

jest.unstable_mockModule('node-telegram-bot-api', () => ({
  default: jest.fn().mockImplementation(() => ({
    onText: jest.fn(),
    on: jest.fn(),
    sendMessage: jest.fn().mockResolvedValue(true),
    deleteMessage: jest.fn().mockResolvedValue(true),
    answerCallbackQuery: jest.fn().mockResolvedValue(true)
  }))
}));

// Mock other dependencies
jest.unstable_mockModule('../../src/utils/stateManager.js', () => ({
  stateManager: {
    resetState: jest.fn(),
    updateActivity: jest.fn(),
    setState: jest.fn(),
    getState: jest.fn(),
    getUserData: jest.fn()
  }
}));

jest.unstable_mockModule('../../src/bot/handlers/menuHandlers.js', () => ({
  handleMenuCallback: jest.fn(),
  handleMenuMessage: jest.fn()
}));

jest.unstable_mockModule('../../src/bot/handlers/customPizzaHandlers.js', () => ({
  handleCustomPizzaCallback: jest.fn(),
  handleCustomPizzaMessage: jest.fn()
}));

jest.unstable_mockModule('../../src/bot/handlers/orderStatusHandlers.js', () => ({
  handleOrderStatusCallback: jest.fn()
}));

jest.unstable_mockModule('../../src/bot/keyboards.js', () => ({
  getMainKeyboard: jest.fn(() => ({ keyboard: 'main' }))
}));

// Mock console methods
global.console.log = jest.fn();
global.console.error = jest.fn();

// Import after mocks
const TelegramBot = (await import('node-telegram-bot-api')).default;
const { stateManager } = await import('../../src/utils/stateManager.js');
const { handleMenuCallback, handleMenuMessage } = await import('../../src/bot/handlers/menuHandlers.js');
const PizzaBot = (await import('../../src/bot/index.js')).default;

describe('PizzaBot - Additional Tests', () => {
  let mockBotInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    process.env.BOT_TOKEN = 'test-token-123';
    
    mockBotInstance = {
      onText: jest.fn(),
      on: jest.fn(),
      sendMessage: jest.fn().mockResolvedValue(true),
      deleteMessage: jest.fn().mockResolvedValue(true),
      answerCallbackQuery: jest.fn().mockResolvedValue(true)
    };
    TelegramBot.mockImplementation(() => mockBotInstance);
    
    new PizzaBot();
  });

  afterEach(() => {
    delete process.env.BOT_TOKEN;
  });

  describe('Callback Query Handling', () => {
    test('should handle menu callback with MENU state', async () => {
      const callbackHandler = mockBotInstance.on.mock.calls.find(call => call[0] === 'callback_query')[1];
      
      const mockCallback = {
        message: { 
          chat: { id: 12345 },
          message_id: 1
        },
        data: 'menu_pizza_margherita',
        id: 'callback123'
      };

      stateManager.getState.mockReturnValue('MENU_START');

      await callbackHandler(mockCallback);

      expect(stateManager.updateActivity).toHaveBeenCalledWith(12345);
      expect(handleMenuCallback).toHaveBeenCalledWith(mockBotInstance, 12345, 'menu_pizza_margherita');
    });

    test('should handle callback query errors gracefully', async () => {
      const callbackHandler = mockBotInstance.on.mock.calls.find(call => call[0] === 'callback_query')[1];
      
      const mockCallback = {
        message: { 
          chat: { id: 12345 },
          message_id: 1
        },
        data: 'menu_pizza_margherita',
        id: 'callback123'
      };

      stateManager.getState.mockReturnValue('MENU_START');
      
      // Mock handleMenuCallback to throw an error
      handleMenuCallback.mockImplementation(() => {
        throw new Error('Test error from menu callback');
      });

      await callbackHandler(mockCallback);

      // Should catch error and not crash
      expect(console.error).toHaveBeenCalledWith('Error handling callback:', expect.any(String));
    });
  });

  describe('Message Handling Edge Cases', () => {
    test('should handle message processing errors gracefully', async () => {
      const messageHandler = mockBotInstance.on.mock.calls.find(call => call[0] === 'message')[1];
      
      const mockMsg = { 
        chat: { id: 12345 }, 
        text: 'test message' 
      };
      
      stateManager.getState.mockReturnValue('MENU_START');
      
      // Mock handleMenuMessage to throw an error
      handleMenuMessage.mockImplementation(() => {
        throw new Error('Test error from menu message');
      });

      await messageHandler(mockMsg);

      // Error should be caught and error message sent
      expect(mockBotInstance.sendMessage).toHaveBeenCalledWith(
        12345,
        expect.stringContaining('Произошла ошибка'),
        expect.any(Object)
      );
    });
  });
});