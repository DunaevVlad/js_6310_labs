export const ORDER_STATUSES = {
  received: { 
    status: 'Принят', 
    description: 'Ваш заказ принят и ожидает подтверждения',
    emoji: '📥',
    estimatedTime: '10-15 минут'
  },
  preparing: { 
    status: 'Готовится', 
    description: 'Ваша пицца готовится нашими поварами',
    emoji: '👨‍🍳',
    estimatedTime: '15-20 минут'
  },
  baking: { 
    status: 'Выпекается', 
    description: 'Пицца выпекается в печи',
    emoji: '🔥',
    estimatedTime: '10-15 минут'
  },
  ready: { 
    status: 'Готов', 
    description: 'Пицца готова к доставке',
    emoji: '✅',
    estimatedTime: '5-10 минут'
  },
  delivering: { 
    status: 'Доставляется', 
    description: 'Курьер в пути к вам',
    emoji: '🚗',
    estimatedTime: '20-30 минут'
  },
  delivered: { 
    status: 'Доставлен', 
    description: 'Заказ доставлен! Приятного аппетита!',
    emoji: '🎉',
    estimatedTime: '0 минут'
  }
};

// Тестовые заказы (можно удалить после тестирования)
export const sampleOrders = {
  'order_001': {
    id: 'order_001',
    status: 'preparing',
    items: ['Маргарита средняя'],
    total: 500,
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 минут назад
    estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000) // через 25 минут
  },
  'order_002': {
    id: 'order_002',
    status: 'delivering',
    items: ['Пепперони большая', 'Кастомная пицца'],
    total: 1200,
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 минут назад
    estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000) // через 15 минут
  }
};