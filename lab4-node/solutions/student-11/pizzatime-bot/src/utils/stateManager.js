class StateManager {
  constructor() {
    this.userStates = new Map();
    this.userData = new Map();
    this.orders = new Map();
    this.orderCounter = 1;
  }

  // Управление состояниями
  setState(userId, state) {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, {});
    }
    this.userStates.get(userId).current = state;
  }

  getState(userId) {
    return this.userStates.get(userId)?.current;
  }

  resetState(userId) {
    // Сбрасываем только состояние, но не удаляем данные пользователя
    this.userStates.delete(userId);
    
    // Очищаем только временные данные заказа, но сохраняем историю заказов
    const userData = this.getUserData(userId);
    const orders = userData.orders || [];
    this.setUserData(userId, { orders });
  }

  // Управление данными пользователя
  setUserData(userId, data) {
    this.userData.set(userId, data);
  }

  getUserData(userId) {
    return this.userData.get(userId) || {};
  }

  updateUserData(userId, newData) {
    const currentData = this.getUserData(userId);
    this.setUserData(userId, { ...currentData, ...newData });
  }

  // Управление заказами
  createOrder(userId, orderData) {
    const orderId = `order_${String(this.orderCounter).padStart(3, '0')}`;
    const order = {
      id: orderId,
      userId,
      status: 'received',
      items: orderData.items,
      total: orderData.total,
      type: orderData.type,
      address: orderData.address,
      deliveryTime: orderData.deliveryTime,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + orderData.deliveryTime * 60 * 1000),
      ...orderData
    };

    this.orders.set(orderId, order);
    this.orderCounter++;
    
    // Добавляем заказ в историю пользователя
    const userData = this.getUserData(userId);
    const userOrders = userData.orders || [];
    userOrders.push(orderId);
    this.updateUserData(userId, { orders: userOrders });

    return order;
  }

  getOrder(orderId) {
    return this.orders.get(orderId);
  }

  getUserOrders(userId) {
    const userData = this.getUserData(userId);
    const orderIds = userData.orders || [];
    return orderIds.map(orderId => this.getOrder(orderId)).filter(Boolean);
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.get(orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date();
      
      // Обновляем время доставки в зависимости от статуса
      switch (newStatus) {
        case 'preparing':
          order.estimatedDelivery = new Date(Date.now() + 35 * 60 * 1000);
          break;
        case 'baking':
          order.estimatedDelivery = new Date(Date.now() + 25 * 60 * 1000);
          break;
        case 'ready':
          order.estimatedDelivery = new Date(Date.now() + 20 * 60 * 1000);
          break;
        case 'delivering':
          order.estimatedDelivery = new Date(Date.now() + 15 * 60 * 1000);
          break;
        case 'delivered':
          order.estimatedDelivery = new Date();
          break;
      }
      
      return order;
    }
    return null;
  }

  // Получение всех активных состояний (для отладки)
  getAllStates() {
    return Object.fromEntries(this.userStates);
  }

  // Очистка старых состояний (можно запускать периодически)
  cleanupOldStates(maxAge = 24 * 60 * 60 * 1000) { // 24 часа по умолчанию
    const now = Date.now();
    for (const [userId, stateData] of this.userStates.entries()) {
      if (stateData.lastActivity && (now - stateData.lastActivity > maxAge)) {
        this.userStates.delete(userId);
        this.userData.delete(userId);
      }
    }
  }

  // Обновление времени последней активности
  updateActivity(userId) {
    if (this.userStates.has(userId)) {
      this.userStates.get(userId).lastActivity = Date.now();
    }
  }
}

// Создаем единственный экземпляр (синглтон)
const stateManager = new StateManager();

export { StateManager, stateManager };