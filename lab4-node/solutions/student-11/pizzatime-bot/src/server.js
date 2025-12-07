import express from 'express';
import { config } from 'dotenv';
import { stateManager } from './utils/stateManager.js';

// Загружаем переменные окружения
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Валидация входящих запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Базовый эндпоинт для проверки здоровья
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'PizzaTime 2 API',
    timestamp: new Date().toISOString()
  });
});

// Эндпоинт для получения информации о заказе
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ 
        error: 'Order ID is required' 
      });
    }
    
    const order = stateManager.getOrder(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        items: order.items,
        total: order.total,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      }
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Эндпоинт для обновления статуса заказа
app.patch('/api/orders/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!orderId || !status) {
      return res.status(400).json({ 
        error: 'Order ID and status are required' 
      });
    }
    
    const validStatuses = ['received', 'preparing', 'baking', 'ready', 'delivering', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const updatedOrder = stateManager.updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ 
        error: 'Order not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        estimatedDelivery: updatedOrder.estimatedDelivery
      }
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Эндпоинт для получения статистики (для админки)
app.get('/api/stats', (req, res) => {
  try {
    const allStates = stateManager.getAllStates();
    const activeUsers = Object.keys(allStates).length;
    
    res.json({
      success: true,
      stats: {
        activeUsers,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Обработка несуществующих маршрутов
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// Обработка ошибок
app.use((error, req, res) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🌐 API сервер запущен на порту ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;