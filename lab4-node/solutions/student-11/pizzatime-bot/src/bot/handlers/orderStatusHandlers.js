import { ORDER_STATUSES } from '../states/orderStatusState.js';
import { stateManager } from '../../utils/stateManager.js';
import { getMainKeyboard } from '../keyboards.js';

export function handleOrderStatus(bot, chatId) {
  try {
    const userOrders = stateManager.getUserOrders(chatId);
    
    let message = `
📋 Статус заказов 📋

Здесь вы можете отслеживать статус ваших заказов.
    `;

    if (userOrders.length === 0) {
      message += '\n\nУ вас пока нет активных заказов.';
      
      bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Обновить', callback_data: 'status_refresh' }]
          ]
        }
      }).catch(error => {
        console.error('Error sending order status:', error.message);
      });
      return;
    }

    // Сортируем заказы по дате создания (новые сначала)
    const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const keyboard = sortedOrders.map(order => [
      {
        text: `Заказ #${order.id.slice(-3)} - ${ORDER_STATUSES[order.status].emoji} ${ORDER_STATUSES[order.status].status}`,
        callback_data: `status_${order.id}`
      }
    ]);

    keyboard.push([
      { text: '🔄 Обновить статус', callback_data: 'status_refresh' }
    ]);

    bot.sendMessage(chatId, message, {
      reply_markup: { inline_keyboard: keyboard }
    }).catch(error => {
      console.error('Error sending order status:', error.message);
    });
  } catch (error) {
    console.error('Error in handleOrderStatus:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при загрузке статуса заказов. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}

export function handleOrderStatusCallback(bot, chatId, data) {
  try {
    if (data.startsWith('status_')) {
      const orderId = data.replace('status_', '');
      
      if (orderId === 'refresh') {
        handleOrderStatus(bot, chatId);
        return;
      }

      const order = stateManager.getOrder(orderId);
      if (order) {
        const status = ORDER_STATUSES[order.status];
        const createdTime = order.createdAt.toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        const createdDate = order.createdAt.toLocaleDateString('ru-RU');
        const estimatedTime = order.estimatedDelivery.toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        const message = `
📦 Заказ #${order.id.slice(-3)}

${status.emoji} Статус: ${status.status}
📝 Описание: ${status.description}
⏰ Примерное время доставки: ${status.estimatedTime}

🍕 Состав заказа:
${order.items.map(item => `• ${item}`).join('\n')}

💰 Сумма: ${order.total}₽
🕐 Создан: ${createdDate} в ${createdTime}
🚀 Ожидаемая доставка: ${estimatedTime}

Мы уведомим вас об изменении статуса заказа!
        `;

        bot.sendMessage(chatId, message, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: '📋 К списку заказов', callback_data: 'status_back' },
                { text: '🔄 Обновить', callback_data: `status_${order.id}` }
              ]
            ]
          }
        }).catch(error => {
          console.error('Error sending order details:', error.message);
        });
      } else {
        bot.sendMessage(chatId, 'Заказ не найден. Возможно, он был удален или завершен.', {
          reply_markup: getMainKeyboard()
        }).catch(error => console.error('Error sending not found message:', error.message));
      }
    }
    else if (data === 'status_back') {
      handleOrderStatus(bot, chatId);
    }
  } catch (error) {
    console.error('Error in handleOrderStatusCallback:', error.message);
    bot.sendMessage(chatId, 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.', {
      reply_markup: getMainKeyboard()
    }).catch(err => console.error('Error sending error message:', err.message));
  }
}