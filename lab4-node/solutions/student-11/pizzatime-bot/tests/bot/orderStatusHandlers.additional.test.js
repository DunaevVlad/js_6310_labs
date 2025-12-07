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
const { handleOrderStatusCallback } = await import('../../src/bot/handlers/orderStatusHandlers.js');

describe('Order Status Handlers - Additional Tests', () => {
  let mockBot;

  beforeEach(() => {
    mockBot = {
      sendMessage: jest.fn().mockResolvedValue(true),
      deleteMessage: jest.fn().mockResolvedValue(true)
    };

    jest.clearAllMocks();
    
    stateManager.getUserOrders.mockReturnValue([]);
    stateManager.getOrder.mockReturnValue(null);
  });

  describe('handleOrderStatusCallback - Edge Cases', () => {
    test('should handle status_refresh callback', async () => {
      const chatId = 12345;
      const data = 'status_refresh';

      await handleOrderStatusCallback(mockBot, chatId, data);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });

    test('should handle order with all status fields', async () => {
      const chatId = 12345;
      const orderId = 'order_001';
      const data = `status_${orderId}`;

      const mockOrder = {
        id: orderId,
        status: 'delivering',
        items: ['Пицца Маргарита', 'Напиток Кола', 'Салат Цезарь'],
        total: 1200,
        createdAt: new Date('2023-01-01T12:00:00'),
        estimatedDelivery: new Date('2023-01-01T13:30:00'),
        address: 'г. Москва, ул. Пушкина, д. 10',
        deliveryTime: 45
      };

      stateManager.getOrder.mockReturnValue(mockOrder);

      await handleOrderStatusCallback(mockBot, chatId, data);

      expect(stateManager.getOrder).toHaveBeenCalledWith(orderId);
      expect(mockBot.sendMessage).toHaveBeenCalledWith(
        chatId,
        expect.stringContaining('Заказ #001'),
        expect.any(Object)
      );
    });

    test('should handle order with preparing status', async () => {
      const chatId = 12345;
      const orderId = 'order_002';
      const data = `status_${orderId}`;

      const mockOrder = {
        id: orderId,
        status: 'preparing',
        items: ['Кастомная пицца'],
        total: 750,
        createdAt: new Date('2023-01-01T14:00:00'),
        estimatedDelivery: new Date('2023-01-01T15:00:00')
      };

      stateManager.getOrder.mockReturnValue(mockOrder);

      await handleOrderStatusCallback(mockBot, chatId, data);

      expect(mockBot.sendMessage).toHaveBeenCalled();
    });
  });
});