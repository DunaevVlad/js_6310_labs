import { jest } from '@jest/globals';
import { StateManager, stateManager } from '../../src/utils/stateManager.js';

describe('StateManager', () => {
  let manager;

  beforeEach(() => {
    manager = new StateManager();
    jest.clearAllMocks();
  });

  describe('State Management', () => {
    test('should set and get state', () => {
      const userId = 12345;
      const state = 'TEST_STATE';

      manager.setState(userId, state);
      const result = manager.getState(userId);

      expect(result).toBe(state);
    });

    test('should return undefined for non-existent state', () => {
      const userId = 99999;

      const result = manager.getState(userId);

      expect(result).toBeUndefined();
    });

    test('should reset state', () => {
      const userId = 12345;
      manager.setState(userId, 'TEST_STATE');
      manager.setUserData(userId, { test: 'data' });

      manager.resetState(userId);

      expect(manager.getState(userId)).toBeUndefined();
      // Исправлено: после resetState должен быть объект с пустым массивом orders
      expect(manager.getUserData(userId)).toEqual({ orders: [] });
    });
  });

  describe('User Data Management', () => {
    test('should set and get user data', () => {
      const userId = 12345;
      const data = { pizza: 'margherita', size: 'medium' };

      manager.setUserData(userId, data);
      const result = manager.getUserData(userId);

      expect(result).toEqual(data);
    });

    test('should update user data', () => {
      const userId = 12345;
      const initialData = { pizza: 'margherita' };
      const updateData = { size: 'medium' };

      manager.setUserData(userId, initialData);
      manager.updateUserData(userId, updateData);
      const result = manager.getUserData(userId);

      expect(result).toEqual({ pizza: 'margherita', size: 'medium' });
    });

    test('should return empty object for non-existent user data', () => {
      const userId = 99999;

      const result = manager.getUserData(userId);

      expect(result).toEqual({});
    });
  });

  describe('Order Management', () => {
    test('should create order', () => {
      const userId = 12345;
      const orderData = {
        items: ['Pizza Margherita'],
        total: 500,
        type: 'menu',
        address: 'Test address',
        deliveryTime: 30
      };

      const order = manager.createOrder(userId, orderData);

      expect(order).toHaveProperty('id');
      expect(order.userId).toBe(userId);
      expect(order.status).toBe('received');
      expect(order.items).toEqual(orderData.items);
      expect(order.total).toBe(orderData.total);
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    test('should get order by ID', () => {
      const userId = 12345;
      const orderData = {
        items: ['Pizza Margherita'],
        total: 500,
        type: 'menu',
        address: 'Test address',
        deliveryTime: 30
      };

      const order = manager.createOrder(userId, orderData);
      const retrievedOrder = manager.getOrder(order.id);

      expect(retrievedOrder).toEqual(order);
    });

    test('should get user orders', () => {
      const userId = 12345;
      const orderData = {
        items: ['Pizza Margherita'],
        total: 500,
        type: 'menu',
        address: 'Test address',
        deliveryTime: 30
      };

      const order = manager.createOrder(userId, orderData);
      const userOrders = manager.getUserOrders(userId);

      expect(userOrders).toHaveLength(1);
      expect(userOrders[0]).toEqual(order);
    });

    test('should update order status', () => {
      const userId = 12345;
      const orderData = {
        items: ['Pizza Margherita'],
        total: 500,
        type: 'menu',
        address: 'Test address',
        deliveryTime: 30
      };

      const order = manager.createOrder(userId, orderData);
      const updatedOrder = manager.updateOrderStatus(order.id, 'preparing');

      expect(updatedOrder.status).toBe('preparing');
      expect(updatedOrder.updatedAt).toBeInstanceOf(Date);
    });

    test.each([
      ['preparing', 35],
      ['baking', 25],
      ['ready', 20],
      ['delivering', 15],
      ['delivered', 0]
    ])('should adjust estimated delivery for %s status', (status, minutes) => {
      const userId = 54321;
      const orderData = {
        items: ['Four Seasons'],
        total: 750,
        type: 'menu',
        address: 'Another address',
        deliveryTime: 30
      };

      const fixedNow = 1_700_000_000_000;
      const shouldMockNow = minutes > 0;
      const nowSpy = shouldMockNow ? jest.spyOn(Date, 'now').mockReturnValue(fixedNow) : null;

      const order = manager.createOrder(userId, orderData);
      const updatedOrder = manager.updateOrderStatus(order.id, status);

      expect(updatedOrder.status).toBe(status);

      if (minutes === 0) {
        expect(updatedOrder.estimatedDelivery.getTime()).toBeLessThanOrEqual(Date.now());
      } else {
        const expectedTimestamp = fixedNow + minutes * 60 * 1000;
        expect(updatedOrder.estimatedDelivery.getTime()).toBe(expectedTimestamp);
      }

      nowSpy?.mockRestore();
    });

    test('should return null when updating non-existent order', () => {
      const result = manager.updateOrderStatus('non_existent_order', 'preparing');

      expect(result).toBeNull();
    });
  });

  describe('Cleanup and Activity', () => {
    test('should cleanup old states', () => {
      const userId = 12345;
      
      // Создаем состояние и устанавливаем время активности
      manager.setState(userId, 'TEST_STATE');
      // Вручную устанавливаем lastActivity для теста
      const userState = manager.userStates.get(userId);
      userState.lastActivity = Date.now() - 25 * 60 * 60 * 1000; // 25 часов назад

      manager.cleanupOldStates(24 * 60 * 60 * 1000); // Cleanup older than 24 hours

      expect(manager.getState(userId)).toBeUndefined();
    });

    test('should not cleanup recent states', () => {
      const userId = 12345;
      
      manager.setState(userId, 'TEST_STATE');
      // Вручную устанавливаем lastActivity для теста (1 час назад)
      const userState = manager.userStates.get(userId);
      userState.lastActivity = Date.now() - 60 * 60 * 1000;

      manager.cleanupOldStates(24 * 60 * 60 * 1000); // Cleanup older than 24 hours

      expect(manager.getState(userId)).toBe('TEST_STATE');
    });

    test('should update activity', () => {
      const userId = 12345;
      manager.setState(userId, 'TEST_STATE');

      // Изначально lastActivity не установлен
      const userState = manager.userStates.get(userId);
      expect(userState.lastActivity).toBeUndefined();

      // Вызываем updateActivity
      manager.updateActivity(userId);

      // После вызова lastActivity должен быть установлен
      expect(userState.lastActivity).toBeDefined();
      expect(typeof userState.lastActivity).toBe('number');
    });

    test('should handle updateActivity for non-existent state', () => {
      const userId = 99999;

      // Не должно выбрасывать ошибку
      expect(() => manager.updateActivity(userId)).not.toThrow();
    });
  });

  describe('Additional Methods', () => {
    test('should return all states for debugging', () => {
      const userId1 = 12345;
      const userId2 = 67890;
      
      manager.setState(userId1, 'STATE_1');
      manager.setState(userId2, 'STATE_2');

      const allStates = manager.getAllStates();

      expect(allStates).toHaveProperty(userId1.toString());
      expect(allStates).toHaveProperty(userId2.toString());
    });

    test('should handle cleanup with no lastActivity', () => {
      const userId = 12345;
      
      manager.setState(userId, 'TEST_STATE');
      // Не устанавливаем lastActivity

      manager.cleanupOldStates(24 * 60 * 60 * 1000);

      // Состояние должно остаться, так как нет lastActivity
      expect(manager.getState(userId)).toBe('TEST_STATE');
    });
  });
});

describe('stateManager singleton', () => {
  test('should be instance of StateManager', () => {
    expect(stateManager).toBeInstanceOf(StateManager);
  });

  test('should maintain state between operations', () => {
    const userId = 12345;
    
    stateManager.setState(userId, 'TEST_STATE');
    const state = stateManager.getState(userId);

    expect(state).toBe('TEST_STATE');
  });
});