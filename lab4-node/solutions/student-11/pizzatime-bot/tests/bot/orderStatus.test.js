import { jest } from '@jest/globals';

// Mock everything first
jest.unstable_mockModule('../../src/utils/stateManager.js', () => ({
  stateManager: {
    getUserOrders: jest.fn(),
    getOrder: jest.fn()
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
const { handleOrderStatus, handleOrderStatusCallback } = await import('../../src/bot/handlers/orderStatusHandlers.js');

describe('Order Status Handlers', () => {
  let mockBot;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn().mockResolvedValue(true),
      deleteMessage: jest.fn().mockResolvedValue(true)
    };

    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    stateManager.getUserOrders.mockReturnValue([]);
    stateManager.getOrder.mockReturnValue(null);
  });

  describe('handleOrderStatus', () => {
    test('should show message when no orders exist', async () => {
      const chatId = 12345;

      await handleOrderStatus(mockBot, chatId);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should show list of user orders', async () => {
      const chatId = 12345;
      const mockOrders = [
        {
          id: 'order_001',
          status: 'preparing',
          createdAt: new Date('2023-01-01'),
          estimatedDelivery: new Date('2023-01-01T13:00:00')
        }
      ];

      stateManager.getUserOrders.mockReturnValue(mockOrders);

      await handleOrderStatus(mockBot, chatId);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });

  describe('handleOrderStatusCallback', () => {
    test('should show order details', async () => {
      const chatId = 12345;
      const orderId = 'order_001';
      const data = `status_${orderId}`;

      const mockOrder = {
        id: orderId,
        status: 'preparing',
        items: ['Пицца Маргарита'],
        total: 650,
        createdAt: new Date('2023-01-01T12:00:00'),
        estimatedDelivery: new Date('2023-01-01T13:00:00')
      };

      stateManager.getOrder.mockReturnValue(mockOrder);

      await handleOrderStatusCallback(mockBot, chatId, data);

      expect(stateManager.getOrder).toHaveBeenCalledWith(orderId);
      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle order not found', async () => {
      const chatId = 12345;
      const orderId = 'nonexistent_order';
      const data = `status_${orderId}`;

      stateManager.getOrder.mockReturnValue(null);

      await handleOrderStatusCallback(mockBot, chatId, data);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});