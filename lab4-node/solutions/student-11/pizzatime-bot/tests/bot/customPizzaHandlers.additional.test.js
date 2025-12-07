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

// Mock customPizzaState.js
jest.unstable_mockModule('../../src/bot/states/customPizzaState.js', () => ({
  CUSTOM_PIZZA_STATES: {
    CUSTOM_PIZZA_START: 'CUSTOM_PIZZA_START',
    CUSTOM_SELECT_SAUCE: 'CUSTOM_SELECT_SAUCE',
    CUSTOM_SELECT_CHEESE: 'CUSTOM_SELECT_CHEESE',
    CUSTOM_SELECT_TOPPINGS: 'CUSTOM_SELECT_TOPPINGS',
    CUSTOM_SELECT_SIZE: 'CUSTOM_SELECT_SIZE',
    CUSTOM_CONFIRM_ORDER: 'CUSTOM_CONFIRM_ORDER',
    CUSTOM_AWAITING_ADDRESS: 'CUSTOM_AWAITING_ADDRESS'
  },
  SAUCES: {
    tomato: { name: 'Томатный соус', price: 0 }
  },
  CHEESES: {
    mozzarella: { name: 'Моцарелла', price: 0 }
  },
  TOPPINGS: {
    pepperoni: { name: 'Пепперони', price: 70 },
    mushrooms: { name: 'Грибы', price: 40 },
    bacon: { name: 'Бекон', price: 80 }
  },
  CUSTOM_SIZES: {
    medium: { name: 'Средняя', basePrice: 400 },
    large: { name: 'Большая', basePrice: 500 }
  }
}));

// Now import the modules
const { stateManager } = await import('../../src/utils/stateManager.js');
const { PriceCalculator } = await import('../../src/utils/priceCalculator.js');
const { CUSTOM_PIZZA_STATES } = await import('../../src/bot/states/customPizzaState.js');
const { handleCustomPizzaCallback, handleCustomPizzaMessage } = await import('../../src/bot/handlers/customPizzaHandlers.js');

describe('Custom Pizza Handlers - Additional Tests', () => {
  let mockBot;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn().mockResolvedValue(true),
      deleteMessage: jest.fn().mockResolvedValue(true)
    };

    jest.clearAllMocks();
    
    stateManager.getUserData.mockReturnValue({});
    stateManager.getState.mockReturnValue(null);
    PriceCalculator.calculateCustomPizzaPrice.mockReturnValue(500);
    PriceCalculator.calculateCustomPizzaBasePrice.mockReturnValue(300);
  });

  describe('handleCustomPizzaCallback - Edge Cases', () => {
    test('should handle topping selection when already selected', async () => {
      const chatId = 12345;
      const data = 'custom_topping_pepperoni';

      stateManager.getUserData.mockReturnValue({ 
        sauce: 'tomato',
        cheese: 'mozzarella',
        toppings: ['pepperoni'] // already selected
      });

      await handleCustomPizzaCallback(mockBot, chatId, data);

      // Should still update and send message
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle multiple toppings selection', async () => {
      const chatId = 12345;

      // Select first topping
      stateManager.getUserData.mockReturnValue({ 
        sauce: 'tomato',
        cheese: 'mozzarella',
        toppings: []
      });

      await handleCustomPizzaCallback(mockBot, chatId, 'custom_topping_pepperoni');

      // Select second topping
      stateManager.getUserData.mockReturnValue({ 
        sauce: 'tomato',
        cheese: 'mozzarella',
        toppings: ['pepperoni']
      });

      await handleCustomPizzaCallback(mockBot, chatId, 'custom_topping_mushrooms');

      expect(mockBot.sendMessage).toHaveBeenCalledTimes(2);
    });

    test('should handle size selection with multiple toppings', async () => {
      const chatId = 12345;
      const data = 'custom_size_large';

      // Use mock implementation to track user data changes
      let userData = {
        sauce: 'tomato',
        cheese: 'mozzarella',
        toppings: ['pepperoni', 'mushrooms', 'bacon']
      };

      stateManager.getUserData.mockImplementation(() => userData);
      stateManager.updateUserData.mockImplementation((chatId, updates) => {
        userData = { ...userData, ...updates };
      });

      PriceCalculator.calculateCustomPizzaPrice.mockReturnValue(1000);

      await handleCustomPizzaCallback(mockBot, chatId, data);

      // Check that size was updated
      expect(userData).toHaveProperty('size', 'large');
      expect(stateManager.setState).toHaveBeenCalledWith(chatId, CUSTOM_PIZZA_STATES.CUSTOM_CONFIRM_ORDER);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });

  describe('handleCustomPizzaMessage - Edge Cases', () => {
    test('should handle empty address input', async () => {
      const chatId = 12345;
      const address = '';

      stateManager.getState.mockReturnValue(CUSTOM_PIZZA_STATES.CUSTOM_AWAITING_ADDRESS);
      stateManager.getUserData.mockReturnValue({
        sauce: 'tomato',
        cheese: 'mozzarella',
        size: 'medium',
        toppings: []
      });
      
      // Mock createOrder to return a valid order
      stateManager.createOrder.mockReturnValue({
        id: 'order_001',
        items: ['Кастомная пицца'],
        total: 470
      });

      await handleCustomPizzaMessage(mockBot, chatId, address);

      expect(stateManager.createOrder).toHaveBeenCalled();
      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle address input with no toppings', async () => {
      const chatId = 12345;
      const address = 'г. Москва, ул. Пушкина, д. 10';

      stateManager.getState.mockReturnValue(CUSTOM_PIZZA_STATES.CUSTOM_AWAITING_ADDRESS);
      stateManager.getUserData.mockReturnValue({
        sauce: 'tomato',
        cheese: 'mozzarella',
        size: 'medium',
        toppings: [] // no toppings
      });
      
      // Mock createOrder to return a valid order
      stateManager.createOrder.mockReturnValue({
        id: 'order_001',
        items: ['Кастомная пицца'],
        total: 470
      });

      await handleCustomPizzaMessage(mockBot, chatId, address);

      expect(stateManager.createOrder).toHaveBeenCalled();
      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});