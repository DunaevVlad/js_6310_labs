import { jest } from '@jest/globals';

// Mock dotenv first
jest.unstable_mockModule('dotenv', () => ({
  config: jest.fn()
}));

// Mock Telegram Bot API
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
    getState: jest.fn()
  }
}));

jest.unstable_mockModule('../../src/bot/handlers/menuHandlers.js', () => ({
  handleMenuStart: jest.fn(),
  handleMenuMessage: jest.fn()  // Добавлена эта строка
}));

jest.unstable_mockModule('../../src/bot/handlers/customPizzaHandlers.js', () => ({
  handleCustomPizzaStart: jest.fn()
}));

jest.unstable_mockModule('../../src/bot/handlers/orderStatusHandlers.js', () => ({
  handleOrderStatus: jest.fn()
}));

jest.unstable_mockModule('../../src/bot/keyboards.js', () => ({
  getMainKeyboard: jest.fn(() => ({ keyboard: 'main' }))
}));

// Mock console.log to suppress bot startup message
global.console.log = jest.fn();

// Import after mocks
const TelegramBot = (await import('node-telegram-bot-api')).default;
const { stateManager } = await import('../../src/utils/stateManager.js');
const { handleMenuStart } = await import('../../src/bot/handlers/menuHandlers.js');
const { handleCustomPizzaStart } = await import('../../src/bot/handlers/customPizzaHandlers.js');
const { handleOrderStatus } = await import('../../src/bot/handlers/orderStatusHandlers.js');
const PizzaBot = (await import('../../src/bot/index.js')).default;

describe('PizzaBot', () => {
  let mockBotInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
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

  test('should initialize Telegram bot with token from env', () => {
    expect(TelegramBot).toHaveBeenCalledWith('test-token-123', {
      polling: {
        timeout: 10,
        interval: 300
      }
    });
  });

  test('should setup command handlers', () => {
    expect(mockBotInstance.onText).toHaveBeenCalledWith(/\/start/, expect.any(Function));
    expect(mockBotInstance.onText).toHaveBeenCalledWith(/\/menu/, expect.any(Function));
    expect(mockBotInstance.onText).toHaveBeenCalledWith(/\/custom_pizza/, expect.any(Function));
    expect(mockBotInstance.onText).toHaveBeenCalledWith(/\/order_status/, expect.any(Function));
  });

  test('should setup callback query handler', () => {
    expect(mockBotInstance.on).toHaveBeenCalledWith('callback_query', expect.any(Function));
  });

  test('should setup message handler', () => {
    expect(mockBotInstance.on).toHaveBeenCalledWith('message', expect.any(Function));
  });

  test('should setup error handlers', () => {
    expect(mockBotInstance.on).toHaveBeenCalledWith('polling_error', expect.any(Function));
    expect(mockBotInstance.on).toHaveBeenCalledWith('webhook_error', expect.any(Function));
  });

  describe('Command Handlers', () => {
    test('should handle /start command', () => {
      const startHandler = mockBotInstance.onText.mock.calls.find(call => call[0].toString() === '/\\/start/')[1];
      
      const mockMsg = { chat: { id: 12345 } };
      startHandler(mockMsg);

      expect(stateManager.resetState).toHaveBeenCalledWith(12345);
      expect(stateManager.updateActivity).toHaveBeenCalledWith(12345);
      expect(mockBotInstance.sendMessage).toHaveBeenCalledWith(
        12345,
        expect.stringContaining('Добро пожаловать в PizzaTime 2'),
        expect.any(Object)
      );
    });

    test('should handle /menu command', () => {
      const menuHandler = mockBotInstance.onText.mock.calls.find(call => call[0].toString() === '/\\/menu/')[1];
      
      const mockMsg = { chat: { id: 12345 } };
      menuHandler(mockMsg);

      expect(stateManager.setState).toHaveBeenCalled();
      expect(stateManager.updateActivity).toHaveBeenCalledWith(12345);
      expect(handleMenuStart).toHaveBeenCalledWith(mockBotInstance, 12345);
    });

    test('should handle /custom_pizza command', () => {
      const customHandler = mockBotInstance.onText.mock.calls.find(call => call[0].toString() === '/\\/custom_pizza/')[1];
      
      const mockMsg = { chat: { id: 12345 } };
      customHandler(mockMsg);

      expect(stateManager.setState).toHaveBeenCalled();
      expect(stateManager.updateActivity).toHaveBeenCalledWith(12345);
      expect(handleCustomPizzaStart).toHaveBeenCalledWith(mockBotInstance, 12345);
    });

    test('should handle /order_status command', () => {
      const statusHandler = mockBotInstance.onText.mock.calls.find(call => call[0].toString() === '/\\/order_status/')[1];
      
      const mockMsg = { chat: { id: 12345 } };
      statusHandler(mockMsg);

      expect(stateManager.updateActivity).toHaveBeenCalledWith(12345);
      expect(handleOrderStatus).toHaveBeenCalledWith(mockBotInstance, 12345);
    });
  });

  describe('Message Handling', () => {
    test('should handle non-command messages with state', () => {
      const messageHandler = mockBotInstance.on.mock.calls.find(call => call[0] === 'message')[1];
      
      const mockMsg = { 
        chat: { id: 12345 }, 
        text: 'Some message text' 
      };
      
      // Mock state to trigger message processing
      stateManager.getState.mockReturnValue('MENU_START');
      
      messageHandler(mockMsg);

      expect(stateManager.updateActivity).toHaveBeenCalledWith(12345);
      expect(mockBotInstance.sendMessage).toHaveBeenCalled();
    });

    test('should ignore command messages in message handler', () => {
      const messageHandler = mockBotInstance.on.mock.calls.find(call => call[0] === 'message')[1];
      
      const mockMsg = { 
        chat: { id: 12345 }, 
        text: '/start' 
      };
      
      messageHandler(mockMsg);

      // Should not process command messages in general message handler
      expect(mockBotInstance.sendMessage).not.toHaveBeenCalledWith(
        12345,
        expect.stringContaining('Пожалуйста, используйте команды'),
        expect.any(Object)
      );
    });
  });
});