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

// Mock menuState.js
jest.unstable_mockModule('../../src/bot/states/menuState.js', () => ({
  MENU_STATES: {
    MENU_START: 'MENU_START',
    MENU_SELECT_PIZZA: 'MENU_SELECT_PIZZA',
    MENU_SELECT_SIZE: 'MENU_SELECT_SIZE',
    MENU_SELECT_DOUGH: 'MENU_SELECT_DOUGH',
    MENU_SELECT_EXTRAS: 'MENU_SELECT_EXTRAS',
    MENU_CONFIRM_ORDER: 'MENU_CONFIRM_ORDER',
    MENU_AWAITING_ADDRESS: 'MENU_AWAITING_ADDRESS'
  },
  PIZZAS: {
    margherita: {
      name: 'Маргарита',
      description: 'Томатный соус, моцарелла, свежие томаты, базилик',
      basePrice: 450,
      image: '🍕'
    }
  },
  SIZES: {
    medium: { name: 'Средняя', multiplier: 1 }
  },
  DOUGH_TYPES: {
    traditional: { name: 'Традиционное', price: 50 }
  },
  EXTRAS: {
    extra_cheese: { name: 'Дополнительный сыр', price: 80 },
    mushrooms: { name: 'Грибы', price: 60 }
  }
}));

// Now import the modules
const { stateManager } = await import('../../src/utils/stateManager.js');
const { PriceCalculator } = await import('../../src/utils/priceCalculator.js');
const { MENU_STATES } = await import('../../src/bot/states/menuState.js');
const { handleMenuCallback, handleMenuMessage } = await import('../../src/bot/handlers/menuHandlers.js');

describe('Menu Handlers - Additional Tests', () => {
  let mockBot;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn().mockResolvedValue(true),
      deleteMessage: jest.fn().mockResolvedValue(true)
    };

    jest.clearAllMocks();
    
    stateManager.getUserData.mockReturnValue({});
    stateManager.getState.mockReturnValue(null);
    PriceCalculator.calculateMenuPizzaPrice.mockReturnValue(500);
  });

  describe('handleMenuCallback - Edge Cases', () => {
    test('should handle size selection with existing user data', async () => {
      const chatId = 12345;
      const data = 'menu_size_medium';

      stateManager.getUserData.mockReturnValue({ 
        pizza: 'margherita',
        extras: ['extra_cheese']
      });

      await handleMenuCallback(mockBot, chatId, data);

      expect(stateManager.updateUserData).toHaveBeenCalled();
      expect(stateManager.setState).toHaveBeenCalled();
    });

    test('should handle dough selection with existing extras', async () => {
      const chatId = 12345;
      const data = 'menu_dough_traditional';

      stateManager.getUserData.mockReturnValue({ 
        pizza: 'margherita',
        size: 'medium',
        extras: ['mushrooms']
      });

      await handleMenuCallback(mockBot, chatId, data);

      expect(stateManager.updateUserData).toHaveBeenCalled();
      expect(stateManager.setState).toHaveBeenCalled();
    });

    test('should handle extra selection when already selected', async () => {
      const chatId = 12345;
      const data = 'menu_extra_extra_cheese';

      stateManager.getUserData.mockReturnValue({ 
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional',
        extras: ['extra_cheese'] // already selected
      });

      await handleMenuCallback(mockBot, chatId, data);

      // Should still update and send message
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle menu_confirm with extras', async () => {
      const chatId = 12345;
      const data = 'menu_confirm';

      stateManager.getUserData.mockReturnValue({
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional',
        extras: ['extra_cheese', 'mushrooms']
      });

      await handleMenuCallback(mockBot, chatId, data);

      expect(stateManager.setState).toHaveBeenCalledWith(chatId, MENU_STATES.MENU_CONFIRM_ORDER);
    });
  });

  describe('handleMenuMessage - Edge Cases', () => {
    test('should handle empty address input', async () => {
      const chatId = 12345;
      const address = '';

      stateManager.getState.mockReturnValue(MENU_STATES.MENU_AWAITING_ADDRESS);
      stateManager.getUserData.mockReturnValue({
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional',
        extras: []
      });
      
      // Mock createOrder to return a valid order
      stateManager.createOrder.mockReturnValue({
        id: 'order_001',
        items: ['Маргарита средняя'],
        total: 500
      });

      await handleMenuMessage(mockBot, chatId, address);

      expect(stateManager.createOrder).toHaveBeenCalled();
      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle very long address input', async () => {
      const chatId = 12345;
      const address = 'г. ' + 'ОченьДлинныйГород'.repeat(20) + ', ул. ' + 'ОченьДлиннаяУлица'.repeat(20) + ', д. 100';

      stateManager.getState.mockReturnValue(MENU_STATES.MENU_AWAITING_ADDRESS);
      stateManager.getUserData.mockReturnValue({
        pizza: 'margherita',
        size: 'medium',
        dough: 'traditional',
        extras: []
      });
      
      // Mock createOrder to return a valid order
      stateManager.createOrder.mockReturnValue({
        id: 'order_001',
        items: ['Маргарита средняя'],
        total: 500
      });

      await handleMenuMessage(mockBot, chatId, address);

      expect(stateManager.createOrder).toHaveBeenCalled();
      expect(stateManager.resetState).toHaveBeenCalledWith(chatId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});