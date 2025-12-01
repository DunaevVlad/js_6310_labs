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
    calculateMenuPizzaPrice: jest.fn()
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
const { getMainKeyboard } = await import('../../src/bot/keyboards.js');
const { MENU_STATES, PIZZAS, SIZES, DOUGH_TYPES, EXTRAS } = await import('../../src/bot/states/menuState.js');
const { handleMenuStart, handleMenuCallback, handleMenuMessage } = await import('../../src/bot/handlers/menuHandlers.js');

describe('Menu Handlers', () => {
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
    PriceCalculator.calculateMenuPizzaPrice.mockReturnValue(500);
    stateManager.createOrder.mockReturnValue({
      id: 'order_001',
      items: ['Test pizza'],
      total: 500
    });
  });

  describe('handleMenuStart', () => {
    test('should send menu with pizza options', async () => {
      const chatId = 12345;

      await handleMenuStart(mockBot, chatId);

      expect(stateManager.setState).toHaveBeenCalledWith(chatId, MENU_STATES.MENU_START);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle errors gracefully', async () => {
      const chatId = 12345;
      mockBot.sendMessage.mockRejectedValue(new Error('Network error'));

      await handleMenuStart(mockBot, chatId);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });

  describe('handleMenuCallback', () => {
    test('should handle pizza selection', async () => {
      const chatId = 12345;
      const pizzaKey = 'margherita';
      const data = `menu_pizza_${pizzaKey}`;

      await handleMenuCallback(mockBot, chatId, data);

      expect(stateManager.setUserData).toHaveBeenCalled();
      expect(stateManager.setState).toHaveBeenCalled();
    });

    test('should handle order cancellation', async () => {
      const chatId = 12345;
      const data = 'menu_cancel';

      await handleMenuCallback(mockBot, chatId, data);

      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle errors in callback processing', async () => {
      const chatId = 12345;
      const data = 'menu_pizza_margherita'; // Use valid data to trigger the error

      // Mock the implementation to throw an error
      stateManager.getUserData.mockImplementation(() => {
        throw new Error('Test error');
      });

      await handleMenuCallback(mockBot, chatId, data);

      // Wait for any pending promises to resolve
      await new Promise(resolve => setImmediate(resolve));

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });

  describe('handleMenuMessage', () => {
    test('should handle address input', async () => {
      const chatId = 12345;
      const address = 'г. Москва, ул. Пушкина, д. 10, кв. 25';

      stateManager.getState.mockReturnValue(MENU_STATES.MENU_AWAITING_ADDRESS);
      stateManager.getUserData.mockReturnValue({
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional',
        extras: []
      });

      await handleMenuMessage(mockBot, chatId, address);

      expect(stateManager.createOrder).toHaveBeenCalled();
      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should show message for invalid state', async () => {
      const chatId = 12345;
      const text = 'Some random text';

      stateManager.getState.mockReturnValue(MENU_STATES.MENU_SELECT_EXTRAS);

      await handleMenuMessage(mockBot, chatId, text);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});