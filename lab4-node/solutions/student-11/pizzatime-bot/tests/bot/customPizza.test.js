import { jest } from '@jest/globals';

// Mock everything first
jest.unstable_mockModule('../../src/utils/stateManager.js', () => ({
  stateManager: {
    setState: jest.fn(),
    setUserData: jest.fn(),
    updateUserData: jest.fn(),
    getUserData: jest.fn(),
    getState: jest.fn(),
    resetState: jest.fn(),
    createOrder: jest.fn()
  }
}));

jest.unstable_mockModule('../../src/utils/priceCalculator.js', () => ({
  PriceCalculator: {
    calculateCustomPizzaPrice: jest.fn(),
    calculateCustomPizzaBasePrice: jest.fn()
  }
}));

jest.unstable_mockModule('../../src/bot/keyboards.js', () => ({
  getMainKeyboard: jest.fn(() => ({ 
    keyboard: [['/menu', '/custom_pizza'], ['/order_status']], 
    resize_keyboard: true 
  }))
}));

// Now import the modules
const { stateManager } = await import('../../src/utils/stateManager.js');
const { PriceCalculator } = await import('../../src/utils/priceCalculator.js');
const { CUSTOM_PIZZA_STATES } = await import('../../src/bot/states/customPizzaState.js');
const { handleCustomPizzaStart, handleCustomPizzaCallback, handleCustomPizzaMessage } = await import('../../src/bot/handlers/customPizzaHandlers.js');

describe('Custom Pizza Handlers', () => {
  let mockBot;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn().mockResolvedValue(true),
      deleteMessage: jest.fn().mockResolvedValue(true)
    };

    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    stateManager.getUserData.mockReturnValue({});
    stateManager.getState.mockReturnValue(null);
    PriceCalculator.calculateCustomPizzaPrice.mockReturnValue(500);
    PriceCalculator.calculateCustomPizzaBasePrice.mockReturnValue(300);
    stateManager.createOrder.mockReturnValue({
      id: 'order_001',
      items: ['Custom pizza'],
      total: 500
    });
  });

  describe('handleCustomPizzaStart', () => {
    test('should start custom pizza creation', async () => {
      const chatId = 12345;

      await handleCustomPizzaStart(mockBot, chatId);

      expect(stateManager.setState).toHaveBeenCalled();
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });

  describe('handleCustomPizzaCallback', () => {
    test('should handle sauce selection', async () => {
      const chatId = 12345;
      const sauceKey = 'tomato';
      const data = `custom_sauce_${sauceKey}`;

      await handleCustomPizzaCallback(mockBot, chatId, data);

      expect(stateManager.setUserData).toHaveBeenCalled();
      expect(stateManager.setState).toHaveBeenCalled();
    });

    test('should handle order cancellation', async () => {
      const chatId = 12345;
      const data = 'custom_cancel';

      await handleCustomPizzaCallback(mockBot, chatId, data);

      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });

  describe('handleCustomPizzaMessage', () => {
    test('should handle address input', async () => {
      const chatId = 12345;
      const address = 'г. Москва, ул. Пушкина, д. 10, кв. 25';

      stateManager.getState.mockReturnValue(CUSTOM_PIZZA_STATES.CUSTOM_AWAITING_ADDRESS);
      stateManager.getUserData.mockReturnValue({
        sauce: 'tomato',
        cheese: 'mozzarella',
        size: 'medium',
        toppings: ['pepperoni']
      });

      await handleCustomPizzaMessage(mockBot, chatId, address);

      expect(stateManager.createOrder).toHaveBeenCalled();
      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});